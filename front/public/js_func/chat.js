(function() {
    'use strict';

    console.log('🟢 Чат: инициализация...');

    function initChat() {
        console.log('🟢 Чат: DOM загружен');

        const chatToggleBtn = document.getElementById('chatToggleBtn');
        const chatWindow = document.getElementById('chatWindow');
        const chatCloseBtn = document.getElementById('chatCloseBtn');
        const chatMessages = document.getElementById('chatMessages');
        const chatInput = document.getElementById('chatInput');
        const chatSendBtn = document.getElementById('chatSendBtn');
        const typingIndicator = document.getElementById('typingIndicator');
        const notificationBadge = document.getElementById('notificationBadge');
        const quickReplyBtns = document.querySelectorAll('.quick-reply-btn');
        const chatIcon = document.getElementById('chatIcon');

        if (!chatToggleBtn || !chatWindow) {
            console.error('❌ Чат: элементы не найдены');
            return;
        }

        console.log('✅ Чат: все элементы найдены');

        let socket = null;
        let isConnected = false;
        let reconnectAttempts = 0;
        const MAX_RECONNECT = 5;
        let reconnectTimer = null;

        function isChatOpen() {
            return chatWindow.classList.contains('active');
        }

        function connectWebSocket() {
            if (reconnectAttempts >= MAX_RECONNECT) {
                console.warn('⚠️ Чат: превышено кол-во попыток');
                return;
            }

            try {
                const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
                const wsUrl = `${protocol}//${window.location.host}/api/ws/chat`;

                console.log(`🔄 Чат: подключение (${reconnectAttempts + 1}/${MAX_RECONNECT})...`);
                console.log(`📍 URL: ${wsUrl}`);

                if (socket) {
                    try { socket.close(); } catch(e) {}
                    socket = null;
                }

                socket = new WebSocket(wsUrl);

                socket.onopen = function() {
                    console.log('✅ Чат: WebSocket подключен');
                    isConnected = true;
                    reconnectAttempts = 0;
                };

                socket.onmessage = function(event) {
                    try {
                        const data = JSON.parse(event.data);
                        console.log('📩 Чат: получено', data);

                        if (data.type === 'message' && data.text) {
                            addMessage(data.text, 'bot');
                        } else if (data.type === 'typing') {
                            toggleTyping(data.status);
                        }
                    } catch (e) {
                        console.error('❌ Ошибка парсинга:', e);
                        // Если ответ не JSON, пробуем как текст
                        addMessage(event.data, 'bot');
                    }
                };

                socket.onclose = function() {
                    console.log('⚠️ Чат: отключен');
                    isConnected = false;
                    socket = null;
                    scheduleReconnect();
                };

                socket.onerror = function(error) {
                    console.error('❌ Чат: ошибка', error);
                };

            } catch (e) {
                console.error('❌ Ошибка подключения:', e);
                scheduleReconnect();
            }
        }

        function scheduleReconnect() {
            if (reconnectTimer || reconnectAttempts >= MAX_RECONNECT) return;

            reconnectAttempts++;
            const delay = Math.min(3000 * reconnectAttempts, 15000);

            console.log(`⏳ Переподключение через ${delay}мс`);
            reconnectTimer = setTimeout(function() {
                reconnectTimer = null;
                connectWebSocket();
            }, delay);
        }

        function addMessage(text, sender = 'user') {
            const div = document.createElement('div');
            div.className = `message ${sender}`;

            const now = new Date();
            const time = now.getHours().toString().padStart(2, '0') + ':' +
                         now.getMinutes().toString().padStart(2, '0');

            div.innerHTML = `
                ${text.replace(/\n/g, '<br>')}
                <span class="time">${time}</span>
            `;

            if (typingIndicator) {
                typingIndicator.classList.remove('active');
            }

            if (chatMessages) {
                chatMessages.insertBefore(div, typingIndicator);
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }

            if (!isChatOpen()) {
                showNotification();
            }
        }

        function toggleTyping(status) {
            if (typingIndicator) {
                typingIndicator.classList.toggle('active', status);
                if (chatMessages) {
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                }
            }
        }

        function showNotification() {
            if (notificationBadge) {
                const count = parseInt(notificationBadge.textContent) || 0;
                notificationBadge.textContent = count + 1;
                notificationBadge.style.display = 'flex';
            }
        }

        function clearNotification() {
            if (notificationBadge) {
                notificationBadge.style.display = 'none';
                notificationBadge.textContent = '0';
            }
        }

        function sendMessage(text) {
            text = text.trim();
            if (!text) return;

            console.log('📤 Чат: отправка', text);
            addMessage(text, 'user');

            if (chatInput) {
                chatInput.value = '';
                chatInput.style.height = 'auto';
            }

            if (isConnected && socket && socket.readyState === WebSocket.OPEN) {
                try {
                    socket.send(JSON.stringify({
                        type: 'message',
                        text: text
                    }));
                    return;
                } catch (e) {
                    console.error('❌ Ошибка отправки:', e);
                }
            }

            console.log('⚠️ WebSocket не готов, HTTP fallback');
            toggleTyping(true);

            fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text })
            })
            .then(r => r.json())
            .then(data => {
                toggleTyping(false);
                if (data.reply) {
                    addMessage(data.reply, 'bot');
                }
            })
            .catch(() => {
                toggleTyping(false);
                addMessage('Извините, произошла ошибка. Попробуйте позже.', 'bot');
            });
        }

        function toggleChat(forceState) {
            const shouldOpen = forceState !== undefined ? forceState : !isChatOpen();

            if (shouldOpen) {
                chatWindow.classList.add('active');
                clearNotification();
                if (chatInput) setTimeout(() => chatInput.focus(), 100);
                if (chatIcon) chatIcon.className = 'fas fa-times';
            } else {
                chatWindow.classList.remove('active');
                if (chatIcon) chatIcon.className = 'fas fa-comment-dots';
            }
        }

        chatToggleBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleChat();
        });

        if (chatCloseBtn) {
            chatCloseBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                toggleChat(false);
            });
        }

        if (chatSendBtn) {
            chatSendBtn.addEventListener('click', function() {
                sendMessage(chatInput ? chatInput.value : '');
            });
        }

        if (chatInput) {
            chatInput.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage(chatInput.value);
                }
            });

            chatInput.addEventListener('input', function() {
                this.style.height = 'auto';
                this.style.height = Math.min(this.scrollHeight, 100) + 'px';
            });
        }

        quickReplyBtns.forEach(function(btn) {
            btn.addEventListener('click', function() {
                const question = this.dataset.question;
                if (question && chatInput) {
                    chatInput.value = question;
                    sendMessage(question);
                }
            });
        });

        document.addEventListener('click', function(e) {
            const widget = document.querySelector('.chat-widget');
            if (isChatOpen() && widget && !widget.contains(e.target)) {
                toggleChat(false);
            }
        });

        window.addEventListener('beforeunload', function() {
            if (reconnectTimer) {
                clearTimeout(reconnectTimer);
                reconnectTimer = null;
            }
            if (socket) {
                try { socket.close(); } catch(e) {}
                socket = null;
            }
        });

        console.log('🚀 Чат: запуск...');
        connectWebSocket();

        setTimeout(function() {
            if (chatMessages) {
                const hasMessages = chatMessages.querySelectorAll('.message').length > 0;
                if (!hasMessages) {
                    addMessage('👋 Здравствуйте! Чем могу помочь?', 'bot');
                }
            }
        }, 500);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initChat);
    } else {
        initChat();
    }

})();