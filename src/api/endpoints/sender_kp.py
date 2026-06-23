from fastapi import APIRouter, BackgroundTasks, HTTPException
from fastapi_mail import FastMail, MessageSchema, MessageType
from loguru import logger
from pydantic import BaseModel, EmailStr

from src.api.endpoints.template.template_data import load_html_template_jinja
from src.smtp_conf import conf

router = APIRouter(prefix="/api", tags=["Sender KP email owner"])


class ResponseSendemail(BaseModel):
    status: str
    message: str
    data: dict


class EmailRequest(BaseModel):
    name: str
    email: EmailStr | str
    phone_number: str
    info: str


@router.post("/send-email")
async def send_email(request: EmailRequest, background_tasks: BackgroundTasks):
    try:

        html = load_html_template_jinja(
            name=request.name, email=request.email, phone=request.phone_number, info=request.info
        )
        message = MessageSchema(
            subject=f"Заявка от {request.name}",
            recipients=[request.email],
            body=html,
            subtype=MessageType.html,
        )
        fm = FastMail(conf)
        background_tasks.add_task(send_email_task, fm, message, request)

        logger.info("📤 Ответ отправлен клиенту")
        logger.info("=" * 50)

        return ResponseSendemail(
            status="ok",
            message="Письмо отправляется",
            data=dict(to=request.email, subject=f"Заявка от {request.name}"),
        )

    except Exception as e:
        logger.error(f"❌ ОШИБКА при обработке запроса: {str(e)}")
        logger.error(f"   Тип ошибки: {type(e).__name__}")
        logger.error("=" * 50)
        raise HTTPException(status_code=500, detail=f"Ошибка при отправке: {str(e)}")


async def send_email_task(fm: FastMail, message: MessageSchema, request: EmailRequest):
    """Функция для фоновой отправки письма"""
    try:
        result = await fm.send_message(message)

        logger.info(f"✅ ПИСЬМО УСПЕШНО ОТПРАВЛЕНО!")
        logger.info(f"   📬 Получатель: {request.email}")
        logger.info(f"   📋 Результат: {result}")
        logger.info("🔄 ФОНОВАЯ ОТПРАВКА ЗАВЕРШЕНА")

    except Exception as e:
        logger.error(f"❌ ОШИБКА при фоновой отправке:")
        logger.error(f"   📧 Получатель: {request.email}")
        logger.error(f"   ❗ Ошибка: {str(e)}")
        logger.error(f"   📋 Тип: {type(e).__name__}")

        if "Authentication failed" in str(e):
            logger.error("   🔑 Ошибка аутентификации! Проверьте логин и пароль")
        elif "Connection refused" in str(e):
            logger.error("   🌐 Ошибка подключения! Проверьте настройки SMTP")
        elif "Timeout" in str(e):
            logger.error("   ⏰ Таймаут подключения! Проверьте интернет")

        logger.error("🔄 ФОНОВАЯ ОТПРАВКА ЗАВЕРШЕНА С ОШИБКОЙ")
