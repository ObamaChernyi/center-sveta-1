const path = require("path");

require("dotenv").config({
    path: path.join(__dirname, ".env")
});

const express = require("express");
const { GoogleGenAI } = require("@google/genai");

const app = express();
const PORT = process.env.PORT || 3000;

// Разрешаем JSON
app.use(express.json());

// CORS
app.use((req, res, next) => {
    res.header(
        "Access-Control-Allow-Origin",
        "*"
    );

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

// Проверяем API ключ
console.log(
    "API KEY:",
    process.env.GEMINI_API_KEY
        ? "КЛЮЧ НАЙДЕН"
        : "КЛЮЧ НЕ НАЙДЕН"
);

// Главная страница
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

        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return res.status(500).json({
                error: "GEMINI_API_KEY не найден"
            });
        }

        const ai = new GoogleGenAI({
            apiKey: apiKey
        });

        const prompt = `
Ты — профессиональный AI-консультант магазина «Центр Света» в Бишкеке.

Твоя задача — помогать клиентам выбирать люстры и освещение.

Учитывай:
- размер комнаты;
- высоту потолка;
- назначение помещения;
- стиль интерьера;
- цвет интерьера;
- желаемый внешний вид;
- бюджет клиента.

Отвечай на русском языке.
Будь дружелюбным, понятным и кратким.
Не выдумывай конкретные товары, цены или наличие, если этих данных нет.

Если клиент не сообщил важные параметры, задай ему уточняющий вопрос.

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

// Запуск сервера
app.listen(PORT, "0.0.0.0", () => {
    console.log("================================");
    console.log("ЦЕНТР СВЕТА - AI SERVER");
    console.log("================================");
    console.log("Сервер запущен на порту:", PORT);
});