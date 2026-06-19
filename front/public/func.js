(function () {
    'use strict';

    // ============================================================
    // БУРГЕР-МЕНЮ
    // ============================================================
    const burgerBtn = document.getElementById('burgerBtn');
    const navLinks = document.getElementById('navLinks');

    if (burgerBtn && navLinks) {
        burgerBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            const isOpen = this.classList.toggle('active');
            navLinks.classList.toggle('open');
            this.setAttribute('aria-expanded', isOpen);
            this.setAttribute('aria-label', isOpen ? 'Закрыть меню' : 'Открыть меню');
        });

        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                burgerBtn.classList.remove('active');
                navLinks.classList.remove('open');
                burgerBtn.setAttribute('aria-expanded', 'false');
            });
        });

        document.addEventListener('click', function (e) {
            if (!e.target.closest('.header')) {
                burgerBtn.classList.remove('active');
                navLinks.classList.remove('open');
                burgerBtn.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // ============================================================
    // АНИМАЦИЯ ПРИ СКРОЛЛЕ (Intersection Observer)
    // ============================================================
    const animatedElements = document.querySelectorAll('.scroll-animate');

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });

        animatedElements.forEach(el => observer.observe(el));
    } else {
        animatedElements.forEach(el => el.classList.add('visible'));
    }

    // ============================================================
    // ФОРМА ОБРАТНОЙ СВЯЗИ
    // ============================================================
    const form = document.getElementById('feedbackForm');
    const nameInp = document.getElementById('userName');
    const emailInp = document.getElementById('userEmail');
    const phoneInp = document.getElementById('userPhone');
    const msgInp = document.getElementById('userMessage');
    const privacyChk = document.getElementById('privacyCheck');
    const successDiv = document.getElementById('successMessage');
    const submitBtn = document.getElementById('submitBtn');
    const formWrapper = document.getElementById('formWrapper');

    const nameGr = document.getElementById('nameGroup');
    const emailGr = document.getElementById('emailGroup');
    const phoneGr = document.getElementById('phoneGroup');
    const msgGr = document.getElementById('msgGroup');
    const privacyGr = document.getElementById('privacyGroup');

    function resetErrors() {
        [nameGr, emailGr, phoneGr, msgGr].forEach(el => el.classList.remove('error'));
        privacyGr.style.color = '';
        document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
    }

    function showError(group, message) {
        group.classList.add('error');
        const errorEl = group.querySelector('.error-message');
        if (errorEl) errorEl.textContent = message;
    }

    function showSuccessAndReset() {
        successDiv.classList.add('show');
        nameInp.value = '';
        emailInp.value = '';
        phoneInp.value = '';
        msgInp.value = '';
        privacyChk.checked = true;
        resetErrors();

        setTimeout(() => successDiv.classList.remove('show'), 5000);
    }

    function isValidEmail(email) {
        return /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/.test(email);
    }

    function isValidPhone(phone) {
        if (phone.trim() === '') return true;
        return /^[\+\d\s\-\(\)]{5,18}$/.test(phone.trim());
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const nameVal = nameInp.value.trim();
        const emailVal = emailInp.value.trim();
        const phoneVal = phoneInp.value.trim();
        const msgVal = msgInp.value.trim();
        let valid = true;
        resetErrors();

        if (nameVal === '' || nameVal.length < 2) {
            showError(nameGr, 'Введите имя (минимум 2 символа)');
            valid = false;
        }

        if (emailVal === '' || !isValidEmail(emailVal)) {
            showError(emailGr, 'Введите корректный email');
            valid = false;
        }

        if (!isValidPhone(phoneVal)) {
            showError(phoneGr, 'Введите корректный номер телефона');
            valid = false;
        }

        if (msgVal === '' || msgVal.length < 5) {
            showError(msgGr, 'Опишите задачу (минимум 5 символов)');
            valid = false;
        }

        if (!privacyChk.checked) {
            privacyGr.style.color = '#E07C4C';
            setTimeout(() => privacyGr.style.color = '', 1500);
            valid = false;
        }

        // ↓↓↓ ЗДЕСЬ ЗАМЕНЯЕМ ВЕСЬ БЛОК if (valid) ↓↓↓
        if (valid) {
            const originalHtml = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-pulse" aria-hidden="true"></i> Отправка...';
            submitBtn.disabled = true;
            submitBtn.classList.add('loading');

            const formData = {
                name: nameVal,
                email: emailVal,
                phone_number: phoneVal || 'не указан',
                info: msgVal
            };

            const xhr = new XMLHttpRequest();
            xhr.open('POST', 'http://127.0.0.1:8000/v1/api/send-email', true);
            xhr.setRequestHeader('Content-Type', 'application/json');

            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    submitBtn.innerHTML = originalHtml;
                    submitBtn.disabled = false;
                    submitBtn.classList.remove('loading');

                    if (xhr.status === 200) {
                        console.log('Успешно отправлено:', xhr.responseText);
                        showSuccessAndReset();
                    } else {
                        console.error('Ошибка:', xhr.status, xhr.statusText);
                        alert('Произошла ошибка при отправке. Попробуйте позже.');
                    }
                }
            };

            xhr.send(JSON.stringify(formData));
        } else {
            formWrapper.style.transform = 'scale(0.99)';
            setTimeout(() => formWrapper.style.transform = '', 200);
            setTimeout(() => formWrapper.style.transform = 'scale(1.005)', 400);
            setTimeout(() => formWrapper.style.transform = '', 600);
        }
    });

    [nameInp, emailInp, phoneInp, msgInp].forEach(inp => {
        inp.addEventListener('focus', () => {
            const parent = inp.closest('.input-group');
            if (parent) parent.classList.remove('error');
            const errorEl = parent?.querySelector('.error-message');
            if (errorEl) errorEl.textContent = '';
        });
    });

    // ============================================================
    // ПОДДЕРЖКА PREFERS-REDUCED-MOTION
    // ============================================================
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (prefersReducedMotion.matches) {
        document.querySelectorAll('.scroll-animate').forEach(el => {
            el.classList.add('visible');
        });
    }

    // ============================================================
    // RIPPLE ЭФФЕКТ ДЛЯ КНОПОК
    // ============================================================
    document.querySelectorAll('.submit-btn').forEach(btn => {
        btn.addEventListener('click', function (e) {
            const rect = this.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            this.style.setProperty('--x', x + '%');
            this.style.setProperty('--y', y + '%');
        });
    });

    console.log('✅ SIPP-PROM сайт загружен успешно');
    console.log('📱 Адаптивный дизайн активен');
    console.log('♿ Доступность улучшена');
})();