document.addEventListener('DOMContentLoaded', function() {
    const userEmail = localStorage.getItem('userEmail');
    const userType = localStorage.getItem('userType');
    
    if (!userEmail || userType !== 'hr') {
        window.location.href = 'hr-login.html';
        return;
    }
    
    document.getElementById('userEmail').textContent = userEmail;
    
    loadDashboardData();
});

function loadDashboardData() {
    const applications = JSON.parse(localStorage.getItem('applications') || '[]');
    const jobs = JSON.parse(localStorage.getItem('jobs') || '[]');
    const interviews = JSON.parse(localStorage.getItem('interviews') || '[]');
    
    document.getElementById('totalApps').textContent = applications.length;
    document.getElementById('pendingApps').textContent = applications.filter(app => app.status === 'Pending').length;
    document.getElementById('interviewsScheduled').textContent = interviews.length;
    document.getElementById('activeJobs').textContent = jobs.filter(job => job.status === 'Active').length;
    
    loadPostedJobs();
    loadRecentApplications();
}

function loadPostedJobs() {
    const jobs = JSON.parse(localStorage.getItem('jobs') || '[]');
    const jobsList = document.getElementById('jobsList');
    
    if (jobs.length === 0) {
        jobsList.innerHTML = '<p class="no-jobs">No jobs posted yet</p>';
        return;
    }
    
    jobsList.innerHTML = jobs.slice(0, 3).map((job, index) => `
        <div class="job-item" onclick="viewJob(${index})">
            <div class="job-item-header">
                <h4>${job.title}</h4>
                <span class="job-item-status ${job.status === 'Active' ? 'status-active' : 'status-closed'}">${job.status}</span>
            </div>
            <div class="job-item-details">
                <span>${job.company}</span>
                <span>•</span>
                <span>${job.department}</span>
                <span>•</span>
                <span>${job.applications || 0} applications</span>
            </div>
        </div>
    `).join('');
    
    if (jobs.length > 3) {
        jobsList.innerHTML += `
            <a href="hr-jobs.html" class="view-all-jobs">View all ${jobs.length} jobs →</a>
        `;
    }
}

function loadRecentApplications() {
    const applications = JSON.parse(localStorage.getItem('applications') || '[]');
    const applicationsList = document.getElementById('applicationsList');
    
    if (applications.length === 0) {
        applicationsList.innerHTML = '<p class="no-applications">No recent applications</p>';
        return;
    }
    
    applicationsList.innerHTML = applications.slice(-5).reverse().map((app, index) => `
        <div class="application-card">
            <div class="application-header">
                <h3>${app.applicantName} - ${app.jobTitle}</h3>
                <span class="status-badge status-${app.status.toLowerCase().replace(' ', '-')}">${app.status}</span>
            </div>
            <div class="application-details">
                <p><strong>Email:</strong> ${app.applicantEmail}</p>
                <p><strong>Applied Date:</strong> ${new Date(app.appliedDate).toLocaleDateString()}</p>
            </div>
        </div>
    `).join('');
}

function viewJob(index) {
    window.location.href = 'hr-jobs.html';
}

function logout() {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userType');
    localStorage.removeItem('userName');
    alert('Logged out successfully');
    window.location.href = 'hr-login.html';
}
