// API base URL
const API_BASE = '/api';

// Load patients on page load
document.addEventListener('DOMContentLoaded', () => {
    loadPatients();
    checkSystemHealth();
    loadMetrics();
});

// Check system health
async function checkSystemHealth() {
    try {
        const response = await fetch('/health');
        const data = await response.json();
        document.getElementById('systemStatus').textContent = '✅ Healthy';
        document.getElementById('systemStatus').style.color = 'green';
    } catch (error) {
        document.getElementById('systemStatus').textContent = '❌ Unhealthy';
        document.getElementById('systemStatus').style.color = 'red';
    }
}

// Load patients
async function loadPatients() {
    try {
        const response = await fetch(`${API_BASE}/patients`);
        const data = await response.json();
        
        document.getElementById('totalPatients').textContent = data.count;
        
        const patientList = document.getElementById('patientList');
        if (data.data.length === 0) {
            patientList.innerHTML = '<p>No patients found.</p>';
            return;
        }
        
        patientList.innerHTML = data.data.map(patient => `
            <div class="patient-card">
                <h4>Patient ID: ${patient.id}</h4>
                <p>Name: <span class="encrypted">${patient.name}</span></p>
                <p>Age: ${patient.age}</p>
                <p>Condition: <span class="encrypted">${patient.condition}</span></p>
                <p>Admission Date: ${patient.admissionDate}</p>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading patients:', error);
        document.getElementById('patientList').innerHTML = '<p class="error">Error loading patients.</p>';
    }
}

// View patient details
async function viewPatient() {
    const patientId = document.getElementById('patientId').value;
    if (!patientId) {
        alert('Please enter a patient ID');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/patients/${patientId}`);
        const data = await response.json();
        
        const detailsDiv = document.getElementById('patientDetails');
        if (response.ok) {
            detailsDiv.innerHTML = `
                <h3>Patient Details (Decrypted)</h3>
                <p><strong>ID:</strong> ${data.id}</p>
                <p><strong>Name:</strong> ${data.name}</p>
                <p><strong>Age:</strong> ${data.age}</p>
                <p><strong>Condition:</strong> ${data.condition}</p>
                <p><strong>SSN:</strong> ${data.ssn}</p>
                <p><strong>Admission Date:</strong> ${data.admissionDate}</p>
                <p class="success">🔓 Data decrypted successfully</p>
            `;
        } else {
            detailsDiv.innerHTML = `<p class="error">${data.error}</p>`;
        }
    } catch (error) {
        console.error('Error viewing patient:', error);
        document.getElementById('patientDetails').innerHTML = '<p class="error">Error loading patient details.</p>';
    }
}

// Add new patient
document.getElementById('patientForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const age = document.getElementById('age').value;
    const condition = document.getElementById('condition').value;
    const ssn = document.getElementById('ssn').value;
    
    try {
        const response = await fetch(`${API_BASE}/patients`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, age, condition, ssn })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            alert(`Patient added successfully! ID: ${data.id}`);
            document.getElementById('patientForm').reset();
            loadPatients();
        } else {
            alert(`Error: ${data.error}`);
        }
    } catch (error) {
        console.error('Error adding patient:', error);
        alert('Error adding patient');
    }
});

// Load metrics
async function loadMetrics() {
    try {
        const response = await fetch('/metrics');
        const data = await response.json();
        
        document.getElementById('metrics').innerHTML = `
            <p><strong>Total Patients:</strong> ${data.patients_total}</p>
            <p><strong>Uptime:</strong> ${Math.floor(data.uptime)} seconds</p>
            <p><strong>Timestamp:</strong> ${data.timestamp}</p>
        `;
    } catch (error) {
        console.error('Error loading metrics:', error);
        document.getElementById('metrics').innerHTML = '<p class="error">Error loading metrics.</p>';
    }
}

// Auto-refresh metrics every 30 seconds
setInterval(loadMetrics, 30000);
