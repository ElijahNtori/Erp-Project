document.addEventListener('DOMContentLoaded', function() {
    const userEmail = localStorage.getItem('userEmail');
    const userType = localStorage.getItem('userType');
    
    if (!userEmail || userType !== 'applicant') {
        window.location.href = 'applicant-login.html';
        return;
    }
    
    document.getElementById('userEmail').textContent = userEmail;
    
    loadApplications();
    loadAvailableJobs();
});

function loadApplications() {
    const applications = JSON.parse(localStorage.getItem('applications') || '[]');
    const userApplications = applications.filter(app => app.applicantEmail === localStorage.getItem('userEmail'));
    
    document.getElementById('totalApps').textContent = userApplications.length;
    document.getElementById('pendingApps').textContent = userApplications.filter(app => app.status === 'Pending').length;
    document.getElementById('interviewApps').textContent = userApplications.filter(app => app.status === 'Interview Scheduled').length;
    document.getElementById('acceptedApps').textContent = userApplications.filter(app => app.status === 'Accepted').length;
}

function loadAvailableJobs() {
    const jobs = JSON.parse(localStorage.getItem('jobs') || '[]');
    const jobsList = document.getElementById('jobsList');
    
    const activeJobs = jobs.filter(job => job.status === 'Active');
    
    if (activeJobs.length === 0) {
        jobsList.innerHTML = '<p class="no-jobs">No jobs available at the moment</p>';
        return;
    }
    
    jobsList.innerHTML = activeJobs.slice(0, 3).map((job, index) => `
        <div class="job-item" onclick="viewJob(${jobs.indexOf(job)})">
            <div class="job-item-header">
                <h4>${job.title}</h4>
                <span class="job-item-company">${job.company}</span>
            </div>
            <div class="job-item-details">
                <span>${job.department}</span>
                <span>•</span>
                <span>${job.type}</span>
                <span>•</span>
                <span>${job.location}</span>
            </div>
        </div>
    `).join('');
    
    if (activeJobs.length > 3) {
        jobsList.innerHTML += `
            <a href="applicant-jobs.html" class="view-all-jobs">View all ${activeJobs.length} jobs →</a>
        `;
    }
}

function viewJob(index) {
    const jobs = JSON.parse(localStorage.getItem('jobs') || '[]');
    const job = jobs[index];
    
    localStorage.setItem('selectedJob', JSON.stringify(job));
    localStorage.setItem('selectedJobIndex', index);
    
    window.location.href = 'job-details.html';
}

function logout() {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userType');
    localStorage.removeItem('userName');
    alert('Logged out successfully');
    window.location.href = 'applicant-login.html';
}
