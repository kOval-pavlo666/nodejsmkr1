const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Підключення до MongoDB
mongoose.connect('mongodb://localhost:27017/productOfEvenDigitsDB', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Помилка підключення до бази даних:'));
db.once('open', function() {
  console.log('Підключено до бази даних');
});

// Схема моделі для зберігання даних
const NumberSchema = new mongoose.Schema({
  number: { type: Number, required: true },
  productOfEvenDigits: { type: Number, required: true }
});

const Number = mongoose.model('Number', NumberSchema);

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
    const number = new Number({ number: n, productOfEvenDigits: product });
    await number.save();
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
