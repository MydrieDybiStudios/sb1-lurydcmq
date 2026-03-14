// server.js
import express from 'express';
import cors from 'cors';
import GigaChat from 'gigachat';
import https from 'https';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

const client = new GigaChat({
  credentials: process.env.GIGACHAT_CREDENTIALS,
  scope: process.env.GIGACHAT_SCOPE || 'GIGACHAT_API_PERS',
  model: process.env.GIGACHAT_MODEL || 'GigaChat',
  timeout: 60,
  httpsAgent: httpsAgent,
  dangerouslyAllowBrowser: false,
});

app.post('/api/gigachat', async (req, res) => {
  try {
    const { messages } = req.body;

    const response = await client.chat({
      messages: [
        {
          role: 'system',
          content: 'Ты помощник по нефтегазовой отрасли для школьников. Отвечай просто и понятно.',
        },
        ...messages,
      ],
    });

    res.json({
      content: response.choices[0]?.message?.content || 'Нет ответа',
    });
  } catch (error) {
    console.error('GigaChat error:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.listen(port, () => {
  console.log(`API сервер запущен на http://localhost:${port}`);
});