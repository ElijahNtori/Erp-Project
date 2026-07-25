document.addEventListener('DOMContentLoaded', function() {
    const applicantLoginForm = document.getElementById('applicantLoginForm');
    
    applicantLoginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        if (!validateForm(email, password)) {
            return;
        }
        
        clearErrors();
        
        const applicants = JSON.parse(localStorage.getItem('applicants') || '[]');
        const user = applicants.find(u => u.email === email && u.password === password);
        
        if (user) {
            localStorage.setItem('userEmail', email);
            localStorage.setItem('userType', 'applicant');
            localStorage.setItem('userName', user.fullName);
            
            alert('Login successful!');
            window.location.href = 'applicant-dashboard.html';
        } else {
            showError('email', 'Invalid email or password');
            showError('password', 'Invalid email or password');
        }
    });
});

function validateForm(email, password) {
    let isValid = true;
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showError('email', 'Please enter a valid email address');
        isValid = false;
    }
    
    if (password.length < 6) {
        showError('password', 'Password must be at least 6 characters');
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
