import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim() || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() || 'placeholder-key';

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.error('КРИТИЧЕСКАЯ ОШИБКА: VITE_SUPABASE_URL или VITE_SUPABASE_ANON_KEY не заданы в Environment Variables на Render!');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  global: {
    // Защита от ошибки "Failed to execute 'json' on 'Response': Unexpected end of JSON input"
    fetch: async (url, options) => {
      const response = await fetch(url, options);
      const clone = response.clone();
      const text = await clone.text();

      // Если сервер вернул абсолютно пустое тело ответа или HTML (из-за редиректа),
      // подменяем пустой ответ на валидный JSON, чтобы response.json() внутри Supabase не падал
      if (!text || text.trim().startsWith('<')) {
        const errorPayload = JSON.stringify({
          message: 'Сервер вернул пустой ответ или HTML. Проверьте настройки VITE_SUPABASE_URL на Render.',
          error: 'Invalid response format',
        });
        return new Response(errorPayload, {
          status: response.ok ? 500 : response.status,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      return response;
    },
  },
});