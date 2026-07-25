document.addEventListener('DOMContentLoaded', function() {
    const userEmail = localStorage.getItem('userEmail');
    const userType = localStorage.getItem('userType');
    
    if (!userEmail || userType !== 'applicant') {
        window.location.href = 'applicant-login.html';
        return;
    }
    
    document.getElementById('userEmail').textContent = userEmail;
    
    loadJobs('all');
    
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            loadJobs(this.dataset.filter);
        });
    });
    
    document.getElementById('searchInput').addEventListener('input', debounce(function() {
        const searchTerm = this.value.toLowerCase();
        loadJobs('all', searchTerm);
    }, 300));
});

function loadJobs(filter, searchTerm = '') {
    const jobs = JSON.parse(localStorage.getItem('jobs') || '[]');
    const jobsList = document.getElementById('jobsList');
    
    let filteredJobs = jobs.filter(job => job.status === 'Active');
    
    if (filter !== 'all') {
        filteredJobs = filteredJobs.filter(job => 
            job.department.toLowerCase() === filter
        );
    }
    
    if (searchTerm) {
        filteredJobs = filteredJobs.filter(job =>
            job.title.toLowerCase().includes(searchTerm) ||
            job.company.toLowerCase().includes(searchTerm) ||
            job.description.toLowerCase().includes(searchTerm) ||
            job.requirements.toLowerCase().includes(searchTerm)
        );
    }
    
    if (filteredJobs.length === 0) {
        jobsList.innerHTML = '<p class="no-jobs">No jobs found</p>';
        return;
    }
    
    jobsList.innerHTML = filteredJobs.map((job, index) => `
        <div class="job-card" onclick="viewJob(${jobs.indexOf(job)})">
            <div class="job-header">
                <h3>${job.title}</h3>
                <span class="salary-badge">${job.salary || 'Competitive'}</span>
            </div>
            <div class="job-details">
                <p><strong>Company:</strong> ${job.company}</p>
                <p><strong>Department:</strong> ${job.department}</p>
                <p><strong>Type:</strong> ${job.type}</p>
                <p><strong>Location:</strong> ${job.location}</p>
            </div>
            <div class="job-footer">
                <span class="apply-hint">Click to view details and apply</span>
            </div>
        </div>
    `).join('');
}

function viewJob(index) {
    const jobs = JSON.parse(localStorage.getItem('jobs') || '[]');
    const job = jobs[index];
    
    localStorage.setItem('selectedJob', JSON.stringify(job));
    localStorage.setItem('selectedJobIndex', index);
    
    window.location.href = 'job-details.html';
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function logout() {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userType');
    localStorage.removeItem('userName');
    alert('Logged out successfully');
    window.location.href = 'applicant-login.html';
}
