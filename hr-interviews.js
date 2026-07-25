document.addEventListener('DOMContentLoaded', function() {
    const userEmail = localStorage.getItem('userEmail');
    const userType = localStorage.getItem('userType');
    
    if (!userEmail || userType !== 'hr') {
        window.location.href = 'hr-login.html';
        return;
    }
    
    document.getElementById('userEmail').textContent = userEmail;
    
    loadInterviews('all');
    
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            loadInterviews(this.dataset.filter);
        });
    });
});

function loadInterviews(filter) {
    const interviews = JSON.parse(localStorage.getItem('interviews') || '[]');
    const interviewsList = document.getElementById('interviewsList');
    
    let filteredInterviews = interviews;
    
    if (filter === 'upcoming') {
        filteredInterviews = interviews.filter(int => new Date(int.date) >= new Date());
    } else if (filter === 'completed') {
        filteredInterviews = interviews.filter(int => new Date(int.date) < new Date());
    }
    
    if (filteredInterviews.length === 0) {
        interviewsList.innerHTML = '<p class="no-interviews">No interviews found</p>';
        return;
    }
    
    interviewsList.innerHTML = filteredInterviews.map((interview, index) => `
        <div class="interview-card">
            <div class="interview-header">
                <h3>${interview.candidateName}</h3>
                <span class="status-badge ${new Date(interview.date) >= new Date() ? 'status-interview-scheduled' : 'status-accepted'}">
                    ${new Date(interview.date) >= new Date() ? 'Upcoming' : 'Completed'}
                </span>
            </div>
            <div class="interview-details">
                <p><strong>Position:</strong> ${interview.position}</p>
                <p><strong>Company:</strong> ${interview.company}</p>
                <p><strong>Date & Time:</strong> ${new Date(interview.date).toLocaleString()}</p>
                <p><strong>Location:</strong> ${interview.location || 'TBD'}</p>
                <p><strong>Type:</strong> ${interview.type || 'In-person'}</p>
            </div>
            <div class="interview-actions">
                ${new Date(interview.date) >= new Date() ? `
                    <button class="action-btn-small edit-btn" onclick="editInterview(${interviews.indexOf(interview)})">Reschedule</button>
                    <button class="action-btn-small delete-btn" onclick="cancelInterview(${interviews.indexOf(interview)})">Cancel</button>
                ` : ''}
            </div>
        </div>
    `).join('');
}

function editInterview(index) {
    const interviews = JSON.parse(localStorage.getItem('interviews') || '[]');
    const interview = interviews[index];
    
    const newDate = prompt('Enter new date and time (YYYY-MM-DD HH:MM):', interview.date);
    if (newDate) {
        interviews[index].date = newDate;
        localStorage.setItem('interviews', JSON.stringify(interviews));
        alert('Interview rescheduled successfully');
        loadInterviews('all');
    }
}

function cancelInterview(index) {
    if (!confirm('Are you sure you want to cancel this interview?')) {
        return;
    }
    
    const interviews = JSON.parse(localStorage.getItem('interviews') || '[]');
    interviews.splice(index, 1);
    localStorage.setItem('interviews', JSON.stringify(interviews));
    
    alert('Interview cancelled successfully');
    loadInterviews('all');
}

function logout() {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userType');
    localStorage.removeItem('userName');
    alert('Logged out successfully');
    window.location.href = 'hr-login.html';
}
