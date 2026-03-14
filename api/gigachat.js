// api/gigachat.js
export default async function handler(req, res) {
    // Разрешаем запросы только с нашего сайта (важно для безопасности)
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

        // 1. Получаем токен доступа (Access Token)
        const tokenResponse = await fetch('https://ngw.devices.sberbank.ru:9443/api/v2/oauth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json',
                'Authorization': `Basic ${process.env.GIGACHAT_CREDENTIALS}`, // Ключ из переменных окружения!
                'RqUID': crypto.randomUUID(), // Уникальный ID запроса
            },
            body: 'scope=GIGACHAT_API_PERS', // Или GIGACHAT_API_B2B / GIGACHAT_API_CORP
        });

        if (!tokenResponse.ok) {
            const errorText = await tokenResponse.text();
            console.error('Token error:', tokenResponse.status, errorText);
            return res.status(500).json({ error: 'Failed to get token from GigaChat' });
        }

        const tokenData = await tokenResponse.json();
        const accessToken = tokenData.access_token;

        // 2. Отправляем сообщение в GigaChat
        const chatResponse = await fetch('https://gigachat.devices.sberbank.ru/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                model: 'GigaChat', // или GigaChat-Pro, GigaChat-Max
                messages: [
                    {
                        role: 'system',
                        content: `Ты — полезный помощник в образовательной среде по нефтегазовой отрасли для школьников. Отвечай просто, понятно, с примерами.`
                    },
                    ...messages
                ],
                temperature: 0.7,
                max_tokens: 1000,
            }),
        });

        if (!chatResponse.ok) {
            const errorText = await chatResponse.text();
            console.error('Chat error:', chatResponse.status, errorText);
            return res.status(500).json({ error: 'GigaChat API error' });
        }

        const chatData = await chatResponse.json();

        res.status(200).json({
            content: chatData.choices[0]?.message?.content || 'Извините, я не смог обработать запрос.'
        });

    } catch (error) {
        console.error('Serverless function error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}