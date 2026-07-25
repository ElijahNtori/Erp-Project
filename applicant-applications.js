document.addEventListener('DOMContentLoaded', function() {
    const userEmail = localStorage.getItem('userEmail');
    const userType = localStorage.getItem('userType');
    
    if (!userEmail || userType !== 'applicant') {
        window.location.href = 'applicant-login.html';
        return;
    }
    
    document.getElementById('userEmail').textContent = userEmail;
    
    loadApplications('all');
    
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            loadApplications(this.dataset.filter);
        });
    });
});

function loadApplications(filter) {
    const applications = JSON.parse(localStorage.getItem('applications') || '[]');
    const userApplications = applications.filter(app => app.applicantEmail === localStorage.getItem('userEmail'));
    
    const applicationsList = document.getElementById('applicationsList');
    
    let filteredApps = userApplications;
    
    if (filter === 'pending') {
        filteredApps = userApplications.filter(app => app.status === 'Pending');
    } else if (filter === 'interview') {
        filteredApps = userApplications.filter(app => app.status === 'Interview Scheduled');
    } else if (filter === 'accepted') {
        filteredApps = userApplications.filter(app => app.status === 'Accepted');
    } else if (filter === 'rejected') {
        filteredApps = userApplications.filter(app => app.status === 'Rejected');
    }
    
    if (filteredApps.length === 0) {
        applicationsList.innerHTML = '<p class="no-applications">No applications found</p>';
        return;
    }
    
    applicationsList.innerHTML = filteredApps.map((app, index) => `
        <div class="application-card">
            <div class="application-header">
                <h3>${app.jobTitle}</h3>
                <span class="status-badge status-${app.status.toLowerCase().replace(' ', '-')}">${app.status}</span>
            </div>
            <div class="application-details">
                <p><strong>Company:</strong> ${app.company}</p>
                <p><strong>Department:</strong> ${app.department}</p>
                <p><strong>Applied Date:</strong> ${new Date(app.appliedDate).toLocaleDateString()}</p>
                ${app.interviewDate ? `<p><strong>Interview Date:</strong> ${new Date(app.interviewDate).toLocaleString()}</p>` : ''}
            </div>
        </div>
    `).join('');
}

function logout() {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userType');
    localStorage.removeItem('userName');
    alert('Logged out successfully');
    window.location.href = 'applicant-login.html';
}
