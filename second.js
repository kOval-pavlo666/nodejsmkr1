const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Підключення до MongoDB
mongoose.connect('mongodb://localhost:27017/nodemkr1', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Помилка підключення до бази даних:'));
db.once('open', function() {
  console.log('Підключено до бази даних');
});

const secondModel = require('./models/second.model');

// Middlewares
app.use(bodyParser.json());

// Роут для обробки запиту
app.post('/product-of-even-digits', async (req, res) => {
  const { n } = req.body;

  if (typeof n !== 'number' || !Number.isInteger(n) || n <= 0) {
    return res.status(400).json({ error: 'Потрібно передати натуральне число' });
  }

  const product = findProductOfEvenDigits(n);

  try {
    await secondModel.create({ number: n, productOfEvenDigits: product });
    res.json({ product });
  } catch (error) {
    console.error('Помилка збереження даних у базі даних:', error);
    res.status(500).json({ error: 'Помилка сервера' });
  }
});

// Функція для знаходження добутку парних цифр числа
function findProductOfEvenDigits(n) {
  let product = 1;
  let digits = n.toString().split('').map(Number);

  for (let digit of digits) {
    if (digit % 2 === 0) {
      product *= digit;
    }
  }

  return product;
}

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущено на порті ${PORT}`);
});
