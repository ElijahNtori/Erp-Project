document.addEventListener('DOMContentLoaded', function() {
    const hrSignupForm = document.getElementById('hrSignupForm');
    
    hrSignupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const fullName = document.getElementById('fullName').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const department = document.getElementById('department').value;
        const terms = document.getElementById('terms').checked;
        
        if (!validateForm(fullName, email, password, confirmPassword, department, terms)) {
            return;
        }
        
        clearErrors();
        
        const hrAdmins = JSON.parse(localStorage.getItem('hrAdmins') || '[]');
        const existingUser = hrAdmins.find(u => u.email === email);
        
        if (existingUser) {
            showError('email', 'Email already registered');
            return;
        }
        
        const newUser = {
            fullName: fullName,
            email: email,
            password: password,
            department: department,
            registeredDate: new Date().toISOString()
        };
        
        hrAdmins.push(newUser);
        localStorage.setItem('hrAdmins', JSON.stringify(hrAdmins));
        
        alert('Registration successful! Please login.');
        window.location.href = 'hr-login.html';
    });
});

function validateForm(fullName, email, password, confirmPassword, department, terms) {
    let isValid = true;
    
    if (fullName.length < 2) {
        showError('fullName', 'Full name must be at least 2 characters');
        isValid = false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showError('email', 'Please enter a valid email address');
        isValid = false;
    }
    
    if (password.length < 6) {
        showError('password', 'Password must be at least 6 characters');
        isValid = false;
    }
    
    if (password !== confirmPassword) {
        showError('confirmPassword', 'Passwords do not match');
        isValid = false;
    }
    
    if (!department) {
        showError('department', 'Please select a department');
        isValid = false;
    }
    
    if (!terms) {
        showError('terms', 'You must agree to the terms and conditions');
        isValid = false;
    }
    
    return isValid;
}

function showError(fieldId, message) {
    const formGroup = document.getElementById(fieldId).closest('.form-group');
    formGroup.classList.add('error');
    
    const existingError = formGroup.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    formGroup.appendChild(errorDiv);
}

function clearErrors() {
    const formGroups = document.querySelectorAll('.form-group');
    formGroups.forEach(group => {
        group.classList.remove('error');
        const errorMessage = group.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    });
}
