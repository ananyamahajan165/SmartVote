// SmartVote Admin Panel Logic
let adminUser = { username: "admin", password: "smartvote2025" };
let isAdminLoggedIn = false;
function adminLogin() {
    const username = document.getElementById('admin-username').value;
    const password = document.getElementById('admin-password').value;
    if (username === adminUser.username && password === adminUser.password) {
        isAdminLoggedIn = true;
        document.getElementById('admin-auth-section').style.display = 'none';
        renderAdminDashboard();
        document.getElementById('admin-dashboard-section').style.display = 'block';
    } else {
        alert('Invalid admin credentials');
    }
}
function renderAdminDashboard() {
    let html = `<h2>Admin Dashboard</h2>`;
    html += `<button onclick="showElectionManager()">Manage Elections</button>`;
    html += `<button onclick="showCandidateManager()">Manage Candidates</button>`;
    html += `<button onclick="showAnalytics()">View Analytics</button>`;
    html += `<button onclick="downloadReport()">Download Report</button>`;
    document.getElementById('admin-dashboard-section').innerHTML = html;
}
function showElectionManager() {
    let html = `<h3>Election Manager</h3>`;
    html += `<p>Create, edit, or schedule elections here.</p>`;
    // ...add forms and logic for managing elections...
    html += `<button onclick="renderAdminDashboard()">Back</button>`;
    document.getElementById('admin-dashboard-section').innerHTML = html;
}
function showCandidateManager() {
    let html = `<h3>Candidate Manager</h3>`;
    html += `<p>Add, edit, or remove candidates for elections.</p>`;
    // ...add forms and logic for managing candidates...
    html += `<button onclick="renderAdminDashboard()">Back</button>`;
    document.getElementById('admin-dashboard-section').innerHTML = html;
}
function showAnalytics() {
    let html = `<h3>Live Analytics</h3>`;
    html += `<canvas id="adminAnalyticsChart" width="400" height="200"></canvas>`;
    html += `<button onclick="renderAdminDashboard()">Back</button>`;
    document.getElementById('admin-dashboard-section').innerHTML = html;
    setTimeout(() => {
        const ctx = document.getElementById('adminAnalyticsChart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Region 1', 'Region 2', 'Region 3'],
                datasets: [{
                    label: 'Votes',
                    data: [12, 19, 7],
                    backgroundColor: ['#2d6cdf', '#1a4fa0', '#f4b400']
                }]
            },
            options: {
                plugins: {
                    legend: { display: false }
                }
            }
        });
    }, 100);
}
function downloadReport() {
    alert('Report downloaded (demo).');
}
// Dark mode toggle
const darkBtnAdmin = document.getElementById('darkModeToggleAdmin');
darkBtnAdmin.onclick = () => {
    document.body.classList.toggle('dark-mode');
};
