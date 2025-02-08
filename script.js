// Make togglePanels function global
window.togglePanels = function(show) {
    const panels = {
        login: document.getElementById('loginPanel'),
        register: document.getElementById('registerPanel'),
        forgotPassword: document.getElementById('forgotPasswordPanel'),
        resetCode: document.getElementById('resetCodePanel'),
        newPassword: document.getElementById('newPasswordPanel')
    };
    
    // Hide all panels with fade out
    Object.values(panels).forEach(panel => {
        panel.style.opacity = '0';
        panel.style.display = 'none';
        panel.classList.remove('slide-in');
    });
    
    // Show selected panel with animation
    const selectedPanel = panels[show] || panels.login;
    selectedPanel.style.display = 'block';
    setTimeout(() => {
        selectedPanel.style.opacity = '1';
        selectedPanel.classList.add('slide-in');
    }, 50);
};

document.addEventListener('DOMContentLoaded', () => {
    const bgMusic = document.getElementById('bgMusic');
    const musicToggle = document.getElementById('musicToggle');
    let isMuted = false; // Changed to false to start playing

    // Autoplay music when page loads
    bgMusic.play().catch(error => {
        // Browser might block autoplay, we'll handle it with user interaction
        isMuted = true;
        musicToggle.querySelector('i').className = 'fas fa-volume-mute';
        musicToggle.classList.add('muted');
    });

    musicToggle.addEventListener('click', () => {
        if (isMuted) {
            bgMusic.play();
            musicToggle.querySelector('i').className = 'fas fa-volume-up';
            musicToggle.classList.remove('muted');
        } else {
            bgMusic.pause();
            musicToggle.querySelector('i').className = 'fas fa-volume-mute';
            musicToggle.classList.add('muted');
        }
        isMuted = !isMuted;
    });

    // Handle first user interaction to start playing music (needed for some browsers)
    document.addEventListener('click', () => {
        if (isMuted) {
            bgMusic.play();
            musicToggle.querySelector('i').className = 'fas fa-volume-up';
            musicToggle.classList.remove('muted');
            isMuted = false;
        }
    }, { once: true });

    // Initialize localStorage if needed
    if (!localStorage.getItem('registeredUsers')) {
        localStorage.setItem('registeredUsers', JSON.stringify([]));
    }

    // Create snow animation
    function createSnow() {
        const snowflake = document.createElement('div');
        snowflake.className = 'snowflake';
        
        const startX = Math.random() * window.innerWidth;
        const startY = -10;
        const endX = startX + (Math.random() * 600 - 300);
        const endY = window.innerHeight + 10;
        
        snowflake.style.setProperty('--start-x', `${startX}px`);
        snowflake.style.setProperty('--start-y', `${startY}px`);
        snowflake.style.setProperty('--end-x', `${endX}px`);
        snowflake.style.setProperty('--end-y', `${endY}px`);
        
        const duration = Math.random() * 5 + 3;
        const size = Math.random() * 6 + 2;
        
        snowflake.style.width = `${size}px`;
        snowflake.style.height = `${size}px`;
        snowflake.style.animationDuration = `${duration}s`;
        
        snowflake.style.left = `${startX}px`;
        snowflake.style.top = `${startY}px`;
        
        document.body.appendChild(snowflake);
        
        setTimeout(() => {
            snowflake.remove();
        }, duration * 1000);
    }

    setInterval(createSnow, 25);

    for(let i = 0; i < 200; i++) {
        setTimeout(createSnow, Math.random() * 1000);
    }

    const togglePassword = document.getElementById('togglePassword');
    const password = document.getElementById('password');

    togglePassword.addEventListener('click', function() {
        const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
        password.setAttribute('type', type);
        this.classList.toggle('fa-eye');
        this.classList.toggle('fa-eye-slash');
    });

    const toggleRegPassword = document.getElementById('toggleRegPassword');
    const regPassword = document.getElementById('regPassword');
    const toggleRegConfirmPassword = document.getElementById('toggleRegConfirmPassword');
    const regConfirmPassword = document.getElementById('regConfirmPassword');

    toggleRegPassword.addEventListener('click', function() {
        const type = regPassword.getAttribute('type') === 'password' ? 'text' : 'password';
        regPassword.setAttribute('type', type);
        this.classList.toggle('fa-eye');
        this.classList.toggle('fa-eye-slash');
    });

    toggleRegConfirmPassword.addEventListener('click', function() {
        const type = regConfirmPassword.getAttribute('type') === 'password' ? 'text' : 'password';
        regConfirmPassword.setAttribute('type', type);
        this.classList.toggle('fa-eye');
        this.classList.toggle('fa-eye-slash');
    });

    const handleLogin = function(event) {
        event.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const remember = document.getElementById('remember').checked;

        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        const user = registeredUsers.find(u => u.username === username && u.password === password);

        const button = event.target.querySelector('button');
        
        button.innerHTML = '<i class="fas fa-star fa-spin"></i>';
        button.classList.add('loading');
        button.disabled = true;

        setTimeout(() => {
            if (user) {
                if (remember) {
                    localStorage.setItem('currentUser', JSON.stringify(user));
                }
                showSuccess('Login successful!');
                setTimeout(() => {
                    window.location.href = 'https://metodosdoalves.ereembystore.com/';
                }, 1500);
            } else {
                button.innerHTML = '<span>Login</span>';
                button.classList.remove('loading');
                button.disabled = false;
                showError('Invalid username or password');
            }
        }, 1000);

        return false;
    };

    const handleRegister = function(event) {
        event.preventDefault();
        
        const username = document.getElementById('regUsername').value.trim();
        const email = document.getElementById('regEmail').value.trim();
        const password = document.getElementById('regPassword').value;
        const confirmPassword = document.getElementById('regConfirmPassword').value;
        
        // Enhanced validation
        if (!username || !email || !password || !confirmPassword) {
            showError('Por favor, preencha todos os campos');
            return false;
        }
        
        if (username.length < 3) {
            showError('O nome de usuário deve ter pelo menos 3 caracteres');
            return false;
        }
        
        if (!isValidEmail(email)) {
            showError('Por favor, insira um email válido');
            return false;
        }
        
        if (password.length < 6) {
            showError('A senha deve ter pelo menos 6 caracteres');
            return false;
        }
        
        if (password !== confirmPassword) {
            showError('As senhas não coincidem');
            return false;
        }
        
        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        
        if (registeredUsers.some(user => user.username === username)) {
            showError('Este nome de usuário já está em uso');
            return false;
        }
        
        if (registeredUsers.some(user => user.email === email)) {
            showError('Este email já está registrado');
            return false;
        }
        
        // Show loading state
        const button = event.target.querySelector('button');
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Registrando...';
        button.disabled = true;
        
        setTimeout(() => {
            try {
                registeredUsers.push({ username, email, password });
                localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
                
                showSuccess('Registro realizado com sucesso!');
                event.target.reset();
                
                setTimeout(() => togglePanels('login'), 1500);
            } catch (error) {
                showError('Erro ao registrar. Tente novamente.');
            } finally {
                button.innerHTML = 'Registrar';
                button.disabled = false;
            }
        }, 1000);
        
        return false;
    };

    // Add helper function for email validation
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    const handleForgotPassword = function(event) {
        event.preventDefault();
        
        const email = document.getElementById('resetEmail').value;
        
        const button = event.target.querySelector('button');
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        button.disabled = true;

        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        const user = registeredUsers.find(u => u.email === email);

        setTimeout(() => {
            if (user) {
                const resetCode = Math.floor(100000 + Math.random() * 900000);
                
                localStorage.setItem(`resetCode_${email}`, JSON.stringify({
                    code: resetCode,
                    expires: Date.now() + 3600000 // 1 hour expiration
                }));

                showSuccess(`Recovery code sent to ${email}! (Code: ${resetCode})`);
                
                togglePanels('resetCode');
            } else {
                showError('Email not found');
            }

            button.innerHTML = 'Send';
            button.disabled = false;
        }, 1500);

        return false;
    };

    const handleResetCode = function(event) {
        event.preventDefault();
        
        const email = document.getElementById('resetEmail').value;
        const code = document.getElementById('resetCode').value;
        
        const button = event.target.querySelector('button');
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verifying...';
        button.disabled = true;

        setTimeout(() => {
            const storedReset = JSON.parse(localStorage.getItem(`resetCode_${email}`) || '{}');
            
            if (storedReset.code && 
                storedReset.code.toString() === code && 
                Date.now() < storedReset.expires) {
                
                togglePanels('newPassword');
                localStorage.removeItem(`resetCode_${email}`);
            } else {
                showError('Invalid or expired code');
            }

            button.innerHTML = 'Verify';
            button.disabled = false;
        }, 1000);

        return false;
    };

    const handleNewPassword = function(event) {
        event.preventDefault();
        
        const email = document.getElementById('resetEmail').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmNewPassword = document.getElementById('confirmNewPassword').value;

        if (newPassword !== confirmNewPassword) {
            showError('Passwords do not match');
            return false;
        }

        const button = event.target.querySelector('button');
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Changing...';
        button.disabled = true;

        setTimeout(() => {
            const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
            const userIndex = registeredUsers.findIndex(u => u.email === email);
            
            if (userIndex !== -1) {
                registeredUsers[userIndex].password = newPassword;
                localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
                
                showSuccess('Password changed successfully!');
                setTimeout(() => {
                    togglePanels('login');
                }, 1500);
            } else {
                showError('Error changing password');
            }

            button.innerHTML = 'Change Password';
            button.disabled = false;
        }, 1000);

        return false;
    };

    // Register event handlers
    document.getElementById('loginForm').onsubmit = handleLogin;
    document.getElementById('registerForm').onsubmit = handleRegister;
    document.getElementById('forgotPasswordForm').onsubmit = handleForgotPassword;
    document.getElementById('resetCodeForm').onsubmit = handleResetCode;
    document.getElementById('newPasswordForm').onsubmit = handleNewPassword;

    function showSuccess(message) {
        Swal.fire({
            icon: 'success',
            title: message,
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            background: 'rgba(0, 0, 0, 0.9)',
            color: '#fff',
            iconColor: '#00ff00'
        });
    }

    function showError(message) {
        Swal.fire({
            icon: 'error',
            title: message,
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            background: 'rgba(0, 0, 0, 0.9)',
            color: '#fff',
            iconColor: '#ff0000'
        });
    }

    const checkPasswordStrength = function(password) {
        let strength = 0;
        
        if (password.length >= 8) strength += 1;
        if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength += 1;
        if (password.match(/\d/)) strength += 1;
        if (password.match(/[^a-zA-Z\d]/)) strength += 1;
        
        return strength;
    }

    const togglePasswordVisibility = function(input, icon) {
        const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
        input.setAttribute('type', type);
        icon.classList.toggle('fa-eye');
        icon.classList.toggle('fa-eye-slash');
    }

    document.querySelectorAll('.social-icon').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const provider = e.currentTarget.getAttribute('data-provider');
        });
    });

    // Add password strength check on input
    document.getElementById('regPassword').addEventListener('input', function(e) {
        const password = e.target.value;
        const strength = checkPasswordStrength(password);
        
        const strengthBar = document.querySelector('.password-strength-bar');
        if (strengthBar) {
            strengthBar.className = 'password-strength-bar';
            if (strength >= 3) {
                strengthBar.classList.add('strength-strong');
            } else if (strength >= 2) {
                strengthBar.classList.add('strength-medium');
            } else {
                strengthBar.classList.add('strength-weak');
            }
        }
    });

    // Add confirmation password check
    document.getElementById('regConfirmPassword').addEventListener('input', function(e) {
        const password = document.getElementById('regPassword').value;
        const confirmPassword = e.target.value;
        
        if (password && confirmPassword) {
            if (password !== confirmPassword) {
                e.target.setCustomValidity('As senhas não coincidem');
            } else {
                e.target.setCustomValidity('');
            }
        }
    });

    const loginButton = document.querySelector('#loginForm .login-btn');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');

    // Initially hide the button and show initial notification
    loginButton.style.opacity = '0';
    loginButton.style.pointerEvents = 'none';
    loginButton.style.transform = 'translateY(20px)';

    // Show initial notification
    showFloatingNotification('Faça login para aparecer o botão de entrar');

    // Function to check if both fields have content
    function checkInputs() {
        if (usernameInput.value.trim() && passwordInput.value.trim()) {
            loginButton.style.opacity = '1';
            loginButton.style.pointerEvents = 'auto';
            loginButton.style.transform = 'translateY(0)';
            
            // Show welcome notification
            showFloatingNotification(`Olá ${usernameInput.value}!`);
        } else {
            loginButton.style.opacity = '0';
            loginButton.style.pointerEvents = 'none';
            loginButton.style.transform = 'translateY(20px)';

            // Show instruction notification if both fields are empty
            if (!usernameInput.value.trim() && !passwordInput.value.trim()) {
                showFloatingNotification('Faça login para aparecer o botão de entrar');
            }
        }
    }

    // Add input event listeners to both fields
    usernameInput.addEventListener('input', checkInputs);
    passwordInput.addEventListener('input', checkInputs);

    // Add floating notification function
    function showFloatingNotification(message) {
        // Remove existing notification if any
        const existingNotification = document.querySelector('.floating-notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'floating-notification';
        notification.textContent = message;
        
        document.body.appendChild(notification);

        // Trigger animation
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        // Remove notification after 5 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 500);
        }, 5000);
    }
});