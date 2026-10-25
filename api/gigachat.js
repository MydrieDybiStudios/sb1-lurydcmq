// src/api/gigachat.ts
export async function sendMessageToGigaChat(messages: any[]) {
    try {
        // Запрос идет на твой же сайт, на адрес /api/gigachat
        const response = await fetch('/api/gigachat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ messages }),
        });

        const responseText = await response.text();

        if (responseText.trim().startsWith('<')) {
            throw new Error("Сервер вернул HTML вместо JSON. Убедитесь, что бэкенд отвечает по этому адресу.");
        }

        let data = {};
        if (responseText) {
            try {
                data = JSON.parse(responseText);
            } catch (e) {
                throw new Error(`Ошибка парсинга JSON. Статус: ${response.status}`);
            }
        }

        if (!response.ok) {
            throw new Error(data.error || `HTTP error: ${response.status}`);
        }

        if (data.content) {
            return { content: data.content };
        } else {
            throw new Error('Неожиданный ответ от сервера');
        }
    } catch (error) {
        console.error('GigaChat API error:', error);
        throw error;
    }
}