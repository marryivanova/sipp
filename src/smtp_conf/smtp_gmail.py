from fastapi_mail import ConnectionConfig

from settings import settings

conf = ConnectionConfig(
    MAIL_USERNAME=settings.smtp.mail_username,
    MAIL_PASSWORD=settings.smtp.mail_password,
    MAIL_FROM=settings.smtp.mail_from,
    MAIL_PORT=settings.smtp.mail_port,
    MAIL_SERVER=settings.smtp.mail_server,
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True,
)
