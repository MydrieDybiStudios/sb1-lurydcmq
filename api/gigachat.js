// src/api/gigachat.ts
export async function sendMessageToGigaChat(messages: any[]) {
    try {
        const response = await fetch('/api/gigachat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ messages }),
        });

        // Строго читаем как текст, чтобы не было краша JSON на пустом ответе или HTML
        const responseText = await response.text();

        if (!responseText) {
            throw new Error("Сервер не вернул данные. Бэкенд недоступен.");
        }

        if (responseText.trim().startsWith('<')) {
            throw new Error("Сервер вернул HTML-страницу. Убедитесь, что бэкенд развёрнут и отвечает по адресу /api/gigachat.");
        }

        let data: any = {};
        try {
            data = JSON.parse(responseText);
        } catch (e) {
            throw new Error(`Ошибка парсинга ответа от сервера. Ответ: ${responseText.substring(0, 30)}...`);
        }

        if (!response.ok) {
            throw new Error(data.error || `HTTP error: ${response.status}`);
        }

        if (data.content) {
            return { content: data.content };
        } else {
            throw new Error('Неожиданный ответ от сервера GigaChat');
        }
    } catch (error: any) {
        console.error('GigaChat API error:', error);
        throw error;
    }
}