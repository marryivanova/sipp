from typing import List


class MessageRule:
    """Класс для хранения правила обработки сообщения"""

    def __init__(self, keywords: List[str], response: str, priority: int = 0):
        self.keywords = keywords
        self.response = response
        self.priority = priority

    def match(self, message: str) -> bool:
        return any(keyword in message for keyword in self.keywords)


class ChatHandler:
    """Обработчик чата с управлением правилами и сообщениями"""

    def __init__(self):
        self.rules: List[MessageRule] = []
        self.default_response: str = (
            "Спасибо за ваш вопрос! Наш специалист свяжется с вами. "
            "А пока я могу ответить на вопросы о ценах, доставке или сертификатах."
        )
        self._init_default_rules()

    def _init_default_rules(self) -> None:
        """Инициализация правил по умолчанию"""
        self.add_rule(["привет", "здравствуй"], "Здравствуйте! Рад вас видеть! 👋")
        self.add_rule(
            ["цена", "стоимость"],
            "💰 Стоимость зависит от типа материала и объёма. Оставьте заявку — и мы сделаем расчёт!",
        )
        self.add_rule(
            ["доставк"], "🚚 Доставка по РФ и СНГ. Сроки и стоимость рассчитываются индивидуально."
        )
        self.add_rule(
            ["сертификат"],
            "📋 Вся продукция сертифицирована по ISO 9001:2015. \n"
            "Для получения сертификатов на электронную почту, пожалуйста, заполните форму выше "
            "и укажите в комментариях запрос на сертификаты.",
        )
        self.add_rule(
            ["консультац"],
            "🔧 Наши технологи готовы проконсультировать вас по подбору материалов. "
            "Для этого вы можете заполнить форму выше и с Вами свяжутся в ближайшее время.",
        )
        self.add_rule(["пока", "до свидания"], "До свидания! Будем рады помочь вам снова! 👋")

    def add_rule(self, keywords: List[str], response: str, priority: int = 0) -> None:
        """Добавляет новое правило обработки"""
        rule = MessageRule(keywords, response, priority)
        self.rules.append(rule)
        self.rules.sort(key=lambda r: r.priority, reverse=True)

    def process_message(self, message: str, client_id: str) -> str:
        """
        Обрабатывает сообщение и возвращает ответ
        """
        cleaned_message = message.lower().strip()

        for rule in self.rules:
            if rule.match(cleaned_message):
                return rule.response

        return self.default_response

    @staticmethod
    def get_greeting() -> str:
        return f"Здравствуйте! 👋\n Меня зовут Ассистент SIPP-PROM.\n Чем я могу вам помочь?\n"


chat_handler = ChatHandler()
