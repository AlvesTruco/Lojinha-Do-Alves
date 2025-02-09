document.addEventListener('DOMContentLoaded', () => {
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
  for (let i = 0; i < 200; i++) {
    setTimeout(createSnow, Math.random() * 1000);
  }

  // Toggle password visibility for login
  const togglePassword = document.getElementById('togglePassword');
  const password = document.getElementById('password');
  togglePassword.addEventListener('click', function() {
    const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
    password.setAttribute('type', type);
    this.classList.toggle('fa-eye');
    this.classList.toggle('fa-eye-slash');
  });

  // Toggle password visibility for register inputs
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

  // Global function to toggle panels
  window.togglePanels = function(show) {
    const panels = {
      login: document.getElementById('loginPanel'),
      register: document.getElementById('registerPanel'),
      forgotPassword: document.getElementById('forgotPasswordPanel'),
      resetCode: document.getElementById('resetCodePanel'),
      newPassword: document.getElementById('newPasswordPanel'),
      emailConfirm: document.getElementById('emailConfirmPanel')
    };
    
    // Hide all panels
    Object.values(panels).forEach(panel => {
      panel.style.opacity = '0';
      panel.style.display = 'none';
      panel.classList.remove('slide-in');
    });
    
    // Show the selected panel
    const selectedPanel = panels[show] || panels.login;
    selectedPanel.style.display = 'block';
    setTimeout(() => {
      selectedPanel.style.opacity = '1';
      selectedPanel.classList.add('slide-in');
    }, 50);
  };

  // Login handler (existing code)
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

  // Updated register handler with email confirmation step
  const handleRegister = function(event) {
    event.preventDefault();
    
    const username = document.getElementById('regUsername').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const confirmEmail = document.getElementById('regConfirmEmail').value.trim();
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;
    
    if (!username || !email || !confirmEmail || !password || !confirmPassword) {
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
    
    if(email !== confirmEmail) {
      showError('Os emails não coincidem');
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
    
    const button = event.target.querySelector('button');
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processando...';
    button.disabled = true;
    
    setTimeout(() => {
      try {
        const confirmationCode = Math.floor(100000 + Math.random() * 900000);
        localStorage.setItem(
          `pendingRegistration_${email}`,
          JSON.stringify({
            username,
            email,
            password,
            code: confirmationCode,
            expires: Date.now() + 3600000
          })
        );
        showSuccess(`Código de confirmação enviado para ${email}! (Código: ${confirmationCode})`);
        document.getElementById('pendingEmail').value = email;
        event.target.reset();
        // When switching to email confirmation panel, also show the code beside it for 10 seconds
        setTimeout(() => {
          togglePanels('emailConfirm');
          showConfirmationCode(confirmationCode);
        }, 1500);
      } catch (error) {
        showError('Erro ao processar o registro. Tente novamente.');
      } finally {
        button.innerHTML = '<span>Registrar</span>';
        button.disabled = false;
      }
    }, 1000);
    
    return false;
  };

  // New handler for email confirmation step
  const handleEmailConfirm = function(event) {
    event.preventDefault();
    const email = document.getElementById('pendingEmail').value;
    const codeInput = document.getElementById('emailConfirmCode').value;
    const pendingData = JSON.parse(localStorage.getItem(`pendingRegistration_${email}`) || '{}');
    const button = event.target.querySelector('button');
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verificando...';
    button.disabled = true;
    
    setTimeout(() => {
      if (pendingData.code && pendingData.code.toString() === codeInput && Date.now() < pendingData.expires) {
        let registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        registeredUsers.push({
          username: pendingData.username,
          email: pendingData.email,
          password: pendingData.password
        });
        localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
        localStorage.removeItem(`pendingRegistration_${email}`);
        showSuccess('Conta criada com sucesso!');
        document.getElementById('emailConfirmForm').reset();
        setTimeout(() => togglePanels('login'), 1500);
      } else {
        showError('Código inválido ou expirado');
      }
      button.innerHTML = '<span>Confirmar Email</span>';
      button.disabled = false;
    }, 1000);
    
    return false;
  };

  // Handler for forgot password (existing code)
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
          expires: Date.now() + 3600000
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
      
      if (storedReset.code && storedReset.code.toString() === code && Date.now() < storedReset.expires) {
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

  // Utility function to validate email
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Utility functions for notifications
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

  // Password strength validation for registration
  const checkPasswordStrength = function(password) {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength += 1;
    if (password.match(/\d/)) strength += 1;
    if (password.match(/[^a-zA-Z\d]/)) strength += 1;
    return strength;
  };

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

  // New event listener for email confirmation input
  document.getElementById('regConfirmEmail').addEventListener('input', function(e) {
    const email = document.getElementById('regEmail').value;
    const confirmEmail = e.target.value;
    if (email && confirmEmail) {
      if (email !== confirmEmail) {
        e.target.setCustomValidity('Os emails não coincidem');
      } else {
        e.target.setCustomValidity('');
      }
    }
  });

  // Floating notification for login button
  const loginButton = document.querySelector('#loginForm .login-btn');
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');

  loginButton.style.opacity = '0';
  loginButton.style.pointerEvents = 'none';
  loginButton.style.transform = 'translateY(20px)';

  showFloatingNotification('Faça login para aparecer o botão de entrar');

  function checkInputs() {
    if (usernameInput.value.trim() && passwordInput.value.trim()) {
      loginButton.style.opacity = '1';
      loginButton.style.pointerEvents = 'auto';
      loginButton.style.transform = 'translateY(0)';
      showFloatingNotification(`Olá ${usernameInput.value}!`);
    } else {
      loginButton.style.opacity = '0';
      loginButton.style.pointerEvents = 'none';
      loginButton.style.transform = 'translateY(20px)';
      if (!usernameInput.value.trim() && !passwordInput.value.trim()) {
        showFloatingNotification('Faça login para aparecer o botão de entrar');
      }
    }
  }

  usernameInput.addEventListener('input', checkInputs);
  passwordInput.addEventListener('input', checkInputs);

  function showFloatingNotification(message) {
    const existingNotification = document.querySelector('.floating-notification');
    if (existingNotification) {
      existingNotification.remove();
    }
    const notification = document.createElement('div');
    notification.className = 'floating-notification';
    notification.textContent = message;
    notification.style.fontFamily = "'Poppins', sans-serif";
    notification.style.fontSize = '1.2em';
    document.body.appendChild(notification);
    setTimeout(() => {
      notification.classList.add('show');
    }, 100);
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        notification.remove();
      }, 500);
    }, 5000);
  }

  // Function to show confirmation code next to the email confirmation panel for 10 seconds
  function showConfirmationCode(code) {
    const panel = document.getElementById('emailConfirmPanel');
    if (!panel) return;
    const codeDisplay = document.createElement('div');
    codeDisplay.className = 'confirmation-code-display';
    codeDisplay.textContent = `Código: ${code}`;
    panel.appendChild(codeDisplay);

    // Fade in the code display
    setTimeout(() => {
      codeDisplay.classList.add('show');
    }, 10);

    // Remove the code display after 10 seconds with fade out effect
    setTimeout(() => {
      codeDisplay.classList.remove('show');
      setTimeout(() => {
        codeDisplay.remove();
      }, 500);
    }, 10000);
  }

  // Bind form submissions
  document.getElementById('loginForm').onsubmit = handleLogin;
  document.getElementById('registerForm').onsubmit = handleRegister;
  document.getElementById('forgotPasswordForm').onsubmit = handleForgotPassword;
  document.getElementById('resetCodeForm').onsubmit = handleResetCode;
  document.getElementById('newPasswordForm').onsubmit = handleNewPassword;
  document.getElementById('emailConfirmForm').onsubmit = handleEmailConfirm;
});

// Global function for correcting registration data when "Corrigir dados" is clicked
function handleCorrigirDados(event) {
  event.preventDefault();
  const pendingEmailElem = document.getElementById('pendingEmail');
  if (pendingEmailElem && pendingEmailElem.value) {
    const email = pendingEmailElem.value;
    const pendingKey = `pendingRegistration_${email}`;
    const pendingDataStr = localStorage.getItem(pendingKey);
    if (pendingDataStr) {
      try {
        const pendingData = JSON.parse(pendingDataStr);
        document.getElementById('regUsername').value = pendingData.username || '';
        document.getElementById('regEmail').value = pendingData.email || '';
        document.getElementById('regConfirmEmail').value = pendingData.email || '';
        document.getElementById('regPassword').value = pendingData.password || '';
        document.getElementById('regConfirmPassword').value = pendingData.password || '';
      } catch (error) {
        console.error('Error parsing pending registration data:', error);
      }
      localStorage.removeItem(pendingKey);
    }
  }
  togglePanels('register');
}

// Global function for the "A Fonte Aqui" button
function showFonteMessage() {
  Swal.fire({
    icon: 'info',
    title: 'Entre em contato',
    text: 'Entre em contato com o Alves para ele passar os melhores preços do mercado.'
  });
}