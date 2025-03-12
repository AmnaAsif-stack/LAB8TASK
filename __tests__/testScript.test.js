const fs = require('fs');
const path = require('path');
const { createEvent, getEvents } = require('../src/events');

jest.mock('fs');

describe('Event Planning System', () => {
  beforeEach(() => {
    fs.readFileSync.mockReturnValue(JSON.stringify([])); // Mock empty events file before each test
  });

  test('Create Event', () => {
    const newEvent = createEvent(1, 'Meeting', 'Discuss progress', '2025-03-16', '10:00', 'Meeting', '2025-03-16T09:00:00');
    expect(newEvent).toHaveProperty('id');
    expect(newEvent.name).toBe('Meeting');
  });

  test('Get Events by User', () => {
    const events = getEvents(1);
    expect(events).toBeInstanceOf(Array);
  });
});
