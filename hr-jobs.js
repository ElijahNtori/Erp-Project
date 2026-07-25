document.addEventListener('DOMContentLoaded', function() {
    const userEmail = localStorage.getItem('userEmail');
    const userType = localStorage.getItem('userType');
    
    if (!userEmail || userType !== 'hr') {
        window.location.href = 'hr-login.html';
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
});

function loadJobs(filter) {
    const jobs = JSON.parse(localStorage.getItem('jobs') || '[]');
    const jobsList = document.getElementById('jobsList');
    
    let filteredJobs = jobs;
    
    if (filter === 'active') {
        filteredJobs = jobs.filter(job => job.status === 'Active');
    } else if (filter === 'closed') {
        filteredJobs = jobs.filter(job => job.status === 'Closed');
    }
    
    if (filteredJobs.length === 0) {
        jobsList.innerHTML = '<p class="no-jobs">No jobs found</p>';
        return;
    }
    
    jobsList.innerHTML = filteredJobs.map((job, index) => `
        <div class="job-card">
            <div class="job-header">
                <h3>${job.title}</h3>
                <span class="status-badge ${job.status === 'Active' ? 'status-active' : 'status-closed'}">${job.status}</span>
            </div>
            <div class="job-details">
                <p><strong>Company:</strong> ${job.company}</p>
                <p><strong>Department:</strong> ${job.department}</p>
                <p><strong>Type:</strong> ${job.type}</p>
                <p><strong>Location:</strong> ${job.location}</p>
                <p><strong>Applications:</strong> ${job.applications || 0}</p>
            </div>
            <div class="job-actions">
                <button class="action-btn-small edit-btn" onclick="editJob(${jobs.indexOf(job)})">Edit</button>
                <button class="action-btn-small toggle-btn" onclick="toggleJobStatus(${jobs.indexOf(job)})">
                    ${job.status === 'Active' ? 'Close' : 'Reopen'}
                </button>
                <button class="action-btn-small delete-btn" onclick="deleteJob(${jobs.indexOf(job)})">Delete</button>
            </div>
        </div>
    `).join('');
}

function editJob(index) {
    const jobs = JSON.parse(localStorage.getItem('jobs') || '[]');
    const job = jobs[index];
    
    localStorage.setItem('editingJob', JSON.stringify(job));
    localStorage.setItem('editingJobIndex', index);
    
    window.location.href = 'hr-post-job.html';
}

function toggleJobStatus(index) {
    const jobs = JSON.parse(localStorage.getItem('jobs') || '[]');
    
    if (jobs[index].status === 'Active') {
        jobs[index].status = 'Closed';
    } else {
        jobs[index].status = 'Active';
    }
    
    localStorage.setItem('jobs', JSON.stringify(jobs));
    
    alert(`Job ${jobs[index].status === 'Active' ? 'reopened' : 'closed'} successfully`);
    loadJobs('all');
}

function deleteJob(index) {
    if (!confirm('Are you sure you want to delete this job?')) {
        return;
    }
    
    const jobs = JSON.parse(localStorage.getItem('jobs') || '[]');
    jobs.splice(index, 1);
    localStorage.setItem('jobs', JSON.stringify(jobs));
    
    alert('Job deleted successfully');
    loadJobs('all');
}

function logout() {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userType');
    localStorage.removeItem('userName');
    alert('Logged out successfully');
    window.location.href = 'hr-login.html';
}
