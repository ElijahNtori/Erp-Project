document.addEventListener('DOMContentLoaded', function() {
    const userEmail = localStorage.getItem('userEmail');
    const userType = localStorage.getItem('userType');
    
    if (!userEmail || userType !== 'applicant') {
        window.location.href = 'applicant-login.html';
        return;
    }
    
    document.getElementById('userEmail').textContent = userEmail;
    
    loadJobDetails();
});

function loadJobDetails() {
    const selectedJob = JSON.parse(localStorage.getItem('selectedJob'));
    const jobContent = document.getElementById('jobContent');
    
    if (!selectedJob) {
        jobContent.innerHTML = '<p class="error">Job not found. <a href="applicant-jobs.html">Browse Jobs</a></p>';
        return;
    }
    
    jobContent.innerHTML = `
        <div class="job-header-section">
            <h1>${selectedJob.title}</h1>
            <div class="job-meta">
                <span class="meta-item">${selectedJob.company}</span>
                <span class="meta-item">•</span>
                <span class="meta-item">${selectedJob.department}</span>
                <span class="meta-item">•</span>
                <span class="meta-item">${selectedJob.type}</span>
                <span class="meta-item">•</span>
                <span class="meta-item">${selectedJob.location}</span>
            </div>
            <span class="salary-badge large">${selectedJob.salary || 'Competitive'}</span>
        </div>
        
        <div class="job-section">
            <h2>Job Description</h2>
            <p>${selectedJob.description}</p>
        </div>
        
        <div class="job-section">
            <h2>Requirements</h2>
            <p>${selectedJob.requirements}</p>
        </div>
        
        <div class="job-section">
            <h2>Job Information</h2>
            <div class="info-grid">
                <div class="info-item">
                    <strong>Company:</strong>
                    <span>${selectedJob.company}</span>
                </div>
                <div class="info-item">
                    <strong>Department:</strong>
                    <span>${selectedJob.department}</span>
                </div>
                <div class="info-item">
                    <strong>Job Type:</strong>
                    <span>${selectedJob.type}</span>
                </div>
                <div class="info-item">
                    <strong>Location:</strong>
                    <span>${selectedJob.location}</span>
                </div>
                <div class="info-item">
                    <strong>Posted Date:</strong>
                    <span>${new Date(selectedJob.postedDate).toLocaleDateString()}</span>
                </div>
            </div>
        </div>
        
        <div class="apply-section">
            <button class="login-btn apply-btn" onclick="applyForJob()">Apply for this Position</button>
        </div>
    `;
}

function applyForJob() {
    window.location.href = 'application-form.html';
}

function logout() {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userType');
    localStorage.removeItem('userName');
    alert('Logged out successfully');
    window.location.href = 'applicant-login.html';
}
