const express = require('express');
const crypto = require('crypto');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(express.json());

// Rate limiting to prevent brute force attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Encryption functions for PHI
const algorithm = 'aes-256-cbc';
const secretKey = process.env.ENCRYPTION_KEY || 'default-key-change-in-production';
const iv = crypto.randomBytes(16);

function encrypt(text) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(text) {
  const parts = text.split(':');
  const iv = Buffer.from(parts.shift(), 'hex');
  const encrypted = Buffer.from(parts.join(':'), 'hex');
  const decipher = crypto.createDecipheriv(algorithm, Buffer.from(secretKey), iv);
  let decrypted = decipher.update(encrypted);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

// Sample patient database (in production, use a real database)
const patients = [
  {
    id: 1,
    name: encrypt('John Doe'),
    age: 45,
    condition: encrypt('Hypertension'),
    ssn: encrypt('***-**-****'),
    admissionDate: '2024-01-15'
  },
  {
    id: 2,
    name: encrypt('Jane Smith'),
    age: 32,
    condition: encrypt('Diabetes Type 2'),
    ssn: encrypt('***-**-****'),
    admissionDate: '2024-02-20'
  }
];

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Get all patients (with encrypted data)
app.get('/api/patients', (req, res) => {
  res.json({
    count: patients.length,
    data: patients.map(p => ({
      id: p.id,
      name: '***ENCRYPTED***',
      age: p.age,
      condition: '***ENCRYPTED***',
      admissionDate: p.admissionDate
    }))
  });
});

// Get patient by ID (with decryption for authorized access)
app.get('/api/patients/:id', (req, res) => {
  const patient = patients.find(p => p.id === parseInt(req.params.id));
  if (!patient) {
    return res.status(404).json({ error: 'Patient not found' });
  }
  
  // In production, verify authorization before decrypting
  res.json({
    id: patient.id,
    name: decrypt(patient.name),
    age: patient.age,
    condition: decrypt(patient.condition),
    ssn: decrypt(patient.ssn),
    admissionDate: patient.admissionDate
  });
});

// Add new patient (with encryption)
app.post('/api/patients', (req, res) => {
  const { name, age, condition, ssn } = req.body;
  
  if (!name || !age || !condition) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  const newPatient = {
    id: patients.length + 1,
    name: encrypt(name),
    age,
    condition: encrypt(condition),
    ssn: encrypt(ssn || '***-**-****'),
    admissionDate: new Date().toISOString().split('T')[0]
  };
  
  patients.push(newPatient);
  res.status(201).json({ message: 'Patient added successfully', id: newPatient.id });
});

// Metrics endpoint for Prometheus
app.get('/metrics', (req, res) => {
  res.json({
    patients_total: patients.length,
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`Smart Healthcare System running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`API: http://localhost:${PORT}/api/patients`);
});
