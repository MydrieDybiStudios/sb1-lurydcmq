// api/gigachat.js
import https from 'https';

const httpsAgent = new https.Agent({
    rejectUnauthorized: false
});

export default async function handler(req, res) {
    console.log('🚀 API вызван');
    
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
        // Пробуем получить ключ из разных источников
        const credentials = process.env.GIGACHAT_CREDENTIALS || 
                           process.env.VITE_GIGACHAT_CREDENTIALS;
        
        console.log('🔍 Проверка переменных окружения:');
        console.log('GIGACHAT_CREDENTIALS:', process.env.GIGACHAT_CREDENTIALS ? '✅ есть' : '❌ нет');
        console.log('VITE_GIGACHAT_CREDENTIALS:', process.env.VITE_GIGACHAT_CREDENTIALS ? '✅ есть' : '❌ нет');
        
        if (!credentials) {
            console.error('❌ Креденшелы не найдены!');
            return res.status(500).json({ 
                error: 'Credentials not configured',
                message: 'Добавьте GIGACHAT_CREDENTIALS или VITE_GIGACHAT_CREDENTIALS в переменные окружения Vercel'
            });
        }

        console.log('✅ Креденшелы найдены, длина:', credentials.length);

        const { messages } = req.body;
        
        // 1. Получаем токен
        console.log('🔄 Получение токена...');
        
        const tokenResponse = await fetch('https://ngw.devices.sberbank.ru:9443/api/v2/oauth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json',
                'Authorization': `Basic ${credentials}`,
                'RqUID': crypto.randomUUID(),
            },
            body: 'scope=GIGACHAT_API_PERS',
            agent: httpsAgent
        });

        console.log('📊 Статус токена:', tokenResponse.status);

        if (!tokenResponse.ok) {
            const errorText = await tokenResponse.text();
            console.error('❌ Ошибка токена:', errorText);
            return res.status(500).json({ 
                error: 'Token error',
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
            agent: httpsAgent
        });

        console.log('📊 Статус чата:', chatResponse.status);

        if (!chatResponse.ok) {
            const errorText = await chatResponse.text();
            console.error('❌ Ошибка чата:', errorText);
            return res.status(500).json({ 
                error: 'Chat error',
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
            message: error.message
        });
    }
}