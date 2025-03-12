const fs = require('fs');
const path = require('path');
const eventsFilePath = path.join(__dirname, '../data/events.json');

// Function to read events from events.json
const readEvents = () => {
  const events = fs.readFileSync(eventsFilePath);
  return JSON.parse(events);
};

// Function to save events to events.json
const saveEvents = (events) => {
  fs.writeFileSync(eventsFilePath, JSON.stringify(events, null, 2));
};

// Create Event
const createEvent = (userId, name, description, date, time, category, reminderTime) => {
  const events = readEvents();
  const newEvent = {
    id: events.length + 1,
    userId,
    name,
    description,
    date,
    time,
    category,
    reminderTime
  };
  events.push(newEvent);
  saveEvents(events);
  return newEvent;
};

// Get Events
const getEvents = (userId, filter) => {
  const events = readEvents();
  return events.filter(event => event.userId === userId && (filter ? event.category === filter : true));
};

module.exports = { createEvent, getEvents };
