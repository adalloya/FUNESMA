document.addEventListener('DOMContentLoaded', () => {
    // Language Handling
    const langSelector = document.getElementById('language-selector');
    let currentLang = localStorage.getItem('preferredLanguage') || navigator.language.slice(0, 2);

    // Fallback if language not supported
    if (!['en', 'es', 'zh', 'ko'].includes(currentLang)) {
        currentLang = 'en';
    }

    // Set initial selection
    langSelector.value = currentLang;
    applyTranslations(currentLang);

    // Event Listener for Language Change
    langSelector.addEventListener('change', (e) => {
        const selectedLang = e.target.value;
        localStorage.setItem('preferredLanguage', selectedLang);
        applyTranslations(selectedLang);
    });

    function applyTranslations(lang) {
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const keys = key.split('.');
            let value = translations[lang];

            keys.forEach(k => {
                if (value) value = value[k];
            });

            if (value) {
                element.textContent = value;
            }
        });

        // Update HTML lang attribute
        document.documentElement.lang = lang;
    }

    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileMenuBtn.classList.toggle('open');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (navLinks.classList.contains('active') &&
                !navLinks.contains(e.target) &&
                !mobileMenuBtn.contains(e.target)) {
                navLinks.classList.remove('active');
                mobileMenuBtn.classList.remove('open');
            }
        });
    }

    // Navbar Scroll Effect
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Service Modal Logic
    const modal = document.getElementById('service-modal');
    if (modal) {
        const modalTitle = document.getElementById('modal-title');
        const modalDesc = document.getElementById('modal-desc');
        const modalIcon = document.querySelector('.modal-icon');
        const closeBtn = document.querySelector('.close-modal');
        const serviceCards = document.querySelectorAll('.service-card');

        serviceCards.forEach(card => {
            card.style.cursor = 'pointer'; // Make sure cursor indicates clickability
            card.addEventListener('click', () => {
                const serviceType = card.getAttribute('data-service');
                const icon = card.querySelector('.service-icon').textContent;

                // Get current language
                const currentLang = document.documentElement.lang || 'en';
                const t = translations[currentLang];

                if (t && t.services && t.services.details) {
                    modalTitle.textContent = t.services[serviceType];
                    modalDesc.textContent = t.services.details[serviceType];
                    modalIcon.textContent = icon;

                    // Update CTA text if available
                    const ctaBtn = modal.querySelector('.modal-btn');
                    if (ctaBtn && t.services.modal_cta) {
                        ctaBtn.textContent = t.services.modal_cta;
                    }
                }

                modal.style.display = 'flex';
            });
        });

        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }

    // Contact Page Logic
    const modeCards = document.querySelectorAll('.mode-card');
    const formContainer = document.getElementById('form-container');
    const chatContainer = document.getElementById('chat-container');

    if (modeCards.length > 0) {
        modeCards.forEach(card => {
            card.addEventListener('click', () => {
                // Remove active class from all
                modeCards.forEach(c => c.classList.remove('active'));
                // Add active to clicked
                card.classList.add('active');

                const mode = card.getAttribute('data-mode');
                if (mode === 'form') {
                    formContainer.classList.add('active-mode');
                    chatContainer.classList.remove('active-mode');
                } else {
                    formContainer.classList.remove('active-mode');
                    chatContainer.classList.add('active-mode');
                    initChat(); // Initialize chat when switched
                }
            });
        });
    }

    // Chat Logic
    let chatState = 0;
    let userData = {};
    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const chatSend = document.getElementById('chat-send');

    function addMessage(text, sender) {
        const div = document.createElement('div');
        div.classList.add('message', sender);
        div.textContent = text;
        chatMessages.appendChild(div);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function initChat() {
        if (chatMessages.children.length === 0) {
            const lang = document.documentElement.lang || 'en';
            const t = translations[lang].contact.chat;
            addMessage(t.welcome, 'bot');
        }
    }

    function handleChatInput() {
        const text = chatInput.value.trim();
        if (!text) return;

        addMessage(text, 'user');
        chatInput.value = '';

        const lang = document.documentElement.lang || 'en';
        const t = translations[lang].contact.chat;

        setTimeout(() => {
            if (chatState === 0) {
                userData.name = text;
                addMessage(t.q_email.replace('{name}', userData.name), 'bot');
                chatState++;
            } else if (chatState === 1) {
                userData.email = text;
                addMessage(t.q_company, 'bot');
                chatState++;
            } else if (chatState === 2) {
                userData.company = text;
                addMessage(t.q_project, 'bot');
                chatState++;
            } else if (chatState === 3) {
                userData.project = text;
                addMessage(t.done.replace('{email}', userData.email), 'bot');
                chatState++;
                // Here you would send userData to backend
                console.log("Chat Data:", userData);
            }
        }, 800);
    }

    if (chatSend) {
        chatSend.addEventListener('click', handleChatInput);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleChatInput();
        });
    }
});
