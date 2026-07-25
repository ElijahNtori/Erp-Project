document.addEventListener('DOMContentLoaded', function() {
    const userEmail = localStorage.getItem('userEmail');
    const userType = localStorage.getItem('userType');
    
    if (!userEmail || userType !== 'hr') {
        window.location.href = 'hr-login.html';
        return;
    }
    
    document.getElementById('userEmail').textContent = userEmail;
    
    // Check if editing existing job
    const editingJob = JSON.parse(localStorage.getItem('editingJob'));
    if (editingJob) {
        document.getElementById('pageTitle').textContent = 'Edit Job';
        document.getElementById('submitBtn').textContent = 'Update Job';
        
        document.getElementById('title').value = editingJob.title;
        document.getElementById('company').value = editingJob.company;
        document.getElementById('department').value = editingJob.department;
        document.getElementById('type').value = editingJob.type;
        document.getElementById('location').value = editingJob.location;
        document.getElementById('description').value = editingJob.description;
        document.getElementById('requirements').value = editingJob.requirements;
        document.getElementById('salary').value = editingJob.salary || '';
    }
    
    const jobForm = document.getElementById('jobForm');
    
    jobForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const jobData = {
            title: document.getElementById('title').value,
            company: document.getElementById('company').value,
            department: document.getElementById('department').value,
            type: document.getElementById('type').value,
            location: document.getElementById('location').value,
            description: document.getElementById('description').value,
            requirements: document.getElementById('requirements').value,
            salary: document.getElementById('salary').value,
            status: 'Active',
            applications: 0,
            postedDate: new Date().toISOString()
        };
        
        if (!validateJobData(jobData)) {
            return;
        }
        
        clearErrors();
        
        const jobs = JSON.parse(localStorage.getItem('jobs') || '[]');
        
        if (editingJob) {
            // Update existing job
            const editingIndex = parseInt(localStorage.getItem('editingJobIndex'));
            jobData.status = editingJob.status;
            jobData.applications = editingJob.applications;
            jobData.postedDate = editingJob.postedDate;
            jobs[editingIndex] = jobData;
            
            localStorage.removeItem('editingJob');
            localStorage.removeItem('editingJobIndex');
            
            alert('Job updated successfully!');
        } else {
            // Create new job
            jobs.push(jobData);
            alert('Job posted successfully!');
        }
        
        localStorage.setItem('jobs', JSON.stringify(jobs));
        window.location.href = 'hr-jobs.html';
    });
});

function validateJobData(data) {
    let isValid = true;
    
    if (data.title.length < 3) {
        showError('title', 'Job title must be at least 3 characters');
        isValid = false;
    }
    
    if (data.company.length < 2) {
        showError('company', 'Company name must be at least 2 characters');
        isValid = false;
    }
    
    if (data.description.length < 10) {
        showError('description', 'Description must be at least 10 characters');
        isValid = false;
    }
    
    if (data.requirements.length < 10) {
        showError('requirements', 'Requirements must be at least 10 characters');
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

function logout() {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userType');
    localStorage.removeItem('userName');
    alert('Logged out successfully');
    window.location.href = 'hr-login.html';
}
