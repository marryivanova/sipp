import os
from datetime import datetime

from jinja2 import Environment, FileSystemLoader
from loguru import logger

template_dir = os.path.join(os.path.dirname(__file__))
env = Environment(loader=FileSystemLoader(template_dir))


def load_html_template_jinja(name: str, email: str, phone: str, info: str) -> str:
    try:
        template = env.get_template("template_email.html")

        html_content = template.render(
            name=name, email=email, phone=phone, info=info, date=datetime.now().strftime("%d.%m.%Y %H:%M")
        )

        logger.info("✅ Шаблон сгенерирован через Jinja2")
        return html_content

    except Exception as e:
        logger.error(f"❌ Ошибка Jinja2: {str(e)}")
        raise
