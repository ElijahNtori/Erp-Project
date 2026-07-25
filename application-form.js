document.addEventListener('DOMContentLoaded', function() {
    const userEmail = localStorage.getItem('userEmail');
    const userType = localStorage.getItem('userType');
    
    if (!userEmail || userType !== 'applicant') {
        window.location.href = 'applicant-login.html';
        return;
    }
    
    document.getElementById('userEmail').textContent = userEmail;
    
    // Pre-fill email
    document.getElementById('email').value = userEmail;
    document.getElementById('email').disabled = true;
    
    // Load selected job info
    const selectedJob = JSON.parse(localStorage.getItem('selectedJob'));
    if (selectedJob) {
        document.getElementById('jobInfoBanner').innerHTML = `
            <div class="job-info-content">
                <h3>Applying for: ${selectedJob.title}</h3>
                <p>${selectedJob.company} - ${selectedJob.department}</p>
            </div>
        `;
    } else {
        document.getElementById('jobInfoBanner').innerHTML = `
            <div class="job-info-content">
                <p>No job selected. <a href="applicant-jobs.html">Browse Jobs</a></p>
            </div>
        `;
    }
    
    const applicationForm = document.getElementById('applicationForm');
    
    applicationForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!selectedJob) {
            alert('Please select a job to apply for');
            window.location.href = 'applicant-jobs.html';
            return;
        }
        
        const applicationData = {
            applicantName: document.getElementById('fullName').value,
            applicantEmail: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value,
            experience: document.getElementById('experience').value,
            currentRole: document.getElementById('currentRole').value,
            skills: document.getElementById('skills').value,
            coverLetter: document.getElementById('coverLetter').value,
            expectedSalary: document.getElementById('expectedSalary').value,
            jobTitle: selectedJob.title,
            company: selectedJob.company,
            department: selectedJob.department,
            jobId: localStorage.getItem('selectedJobIndex'),
            appliedDate: new Date().toISOString(),
            status: 'Pending'
        };
        
        if (!validateApplication(applicationData)) {
            return;
        }
        
        clearErrors();
        
        const applications = JSON.parse(localStorage.getItem('applications') || '[]');
        applications.push(applicationData);
        localStorage.setItem('applications', JSON.stringify(applications));
        
        // Update job application count
        const jobs = JSON.parse(localStorage.getItem('jobs') || '[]');
        const jobIndex = parseInt(localStorage.getItem('selectedJobIndex'));
        if (jobs[jobIndex]) {
            jobs[jobIndex].applications = (jobs[jobIndex].applications || 0) + 1;
            localStorage.setItem('jobs', JSON.stringify(jobs));
        }
        
        // Clear selected job
        localStorage.removeItem('selectedJob');
        localStorage.removeItem('selectedJobIndex');
        
        alert('Application submitted successfully!');
        window.location.href = 'applicant-applications.html';
    });
});

function validateApplication(data) {
    let isValid = true;
    
    if (data.applicantName.length < 2) {
        showError('fullName', 'Full name must be at least 2 characters');
        isValid = false;
    }
    
    if (data.phone.length < 10) {
        showError('phone', 'Please enter a valid phone number');
        isValid = false;
    }
    
    if (data.skills.length < 5) {
        showError('skills', 'Please list at least some skills');
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
    window.location.href = 'applicant-login.html';
}
