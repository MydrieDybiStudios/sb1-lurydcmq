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

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error: ${response.status}`);
        }

        const data = await response.json();

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