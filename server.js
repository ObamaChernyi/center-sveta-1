const express = require("express");
const fs = require("fs");
const path = require("path");
const { GoogleGenAI } = require("@google/genai");

const app = express();

const PORT = process.env.PORT || 3000;

const DATA_FILE = path.join(__dirname, "data.json");

// ================================
// НАСТРОЙКИ
// ================================

app.use(express.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Methods",
        "GET, POST, DELETE, OPTIONS"
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

// ================================
// САЙТ
// ================================

app.use(express.static(__dirname));

// ================================
// DATA.JSON
// ================================

function readData() {

    try {

        const data =
            fs.readFileSync(
                DATA_FILE,
                "utf8"
            );

        return JSON.parse(data);

    } catch (error) {

        return {
            products: [],
            orders: [],
            favorites: []
        };

    }

}


function saveData(data) {

    fs.writeFileSync(
        DATA_FILE,
        JSON.stringify(
            data,
            null,
            4
        ),
        "utf8"
    );

}

// ================================
// ПОЛУЧИТЬ ДАННЫЕ
// ================================

app.get("/api/data", (req, res) => {

    const data = readData();

    res.json(data);

});

// ================================
// ДОБАВИТЬ ТОВАР
// ================================

app.post("/api/products", (req, res) => {

    const data = readData();

    const product = {

        id: Date.now(),

        name: req.body.name,

        price: Number(req.body.price),

        category: req.body.category,

        image: req.body.image,

        description:
            req.body.description || ""

    };

    data.products.push(product);

    saveData(data);

    res.json({

        success: true,

        product: product

    });

});

// ================================
// УДАЛИТЬ ТОВАР
// ================================

app.delete(
    "/api/products/:id",
    (req, res) => {

        const data = readData();

        const id =
            Number(req.params.id);

        data.products =
            data.products.filter(
                product =>
                    product.id !== id
            );

        saveData(data);

        res.json({

            success: true

        });

    }
);

// ================================
// ПРОВЕРКА СЕРВЕРА
// ================================

app.get("/api/test", (req, res) => {

    res.json({

        success: true,

        message:
            "Центр Света — сервер работает!"

    });

});

// ================================
// GEMINI AI
// ================================

app.post("/api/ai", async (req, res) => {

    try {

        const message =
            req.body.message;

        if (
            !message ||
            !message.trim()
        ) {

            return res.status(400).json({

                error:
                    "Сообщение пустое"

            });

        }

        const apiKey =
            process.env.GEMINI_API_KEY;

        if (!apiKey) {

            console.error(
                "GEMINI_API_KEY НЕ НАЙДЕН"
            );

            return res.status(500).json({

                error:
                    "GEMINI_API_KEY не найден"

            });

        }

        console.log(
            "Получен запрос AI:",
            message
        );

        const ai =
            new GoogleGenAI({

                apiKey: apiKey

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

Отвечай на русском языке.

Будь дружелюбным, понятным и кратким.

Не выдумывай конкретные товары,
цены или наличие, если этих данных нет.

Если клиент не сообщил важные параметры,
задай уточняющий вопрос.

Вопрос клиента:

${message}

`;

        const response =
            await ai.models.generateContent({

                model:
                    "gemini-3.8-flash",

                contents:
                    prompt

            });

        console.log(
            "AI успешно ответил"
        );

        res.json({

            answer:
                response.text

        });

    } catch (error) {

        console.error(
            "ОШИБКА GEMINI:",
            error
        );

        res.status(500).json({

            error:
                "Не удалось получить ответ от AI"

        });

    }

});

// ================================
// ЗАПУСК
// ================================

app.listen(
    PORT,
    "0.0.0.0",
    () => {

        console.log(
            "================================"
        );

        console.log(
            "ЦЕНТР СВЕТА"
        );

        console.log(
            "СЕРВЕР + AI"
        );

        console.log(
            "================================"
        );

        console.log(
            "Порт:",
            PORT
        );

        console.log(
            "Gemini API:",
            process.env.GEMINI_API_KEY
                ? "КЛЮЧ НАЙДЕН"
                : "КЛЮЧ НЕ НАЙДЕН"
        );

    }
);
```
