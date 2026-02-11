// SmartVote core logic
let users = [];
let currentUser = null;
let elections = [
    {
        id: 1,
        name: "Class Representative",
        candidates: [
            { id: 1, name: "Alice Kumar", party: "Unity", agenda: "Better campus facilities." },
            { id: 2, name: "Rahul Singh", party: "Progress", agenda: "More student events." }
        ],
        votes: [],
        open: true,
        closeTime: Date.now() + 86400000 // closes in 24h
    },
    {
        id: 2,
        name: "Community Poll",
        candidates: [
            { id: 1, name: "Priya Das", party: "Green", agenda: "Eco-friendly campus." },
            { id: 2, name: "Mohit Verma", party: "Tech", agenda: "Digital transformation." }
        ],
        votes: [],
        open: true,
        closeTime: Date.now() + 43200000 // closes in 12h
    }
];
let blockchain = [];
function showRegister() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('register-form').style.display = 'block';
}
function showLogin() {
    document.getElementById('register-form').style.display = 'none';
    document.getElementById('login-form').style.display = 'block';
}
function registerUser() {
    const name = document.getElementById('reg-name').value;
    const id = document.getElementById('reg-id').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const region = document.getElementById('reg-region').value;
    if (!name || !id || !email || !password || !region) return alert('Fill all fields');
    if (users.find(u => u.id === id || u.email === email)) return alert('User exists');
    users.push({ name, id, email, password, region, voted: {}, otp: null });
    alert('Registered! Please login.');
    showLogin();
}
function loginUser() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    const user = users.find(u => (u.email === username || u.id === username) && u.password === password);
    if (!user) return alert('Invalid credentials');
    // Generate OTP
    user.otp = Math.floor(100000 + Math.random() * 900000).toString();
    showModal(`<h3>2FA Verification</h3><p>Enter OTP sent to your email (demo): <b>${user.otp}</b></p><input type='text' id='otp-input' placeholder='Enter OTP'><button onclick='verifyOTP("${user.email}")'>Verify</button>`);
}
function verifyOTP(email) {
    const user = users.find(u => u.email === email);
    const otpInput = document.getElementById('otp-input').value;
    if (otpInput === user.otp) {
        currentUser = user;
        user.otp = null;
        closeModal();
        document.getElementById('auth-modal').style.display = 'none';
        renderDashboard();
        window.scrollTo({ top: document.getElementById('dashboard-section').offsetTop, behavior: 'smooth' });
    } else {
        alert('Invalid OTP');
    }
}
function renderDashboard() {
    let html = `<div class='dashboard-welcome'><h2>Welcome, ${currentUser.name} <span style='font-size:0.8em;color:#888;'>(${currentUser.region})</span></h2></div>`;
    html += `<h3>Available Elections</h3>`;
    elections.forEach(election => {
        const voted = currentUser.voted[election.id];
        let timeLeft = Math.max(0, election.closeTime - Date.now());
        let mins = Math.floor(timeLeft / 60000);
        let secs = Math.floor((timeLeft % 60000) / 1000);
        html += `<div class='election-card'>
            <h4>${election.name}</h4>
            <p>Status: ${election.open ? 'Open' : 'Closed'}</p>
            <div class='progress-bar'><div class='progress' style='width:${100 - (timeLeft / (election.closeTime - (election.closeTime - 86400000))) * 100}%'></div></div>
            <p>Time left: ${mins}m ${secs}s</p>
            <p>Your vote: ${voted ? 'Voted' : 'Not Voted'}</p>
            <button class='cta-btn' onclick="showElection(${election.id})" ${!election.open ? 'disabled' : ''}>View & Vote</button>
        </div>`;
    });
    html += `<button class='cta-btn' style='margin-top:2rem;' onclick="showBlockchain()">View Blockchain Ledger</button>`;
    document.getElementById('dashboard-section').innerHTML = html;
}
function showElection(electionId) {
    const election = elections.find(e => e.id === electionId);
    let html = `<h3>${election.name}</h3>`;
    html += `<div class="candidates-list">`;
    election.candidates.forEach(c => {
        html += `<div class='candidate-card'>
            <h4>${c.name} (${c.party})</h4>
            <p>${c.agenda}</p>
            <button class='login-btn' onclick="showModal('<h4>${c.name}</h4><p>${c.agenda}</p>')">Read More</button>
            <input type="radio" name="vote" value="${c.id}" id="vote-${c.id}">
            <label for="vote-${c.id}">Select</label>
        </div>`;
    });
    html += `</div>`;
    const voted = currentUser.voted[election.id];
    html += `<button class='cta-btn' onclick="castVote(${election.id})" ${voted ? 'disabled' : ''}>Confirm Vote</button>`;
    html += `<button class='login-btn' onclick="renderDashboard()">Back</button>`;
    document.getElementById('dashboard-section').innerHTML = html;
}
function castVote(electionId) {
    const election = elections.find(e => e.id === electionId);
    if (currentUser.voted[electionId]) return alert('Already voted');
    const selected = document.querySelector('input[name="vote"]:checked');
    if (!selected) return alert('Select a candidate');
    // Simulate token system
    const token = Math.random().toString(36).substr(2, 9);
    election.votes.push({ candidateId: Number(selected.value), token, region: currentUser.region });
    currentUser.voted[electionId] = true;
    // Blockchain demo
    blockchain.push({
        block: blockchain.length + 1,
        vote: { candidateId: Number(selected.value), electionId, token },
        timestamp: new Date().toISOString(),
        prevHash: blockchain.length ? hashBlock(blockchain[blockchain.length-1]) : 'GENESIS',
        hash: '' // will be set below
    });
    blockchain[blockchain.length-1].hash = hashBlock(blockchain[blockchain.length-1]);
    alert('Vote cast!');
    renderDashboard();
    showResults(electionId);
}
function hashBlock(block) {
    return btoa(JSON.stringify(block)).substr(0,16);
}
function showResults(electionId) {
    const election = elections.find(e => e.id === electionId);
    let html = `<h3>Results for ${election.name}</h3>`;
    const counts = {};
    const regionCounts = {};
    election.candidates.forEach(c => counts[c.id] = 0);
    ['North','South','East','West'].forEach(r => regionCounts[r] = 0);
    election.votes.forEach(v => {
        counts[v.candidateId]++;
        regionCounts[v.region]++;
    });
    let total = election.votes.length;
    html += `<canvas id="resultsChart" width="400" height="200"></canvas>`;
    html += `<canvas id="regionChart" width="400" height="200"></canvas>`;
    html += `<button class='login-btn' onclick="renderDashboard()">Back to Dashboard</button>`;
    document.getElementById('dashboard-section').innerHTML = html;
    // Chart.js
    setTimeout(() => {
        const ctx = document.getElementById('resultsChart').getContext('2d');
        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: election.candidates.map(c => c.name),
                datasets: [{
                    data: election.candidates.map(c => counts[c.id]),
                    backgroundColor: ['#2d6cdf', '#1a4fa0', '#f4b400', '#34a853']
                }]
            },
            options: {
                plugins: {
                    legend: { position: 'bottom' }
                }
            }
        });
        const ctx2 = document.getElementById('regionChart').getContext('2d');
        new Chart(ctx2, {
            type: 'bar',
            data: {
                labels: Object.keys(regionCounts),
                datasets: [{
                    label: 'Votes by Region',
                    data: Object.values(regionCounts),
                    backgroundColor: ['#2d6cdf', '#1a4fa0', '#f4b400', '#34a853']
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
// Dark mode toggle
const darkBtn = document.getElementById('darkModeToggle');
darkBtn.onclick = () => {
    document.body.classList.toggle('dark-mode');
};
// Modal logic
function showModal(html) {
    document.getElementById('modal-content').innerHTML = html + `<br><button class='login-btn' onclick='closeModal()'>Close</button>`;
    document.getElementById('modal').style.display = 'flex';
}
function closeModal() {
    document.getElementById('modal').style.display = 'none';
}
// Blockchain ledger view
function showBlockchain() {
    let html = `<h3>Blockchain Vote Ledger</h3><div style='max-height:300px;overflow:auto;'>`;
    blockchain.forEach(block => {
        html += `<div style='border-bottom:1px solid #eee;padding:0.5em;'>Block #${block.block}<br>Vote: Candidate ${block.vote.candidateId} in Election ${block.vote.electionId}<br>Token: ${block.vote.token}<br>Time: ${block.timestamp}<br>Hash: ${block.hash}<br>Prev: ${block.prevHash}</div>`;
    });
    html += `</div><button class='login-btn' onclick='renderDashboard()'>Back</button>`;
    document.getElementById('dashboard-section').innerHTML = html;
}
