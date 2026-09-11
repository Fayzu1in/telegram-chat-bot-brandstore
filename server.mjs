import express from 'express';
import axios from 'axios';

const app = express();
app.use(express.json());

const TELEGRAM_BOT_TOKEN = '8174290649:AAHWsd3npj68BbWYN9-SEfJnJl98x_myzf4';
const TELEGRAM_CHAT_ID = '-1004489485860';

app.all('/jivo-webhook', async (req, res) => {
  try {
    const data = req.body || {};
    
    // Проверка статуса для GET-запроса из браузера
    if (req.method === 'GET') {
      return res.status(200).send('Jivo Webhook Listener is active');
    }

    const eventName = data.event_name || 'Событие';
    const clientName = data.visitor?.name || 'Не указано';
    const clientPhone = data.visitor?.phone || 'Не указан';
    const clientEmail = data.visitor?.email || 'Не указан';
    const messageText = data.message?.text || data.text || 'Без текста (обновление данных клиента)';

    const text = `📬 *Событие Jivo:* ${eventName}\n\n` +
                 `👤 *Имя:* ${clientName}\n` +
                 `📞 *Телефон:* ${clientPhone}\n` +
                 `📧 *Email:* ${clientEmail}\n\n` +
                 `💬 *Сообщение:* ${messageText}`;

    await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      chat_id: TELEGRAM_CHAT_ID,
      text: text,
      parse_mode: 'Markdown'
    });

    return res.status(200).json({ result: 'ok' });
  } catch (error) {
    console.error('Telegram API Error:', error?.response?.data || error.message);
    return res.status(200).json({ 
      result: 'error', 
      details: error?.response?.data?.description || error.message 
    });
  }
});

app.get('/', (req, res) => {
  res.send('Server is running');
});

export default app;
