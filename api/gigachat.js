// api/gigachat.js
import https from 'https';

// Создаем HTTPS агент с отключенной проверкой сертификатов
const httpsAgent = new https.Agent({
    rejectUnauthorized: false // ВАЖНО: отключаем проверку сертификата
});

export default async function handler(req, res) {
    console.log('🚀 ===== НОВЫЙ ЗАПРОС =====');
    
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { messages } = req.body;

        // Проверяем наличие ключа
        if (!process.env.GIGACHAT_CREDENTIALS) {
            console.error('❌ Нет GIGACHAT_CREDENTIALS');
            return res.status(500).json({ error: 'Credentials not configured' });
        }

        console.log('🔑 Ключ есть, длина:', process.env.GIGACHAT_CREDENTIALS.length);

        // 1. Получаем токен с использованием нашего агента
        console.log('🔄 Получение токена...');
        
        const tokenResponse = await fetch('https://ngw.devices.sberbank.ru:9443/api/v2/oauth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json',
                'Authorization': `Basic ${process.env.GIGACHAT_CREDENTIALS}`,
                'RqUID': crypto.randomUUID(),
            },
            body: 'scope=GIGACHAT_API_PERS',
            agent: httpsAgent // Добавляем наш агент
        });

        console.log('📊 Статус токена:', tokenResponse.status);

        if (!tokenResponse.ok) {
            const errorText = await tokenResponse.text();
            console.error('❌ Ошибка токена:', errorText);
            return res.status(500).json({ 
                error: 'Token error',
                status: tokenResponse.status,
                details: errorText
            });
        }

        const tokenData = await tokenResponse.json();
        console.log('✅ Токен получен');

        // 2. Отправляем запрос к GigaChat
        console.log('🔄 Запрос к GigaChat...');
        
        const chatResponse = await fetch('https://gigachat.devices.sberbank.ru/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${tokenData.access_token}`,
            },
            body: JSON.stringify({
                model: 'GigaChat',
                messages: [
                    {
                        role: 'system',
                        content: 'Ты — полезный помощник в образовательной среде по нефтегазовой отрасли для школьников. Отвечай просто, понятно, с примерами.'
                    },
                    ...messages
                ],
                temperature: 0.7,
                max_tokens: 1000,
            }),
            agent: httpsAgent // Добавляем агент и сюда
        });

        console.log('📊 Статус чата:', chatResponse.status);

        if (!chatResponse.ok) {
            const errorText = await chatResponse.text();
            console.error('❌ Ошибка чата:', errorText);
            return res.status(500).json({ 
                error: 'Chat error',
                status: chatResponse.status,
                details: errorText
            });
        }

        const chatData = await chatResponse.json();
        console.log('✅ Ответ получен');

        return res.status(200).json({
            content: chatData.choices[0]?.message?.content || 'Нет ответа'
        });

    } catch (error) {
        console.error('💥 Ошибка:', error);
        return res.status(500).json({ 
            error: 'Internal server error',
            message: error.message,
            cause: error.cause?.message
        });
    }
}