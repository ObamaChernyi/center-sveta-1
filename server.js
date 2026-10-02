const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

const DATA_FILE = path.join(__dirname, "data.json");

app.use(express.json());
app.use(express.static(__dirname));


function readData() {
    try {
        const data = fs.readFileSync(DATA_FILE, "utf8");
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
        JSON.stringify(data, null, 4),
        "utf8"
    );
}


// Получить все данные
app.get("/api/data", (req, res) => {

    const data = readData();

    res.json(data);

});


// Добавить товар
app.post("/api/products", (req, res) => {

    const data = readData();

    const product = {
        id: Date.now(),
        name: req.body.name,
        price: Number(req.body.price),
        category: req.body.category,
        image: req.body.image,
        description: req.body.description || ""
    };

    data.products.push(product);

    saveData(data);

    res.json({
        success: true,
        product: product
    });

});


// Удалить товар
app.delete("/api/products/:id", (req, res) => {

    const data = readData();

    const id = Number(req.params.id);

    data.products = data.products.filter(
        product => product.id !== id
    );

    saveData(data);

    res.json({
        success: true
    });

});


app.get("/api/test", (req, res) => {

    res.json({
        success: true,
        message: "Сервер работает!"
    });

});


app.listen(PORT, () => {

    console.log(
        `Сервер запущен: http://localhost:${PORT}`
    );

});