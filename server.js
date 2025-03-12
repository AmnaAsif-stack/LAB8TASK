const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createEvent, getEvents } = require('./src/events');
const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// User data (for demonstration, should be replaced with proper user management)
const users = [{ id: 1, username: 'user1', password: bcrypt.hashSync('password', 10) }];

// Authenticate User
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);
  if (!user) return res.status(400).send('User not found');
  if (!bcrypt.compareSync(password, user.password)) return res.status(400).send('Invalid password');
  const token = jwt.sign({ id: user.id }, 'secretKey', { expiresIn: '1h' });
  res.json({ token });
});

// Create Event
app.post('/event', (req, res) => {
  const { userId, name, description, date, time, category, reminderTime } = req.body;
  const newEvent = createEvent(userId, name, description, date, time, category, reminderTime);
  res.status(201).json(newEvent);
});

// Get Events
app.get('/events', (req, res) => {
  const { userId, filter } = req.query;
  const events = getEvents(Number(userId), filter);
  res.json(events);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
