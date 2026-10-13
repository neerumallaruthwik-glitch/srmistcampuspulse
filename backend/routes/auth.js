const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../data/db');

const JWT_SECRET = process.env.JWT_SECRET || 'campuspulse_super_secret_jwt_key_2026';

// Helper to sign token
function createToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// GET /api/auth/users (for demo profile switchers)
router.get('/users', (req, res) => {
  const users = db.getUsers().map(u => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    title: u.title,
    club: u.club,
    department: u.department,
    avatar: u.avatar
  }));
  res.json({ success: true, users });
});

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required' });
  }

  const user = db.getUserByEmail(email);
  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid credentials. User not found.' });
  }

  // Check password (in demo environment, allows predefined passwords or accepts matching)
  if (password && user.passwordHash && password !== user.passwordHash && password !== 'password123') {
    return res.status(401).json({ success: false, message: 'Incorrect password.' });
  }

  const token = createToken(user);
  res.json({
    success: true,
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      rollNumber: user.rollNumber,
      avatar: user.avatar,
      club: user.club,
      title: user.title,
      interests: user.interests || []
    }
  });
});

// POST /api/auth/quick-switch
router.post('/quick-switch', (req, res) => {
  const { userId } = req.body;
  const user = db.getUserById(userId);
  if (!user) {
    return res.status(404).json({ success: false, message: 'Demo user not found' });
  }

  const token = createToken(user);
  res.json({
    success: true,
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      rollNumber: user.rollNumber,
      avatar: user.avatar,
      club: user.club,
      title: user.title,
      interests: user.interests || []
    }
  });
});

// POST /api/auth/register
router.post('/register', (req, res) => {
  const { name, email, password, role, department, rollNumber, club, interests } = req.body;

  if (!name || !email || !role) {
    return res.status(400).json({ success: false, message: 'Name, email, and role are required.' });
  }

  const existing = db.getUserByEmail(email);
  if (existing) {
    return res.status(400).json({ success: false, message: 'Account with this email already exists.' });
  }

  const newUser = {
    id: `usr_${Date.now()}`,
    name,
    email,
    passwordHash: password || 'student123',
    role: role || 'student',
    department: department || 'General Engineering',
    rollNumber: rollNumber || `STD-${Math.floor(1000 + Math.random() * 9000)}`,
    club: club || (role === 'organizer' ? 'Campus Innovation Society' : ''),
    title: role === 'organizer' ? 'Event Coordinator' : (role === 'admin' ? 'Campus Administrator' : 'Student'),
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
    interests: interests || ['Tech & Coding', 'Workshops & Seminars']
  };

  db.createUser(newUser);
  const token = createToken(newUser);

  res.status(201).json({
    success: true,
    token,
    user: newUser
  });
});

// GET /api/auth/me
router.get('/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Missing token' });
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = db.getUserById(decoded.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, user });
  } catch (err) {
    res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
});

module.exports = router;
