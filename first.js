const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

const dataFilePath = path.join(__dirname, 'requests.json');
const mongodb_uri = "mongodb://localhost:27017/nodemkr1"

const calculateModel = require('./models/calculate.model');


mongoose.connect(mongodb_uri).then(() => {
  console.log("Mongo DB connected");
});
// Middlewares
app.use(bodyParser.json());

// Endpoint для обчислення радіусів
app.post('/calculate', async (req, res) => {
  const { side1, side2, side3 } = req.body;

  // Перевірка вхідних даних
  if (!side1 || !side2 || !side3 || side1 <= 0 || side2 <= 0 || side3 <= 0) {
    return res.status(400).json({ error: 'Неправильні вхідні дані' });
  }

  // Обчислення радіусів
  const s = (side1 + side2 + side3) / 2;
  const inscribedRadius = Math.sqrt(((s - side1) * (s - side2) * (s - side3)) / s);
  const circumscribedRadius = (side1 * side2 * side3) / (4 * Math.sqrt(s * (s - side1) * (s - side2) * (s - side3)));

  // Збереження запиту та результату у JSON-файлі
  const requestData = {
    timestamp: new Date(),
    input: { side1, side2, side3 },
    result: { inscribedRadius, circumscribedRadius }
  };
  await calculateModel.create(requestData);
  fs.readFile(dataFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Помилка зчитування JSON-файлу:', err);
      return res.status(500).json({ error: 'Помилка сервера' });
    }

    let requests = [];
    if (data) {
      requests = JSON.parse(data);
    }

    requests.push(requestData);
    
    fs.writeFile(dataFilePath, JSON.stringify(requests, null, 2), (err) => {
      if (err) {
        console.error('Помилка запису у JSON-файл:', err);
        return res.status(500).json({ error: 'Помилка сервера' });
      }
      res.json({ inscribedRadius, circumscribedRadius });
    });
  });

});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущено на порті ${PORT}`);
});
