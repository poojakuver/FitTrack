document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('signupForm');
    const emailInput = form.querySelector('input[name="email"]');
    const passwordInput = form.querySelector('input[name="password"]');

    const validateForm = () => {
        let isValid = true;

        // Validate email
        if (!validateEmail(emailInput.value)) {
            showError(emailInput, 'Invalid email address');
            isValid = false;
        } else {
            clearError(emailInput);
        }

        // Validate password
        if (!validatePassword(passwordInput.value)) {
            showError(passwordInput, 'Password must be at least 8 characters');
            isValid = false;
        } else {
            clearError(passwordInput);
        }

        return isValid;
    };

    // Real-time validation
    emailInput.addEventListener('input', () => {
        if (emailInput.value) {
            if (!validateEmail(emailInput.value)) {
                showError(emailInput, 'Invalid email address');
            } else {
                clearError(emailInput);
            }
        } else {
            clearError(emailInput);
        }
    });

    passwordInput.addEventListener('input', () => {
        if (passwordInput.value) {
            if (!validatePassword(passwordInput.value)) {
                showError(passwordInput, 'Password must be at least 8 characters');
            } else {
                clearError(passwordInput);
            }
        } else {
            clearError(passwordInput);
        }
    });

    // Form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (validateForm()) {
            const formData = {
                email: emailInput.value,
                name: form.querySelector('input[name="name"]').value,
                password: passwordInput.value
            };
            
            try {
                const response = await fetch('http://localhost:3000/user/signup', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(formData),
                });
            
                if (response.ok) {
                    const data = await response.json();
                    localStorage.setItem('user', data.token);
                    window.location.href = 'userdashboard.html';
                } else {
                    const error = await response.json();
                    alert(`Error: ${error.message}`);
                }
            } catch (error) {
                alert('Something went wrong. Please try again.');
            }
        }
    });
});