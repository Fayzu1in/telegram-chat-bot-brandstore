import express from 'express';
import axios from 'axios';

const app = express();
app.use(express.json());

const TELEGRAM_BOT_TOKEN = '8174290649:AA...'; // Вставь сюда свой токен бота
const TELEGRAM_CHAT_ID = '-1004489485860';

app.all('/jivo-webhook', async (req, res) => {
  try {
    const data = req.body || {};
    
    // Простейшая проверка от Jivo / браузера
    if (req.method === 'GET') {
      return res.status(200).send('Jivo Webhook Listener is active');
    }

    const eventName = data.event_name || 'Событие Jivo';
    const messageText = data.message?.text || data.text || 'Новое сообщение';
    const clientName = data.visitor?.name || 'Клиент';

    const text = `📬 *${eventName}*\n👤 *От:* ${clientName}\n💬 *Текст:* ${messageText}`;

    await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      chat_id: TELEGRAM_CHAT_ID,
      text: text,
      parse_mode: 'Markdown'
    });

    res.status(200).json({ result: 'ok' });
  } catch (error) {
    console.error('Error sending to Telegram:', error?.response?.data || error.message);
    res.status(200).json({ result: 'error', details: error.message });
  }
});

app.get('/', (req, res) => {
  res.send('Server is running');
});

export default app;
