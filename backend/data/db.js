const fs = require('fs');
const path = require('path');
const initialData = require('./initialData');

const DB_FILE = path.join(__dirname, 'campuspulse_db.json');

class Database {
  constructor() {
    this.data = null;
    this.init();
  }

  init() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(raw);
        // Ensure all collections exist
        if (!this.data.users) this.data.users = initialData.users;
        if (!this.data.clubs) this.data.clubs = initialData.clubs;
        if (!this.data.events) this.data.events = initialData.events;
        if (!this.data.venues) this.data.venues = initialData.venues;
        if (!this.data.registrations) this.data.registrations = initialData.registrations;
        if (!this.data.certificates) this.data.certificates = initialData.certificates;
        if (!this.data.notifications) this.data.notifications = initialData.notifications;
        if (!this.data.auditLogs) this.data.auditLogs = initialData.auditLogs;
      } else {
        this.data = JSON.parse(JSON.stringify(initialData));
        this.save();
      }
    } catch (err) {
      console.error('Error initializing database, falling back to defaults:', err);
      this.data = JSON.parse(JSON.stringify(initialData));
      this.save();
    }
  }

  save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write database file:', err);
    }
  }

  reset() {
    this.data = JSON.parse(JSON.stringify(initialData));
    this.save();
    return this.data;
  }

  // Users
  getUsers() { return this.data.users; }
  getUserById(id) { return this.data.users.find(u => u.id === id); }
  getUserByEmail(email) { return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase()); }
  createUser(user) {
    this.data.users.push(user);
    this.save();
    return user;
  }

  // Clubs
  getClubs() { return this.data.clubs || []; }
  getClubById(id) { return (this.data.clubs || []).find(c => c.id === id); }

  // Venues
  getVenues() { return this.data.venues; }
  getVenueById(id) { return this.data.venues.find(v => v.id === id); }

  // Events
  getEvents() { return this.data.events; }
  getEventById(id) { return this.data.events.find(e => e.id === id); }
  createEvent(event) {
    this.data.events.unshift(event);
    this.save();
    return event;
  }
  updateEvent(id, updates) {
    const idx = this.data.events.findIndex(e => e.id === id);
    if (idx === -1) return null;
    this.data.events[idx] = { ...this.data.events[idx], ...updates, updatedAt: new Date().toISOString() };
    this.save();
    return this.data.events[idx];
  }
  deleteEvent(id) {
    const idx = this.data.events.findIndex(e => e.id === id);
    if (idx === -1) return false;
    this.data.events.splice(idx, 1);
    this.save();
    return true;
  }

  // Registrations
  getRegistrations() { return this.data.registrations; }
  getRegistrationById(id) { return this.data.registrations.find(r => r.id === id); }
  getRegistrationByToken(token) { return this.data.registrations.find(r => r.qrCodeToken === token); }
  getRegistrationsByUser(userId) { return this.data.registrations.filter(r => r.userId === userId); }
  getRegistrationsByEvent(eventId) { return this.data.registrations.filter(r => r.eventId === eventId); }
  createRegistration(reg) {
    this.data.registrations.unshift(reg);
    // Increment event registration count
    const evt = this.getEventById(reg.eventId);
    if (evt) {
      evt.registeredCount = (evt.registeredCount || 0) + 1;
    }
    this.save();
    return reg;
  }
  updateRegistration(id, updates) {
    const idx = this.data.registrations.findIndex(r => r.id === id);
    if (idx === -1) return null;
    this.data.registrations[idx] = { ...this.data.registrations[idx], ...updates };
    this.save();
    return this.data.registrations[idx];
  }

  // Certificates
  getCertificates() { return this.data.certificates || []; }
  getCertificatesByUser(userId) { return (this.data.certificates || []).filter(c => c.userId === userId); }
  getCertificateById(id) { return (this.data.certificates || []).find(c => c.id === id); }
  addCertificate(cert) {
    if (!this.data.certificates) this.data.certificates = [];
    this.data.certificates.unshift(cert);
    this.save();
    return cert;
  }

  // Notifications
  getNotificationsByUser(userId) {
    return (this.data.notifications || []).filter(n => n.recipientId === userId);
  }
  addNotification(notif) {
    if (!this.data.notifications) this.data.notifications = [];
    const newNotif = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date().toISOString(),
      read: false,
      ...notif
    };
    this.data.notifications.unshift(newNotif);
    this.save();
    return newNotif;
  }
  markNotificationRead(id) {
    const notif = (this.data.notifications || []).find(n => n.id === id);
    if (notif) {
      notif.read = true;
      this.save();
    }
    return notif;
  }
  markAllNotificationsRead(userId) {
    (this.data.notifications || []).forEach(n => {
      if (n.recipientId === userId) n.read = true;
    });
    this.save();
    return true;
  }

  // Audit Logs
  getAuditLogs() { return this.data.auditLogs; }
  addAuditLog(log) {
    this.data.auditLogs.unshift({
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString(),
      ...log
    });
    this.save();
  }
}

const db = new Database();
// Force reload with fresh seed data on startup
db.reset();
module.exports = db;
