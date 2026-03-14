// src/components/GigaChatBot.tsx
import { useState } from 'react';
import { sendMessageToGigaChat } from '../api/gigachat';

export default function GigaChatBot() {
  const [messages, setMessages] = useState<Array<{role: string, content: string}>>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      const data = await sendMessageToGigaChat(updatedMessages);
      setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);
    } catch (error) {
      console.error('Ошибка:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Произошла ошибка при подключении' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Функция очистки сообщений
  const handleClearMessages = () => {
    setMessages([]);
    setShowClearConfirm(false);
  };

  return (
    <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000 }}>
      {isOpen ? (
        <div style={{
          width: '380px',
          height: '550px',
          backgroundColor: '#1A1A1A',
          borderRadius: '20px',
          boxShadow: '0 10px 30px rgba(255,215,0,0.2)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          border: '2px solid #FFD700',
          position: 'relative',
        }}>
          {/* Шапка в черно-золотом стиле */}
          <div style={{
            background: 'linear-gradient(135deg, #000000 0%, #1A1A1A 100%)',
            color: '#FFD700',
            padding: '12px 16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '2px solid #FFD700',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '22px',
                color: '#000000',
                fontWeight: 'bold',
                boxShadow: '0 2px 10px rgba(255,215,0,0.3)',
              }}>
                ⚡
              </div>
              <div>
                <strong style={{ 
                  fontSize: '18px', 
                  letterSpacing: '1px',
                  color: '#FFD700',
                  textTransform: 'uppercase',
                  textShadow: '0 0 10px rgba(255,215,0,0.3)'
                }}>
                  РОМАН ИВАНОВИЧ
                </strong>
                <div style={{ 
                  fontSize: '11px', 
                  color: '#FFD700',
                  opacity: 0.8,
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}>
                  Цифровой помощник
                </div>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '8px' }}>
              {/* Кнопка очистки */}
              <button 
                onClick={() => setShowClearConfirm(true)}
                disabled={messages.length === 0}
                style={{ 
                  background: messages.length === 0 
                    ? 'rgba(255,215,0,0.05)' 
                    : 'rgba(255,215,0,0.1)', 
                  border: '1px solid #FFD700', 
                  color: messages.length === 0 ? '#666' : '#FFD700', 
                  fontSize: '16px', 
                  cursor: messages.length === 0 ? 'not-allowed' : 'pointer',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s',
                  opacity: messages.length === 0 ? 0.3 : 1,
                }}
                onMouseEnter={(e) => {
                  if (messages.length > 0) {
                    e.currentTarget.style.background = '#FFD700';
                    e.currentTarget.style.color = '#000000';
                  }
                }}
                onMouseLeave={(e) => {
                  if (messages.length > 0) {
                    e.currentTarget.style.background = 'rgba(255,215,0,0.1)';
                    e.currentTarget.style.color = '#FFD700';
                  }
                }}
                title="Очистить историю сообщений"
              >
                🗑️
              </button>
              
              {/* Кнопка закрытия */}
              <button 
                onClick={() => setIsOpen(false)} 
                style={{ 
                  background: 'rgba(255,215,0,0.1)', 
                  border: '1px solid #FFD700', 
                  color: '#FFD700', 
                  fontSize: '18px', 
                  cursor: 'pointer',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#FFD700';
                  e.currentTarget.style.color = '#000000';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,215,0,0.1)';
                  e.currentTarget.style.color = '#FFD700';
                }}
              >
                ✕
              </button>
            </div>
          </div>

          {/* Модальное окно подтверждения очистки */}
          {showClearConfirm && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.9)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10,
              backdropFilter: 'blur(3px)',
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #1A1A1A 0%, #0A0A0A 100%)',
                border: '2px solid #FFD700',
                borderRadius: '16px',
                padding: '24px',
                width: '280px',
                textAlign: 'center',
                boxShadow: '0 0 30px rgba(255,215,0,0.3)',
              }}>
                <div style={{ fontSize: '32px', marginBottom: '16px' }}>🗑️</div>
                <div style={{ 
                  color: '#FFD700', 
                  fontSize: '18px', 
                  fontWeight: 'bold',
                  marginBottom: '12px',
                }}>
                  Очистить историю?
                </div>
                <div style={{ 
                  color: '#CCCCCC', 
                  fontSize: '14px', 
                  marginBottom: '24px',
                }}>
                  Все сообщения будут безвозвратно удалены
                </div>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                  <button
                    onClick={handleClearMessages}
                    style={{
                      padding: '10px 24px',
                      background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                      color: '#000000',
                      border: 'none',
                      borderRadius: '20px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      fontSize: '14px',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    Да, очистить
                  </button>
                  <button
                    onClick={() => setShowClearConfirm(false)}
                    style={{
                      padding: '10px 24px',
                      background: 'transparent',
                      color: '#FFD700',
                      border: '1px solid #FFD700',
                      borderRadius: '20px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      fontSize: '14px',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255,215,0,0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    Отмена
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Область сообщений */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            backgroundColor: '#0A0A0A',
          }}>
            {messages.length === 0 && (
              <div style={{ 
                textAlign: 'center', 
                marginTop: '40px',
                padding: '30px 20px',
                background: 'linear-gradient(135deg, #1A1A1A 0%, #0A0A0A 100%)',
                borderRadius: '16px',
                border: '1px solid #FFD700',
                boxShadow: '0 0 20px rgba(255,215,0,0.1)',
              }}>
                <div style={{ 
                  fontSize: '48px', 
                  marginBottom: '16px',
                  filter: 'drop-shadow(0 0 10px #FFD700)'
                }}>
                  ⚡
                </div>
                <div style={{ 
                  fontSize: '20px', 
                  fontWeight: 'bold',
                  color: '#FFD700',
                  marginBottom: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '2px'
                }}>
                  Нефтегазовый помощник
                </div>
                <div style={{ 
                  fontSize: '14px', 
                  color: '#CCCCCC',
                  lineHeight: '1.6'
                }}>
                  Задайте вопрос о нефти, газе,<br/>
                  профессиях или технологиях отрасли
                </div>
                <div style={{ 
                  marginTop: '20px',
                  fontSize: '12px',
                  color: '#FFD700',
                  opacity: 0.6,
                  borderTop: '1px solid #333',
                  paddingTop: '16px'
                }}>
                  ⚡ Цифровая образовательная среда
                </div>
              </div>
            )}
            {messages.map((msg, idx) => (
              <div key={idx} style={{
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%',
              }}>
                <div style={{
                  padding: '12px 16px',
                  borderRadius: msg.role === 'user' 
                    ? '20px 20px 4px 20px' 
                    : '20px 20px 20px 4px',
                  backgroundColor: msg.role === 'user' ? '#FFD700' : '#1A1A1A',
                  color: msg.role === 'user' ? '#000000' : '#FFD700',
                  wordWrap: 'break-word',
                  boxShadow: msg.role === 'user' 
                    ? '0 4px 15px rgba(255,215,0,0.3)'
                    : '0 4px 15px rgba(255,215,0,0.1)',
                  border: msg.role === 'assistant' ? '1px solid #FFD700' : 'none',
                  fontSize: '14px',
                  lineHeight: '1.5',
                }}>
                  {msg.role === 'assistant' && (
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px',
                      marginBottom: '8px',
                      color: '#FFD700',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                    }}>
                      <span style={{ fontSize: '16px' }}>⚡</span> Роман Иванович
                    </div>
                  )}
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div style={{ alignSelf: 'flex-start', maxWidth: '85%' }}>
                <div style={{ 
                  padding: '16px 20px',
                  borderRadius: '20px 20px 20px 4px',
                  backgroundColor: '#1A1A1A',
                  border: '1px solid #FFD700',
                  boxShadow: '0 4px 15px rgba(255,215,0,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}>
                  <div style={{ 
                    color: '#FFD700', 
                    fontSize: '20px',
                    animation: 'rotate 2s infinite linear'
                  }}>
                    ⚡
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <span style={{
                      width: '8px',
                      height: '8px',
                      backgroundColor: '#FFD700',
                      borderRadius: '50%',
                      animation: 'pulse 1.5s infinite'
                    }} />
                    <span style={{
                      width: '8px',
                      height: '8px',
                      backgroundColor: '#FFD700',
                      borderRadius: '50%',
                      animation: 'pulse 1.5s infinite 0.2s'
                    }} />
                    <span style={{
                      width: '8px',
                      height: '8px',
                      backgroundColor: '#FFD700',
                      borderRadius: '50%',
                      animation: 'pulse 1.5s infinite 0.4s'
                    }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Форма ввода */}
          <form onSubmit={handleSubmit} style={{
            display: 'flex',
            padding: '16px',
            borderTop: '2px solid #FFD700',
            gap: '10px',
            backgroundColor: '#0A0A0A',
          }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Введите ваш вопрос..."
              disabled={isLoading}
              style={{
                flex: 1,
                padding: '12px 18px',
                backgroundColor: '#1A1A1A',
                border: '2px solid #333',
                borderRadius: '25px',
                outline: 'none',
                fontSize: '14px',
                color: '#FFD700',
                transition: 'all 0.3s',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#FFD700';
                e.target.style.boxShadow = '0 0 10px rgba(255,215,0,0.3)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#333';
                e.target.style.boxShadow = 'none';
              }}
            />
            <button
              type="submit"
              disabled={isLoading}
              style={{
                padding: '12px 28px',
                background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                color: '#000000',
                border: 'none',
                borderRadius: '25px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.6 : 1,
                fontWeight: 'bold',
                fontSize: '14px',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                transition: 'all 0.3s',
                boxShadow: '0 4px 15px rgba(255,215,0,0.3)',
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(255,215,0,0.5)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(255,215,0,0.3)';
                }
              }}
            >
              →
            </button>
          </form>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            width: '70px',
            height: '70px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #000000 0%, #1A1A1A 100%)',
            color: '#FFD700',
            border: '3px solid #FFD700',
            cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(255,215,0,0.4)',
            fontSize: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s',
            animation: 'goldPulse 2s infinite',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.boxShadow = '0 6px 25px rgba(255,215,0,0.6)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(255,215,0,0.4)';
          }}
        >
          ⚡
        </button>
      )}
      
      {/* Стили для анимаций */}
      <style>
        {`
          @keyframes goldPulse {
            0% {
              box-shadow: 0 0 0 0 rgba(255,215,0,0.7);
            }
            70% {
              box-shadow: 0 0 0 15px rgba(255,215,0,0);
            }
            100% {
              box-shadow: 0 0 0 0 rgba(255,215,0,0);
            }
          }
          
          @keyframes pulse {
            0%, 100% {
              opacity: 1;
              transform: scale(1);
            }
            50% {
              opacity: 0.5;
              transform: scale(0.8);
            }
          }
          
          @keyframes rotate {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
    </div>
  );
}