const express = require("express");
const { GoogleGenAI } = require("@google/genai");

const app = express();

const PORT = process.env.PORT || 3000;

// Разрешаем принимать JSON
app.use(express.json());

// Разрешаем запросы с сайта
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS"
    );
    res.header(
        "Access-Control-Allow-Headers",
        "Content-Type"
    );

    if (req.method === "OPTIONS") {
        return res.sendStatus(204);
    }

    next();
});

// Проверяем API-ключ
console.log(
    "API KEY:",
    process.env.GEMINI_API_KEY
        ? "КЛЮЧ НАЙДЕН"
        : "КЛЮЧ НЕ НАЙДЕН"
);

// Проверка сервера
app.get("/", (req, res) => {
    res.send("Центр Света - AI сервер работает!");
});

// AI консультант
app.post("/api/ai", async (req, res) => {
    try {
        const message = req.body.message;

        if (!message || !message.trim()) {
            return res.status(400).json({
                error: "Сообщение пустое"
            });
        }

        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({
                error: "GEMINI_API_KEY не найден"
            });
        }

        const ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY
        });

        const prompt = `
Ты — профессиональный AI-консультант магазина «Центр Света» в Бишкеке.

Помогай клиентам выбирать люстры и освещение.

Учитывай:
- размер комнаты;
- высоту потолка;
- назначение помещения;
- стиль интерьера;
- цвет интерьера;
- желаемый внешний вид;
- бюджет клиента.

Отвечай только на русском языке.
Будь дружелюбным, понятным и кратким.

Не выдумывай конкретные товары, цены или наличие,
если такой информации нет.

Если клиент не сообщил важные параметры,
задай уточняющий вопрос.

Вопрос клиента:
${message}
`;

        const response = await ai.models.generateContent({
            model: "gemini-3.8-flash",
            contents: prompt
        });

        res.json({
            answer: response.text
        });

    } catch (error) {
        console.error("ОШИБКА GEMINI:", error);

        res.status(500).json({
            error: "Не удалось получить ответ от AI"
        });
    }
});

// Запускаем сервер
app.listen(PORT, "0.0.0.0", () => {
    console.log("================================");
    console.log("ЦЕНТР СВЕТА - AI SERVER");
    console.log("================================");
    console.log("Сервер запущен на порту:", PORT);
});
```
