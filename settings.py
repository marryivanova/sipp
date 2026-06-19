from functools import lru_cache

from pydantic.v1 import BaseSettings, Field


class AppSettings(BaseSettings):

    debug: bool = Field(default=False)
    host: str = Field(default="127.0.0.1")
    port: int = Field(default=8000)
    nginx_conf_filename: str = Field(default="")
    environment: str = Field(default="production")


class ConfigForUvicornRun(BaseSettings):
    port: int = Field(8000, env="APP_PORT")
    host: str = Field("0.0.0.0", env="APP_HOST")
    domain: str = Field("http://", env="APP_DOMAIN")


class SmtpSettings(BaseSettings):
    email: str = Field(env="SMTP_EMAIL")
    password: str = Field(env="SMTP_PASSWORD")
    smtp_server: str = Field(env="SMTP_SERVER")
    smtp_port: int = Field(env="SMTP_PORT")


class MainSettings(BaseSettings):
    app: AppSettings = Field(default_factory=AppSettings)
    smtp: SmtpSettings = Field(default_factory=SmtpSettings)

    admin_username: str = Field("admin", env="ADMIN_USERNAME")
    admin_password: str = Field("567NHDFHDN3rjffn34_Dwf", env="ADMIN_PASSWORD")

    swagger_login: str = Field(default="", env="SWAGGER_LOGIN")
    swagger_token: str = Field(default="", env="SWAGGER_TOKEN")

    environment: str = Field("", env="ENVIRONMENT")
    test_user_id: int = Field(1, env="TEST_USER_ID")
    sentry_dsn: str = Field("", env="SENTRY_DSN")

    sendgrid_token: str = Field(default="", env="SENDGRID_TOKEN")

    fastapi_config: ConfigForUvicornRun = ConfigForUvicornRun()


@lru_cache()
def get_settings() -> MainSettings:
    """Function for getting all settings."""
    return MainSettings()


settings = get_settings()
