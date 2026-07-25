document.addEventListener('DOMContentLoaded', function() {
    const userEmail = localStorage.getItem('userEmail');
    const userType = localStorage.getItem('userType');
    
    if (!userEmail || userType !== 'hr') {
        window.location.href = 'hr-login.html';
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
    const applicationsList = document.getElementById('applicationsList');
    
    let filteredApps = applications;
    
    if (filter === 'pending') {
        filteredApps = applications.filter(app => app.status === 'Pending');
    } else if (filter === 'interview') {
        filteredApps = applications.filter(app => app.status === 'Interview Scheduled');
    } else if (filter === 'accepted') {
        filteredApps = applications.filter(app => app.status === 'Accepted');
    } else if (filter === 'rejected') {
        filteredApps = applications.filter(app => app.status === 'Rejected');
    }
    
    if (filteredApps.length === 0) {
        applicationsList.innerHTML = '<p class="no-applications">No applications found</p>';
        return;
    }
    
    applicationsList.innerHTML = filteredApps.map((app, index) => `
        <div class="application-card">
            <div class="application-header">
                <h3>${app.applicantName} - ${app.jobTitle}</h3>
                <span class="status-badge status-${app.status.toLowerCase().replace(' ', '-')}">${app.status}</span>
            </div>
            <div class="application-details">
                <p><strong>Email:</strong> ${app.applicantEmail}</p>
                <p><strong>Phone:</strong> ${app.phone}</p>
                <p><strong>Company:</strong> ${app.company}</p>
                <p><strong>Department:</strong> ${app.department}</p>
                <p><strong>Experience:</strong> ${app.experience}</p>
                <p><strong>Applied Date:</strong> ${new Date(app.appliedDate).toLocaleDateString()}</p>
                ${app.interviewDate ? `<p><strong>Interview Date:</strong> ${new Date(app.interviewDate).toLocaleString()}</p>` : ''}
            </div>
            <div class="application-actions">
                <button class="action-btn-small" onclick="viewDetails(${applications.indexOf(app)})">View Details</button>
                ${app.status === 'Pending' ? `
                    <button class="action-btn-small edit-btn" onclick="scheduleInterview(${applications.indexOf(app)})">Schedule Interview</button>
                    <button class="action-btn-small toggle-btn" onclick="acceptApplication(${applications.indexOf(app)})">Accept</button>
                    <button class="action-btn-small delete-btn" onclick="rejectApplication(${applications.indexOf(app)})">Reject</button>
                ` : ''}
            </div>
        </div>
    `).join('');
}

function viewDetails(index) {
    const applications = JSON.parse(localStorage.getItem('applications') || '[]');
    const application = applications[index];
    
    alert(`
Name: ${application.applicantName}
Email: ${application.applicantEmail}
Phone: ${application.phone}
Address: ${application.address || 'Not provided'}
Experience: ${application.experience}
Current Role: ${application.currentRole || 'Not provided'}
Skills: ${application.skills}
Cover Letter: ${application.coverLetter || 'Not provided'}
Expected Salary: ${application.expectedSalary || 'Not provided'}
    `);
}

function scheduleInterview(index) {
    const applications = JSON.parse(localStorage.getItem('applications') || '[]');
    const application = applications[index];
    
    const date = prompt('Enter interview date and time (YYYY-MM-DD HH:MM):');
    if (date) {
        const location = prompt('Enter interview location:');
        const type = prompt('Enter interview type (In-person/Video/Phone):') || 'In-person';
        
        // Update application status
        applications[index].status = 'Interview Scheduled';
        applications[index].interviewDate = date;
        
        localStorage.setItem('applications', JSON.stringify(applications));
        
        // Add to interviews
        const interviews = JSON.parse(localStorage.getItem('interviews') || '[]');
        interviews.push({
            candidateName: application.applicantName,
            candidateEmail: application.applicantEmail,
            position: application.jobTitle,
            company: application.company,
            date: date,
            location: location,
            type: type,
            applicationIndex: index
        });
        localStorage.setItem('interviews', JSON.stringify(interviews));
        
        alert('Interview scheduled successfully!');
        loadApplications('all');
    }
}

function acceptApplication(index) {
    if (!confirm('Are you sure you want to accept this application?')) {
        return;
    }
    
    const applications = JSON.parse(localStorage.getItem('applications') || '[]');
    applications[index].status = 'Accepted';
    localStorage.setItem('applications', JSON.stringify(applications));
    
    alert('Application accepted successfully!');
    loadApplications('all');
}

function rejectApplication(index) {
    if (!confirm('Are you sure you want to reject this application?')) {
        return;
    }
    
    const applications = JSON.parse(localStorage.getItem('applications') || '[]');
    applications[index].status = 'Rejected';
    localStorage.setItem('applications', JSON.stringify(applications));
    
    alert('Application rejected successfully!');
    loadApplications('all');
}

function logout() {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userType');
    localStorage.removeItem('userName');
    alert('Logged out successfully');
    window.location.href = 'hr-login.html';
}
