const request = require("supertest");
const fs = require("fs");
const path = require("path");
const cron = require("node-cron");
const app = require("../src/app"); // Adjust the import based on your file structure

jest.mock("fs");
jest.mock("node-cron");

describe("Event API", () => {
  beforeEach(() => {
    fs.readFileSync.mockReturnValue(JSON.stringify([])); // Mock empty events
  });

  test("Create Event - Success", async () => {
    const newEvent = {
      name: "Meeting",
      description: "Discuss progress",
      date: "2025-03-16",
      time: "10:00",
      category: "Work",
      reminderMinutes: 10,
    };
    
    const response = await request(app).post("/events").send(newEvent);
    
    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Event created");
    expect(response.body.event).toHaveProperty("id");
    expect(response.body.event.name).toBe("Meeting");
  });

  test("Create Event - Missing required fields", async () => {
    const newEvent = {
      description: "Discuss progress",
      date: "2025-03-16",
      time: "10:00",
    };
    
    const response = await request(app).post("/events").send(newEvent);
    
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Name, date, and time are required");
  });

  test("Get All Events", async () => {
    const response = await request(app).get("/events");
    
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test("Get Events by Category", async () => {
    const response = await request(app).get("/events/category/Work");
    
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test("Get Upcoming Events", async () => {
    const response = await request(app).get("/events/upcoming");
    
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test("Reminder System", () => {
    const spy = jest.spyOn(cron, "schedule");
    
    const events = [
      { name: "Meeting", date: "2025-03-16", time: "10:00", reminderMinutes: 10 },
    ];
    
    fs.readFileSync.mockReturnValueOnce(JSON.stringify(events));
    const response = request(app).get("/events");
    
    expect(response.status).toBe(200);
    expect(spy).toHaveBeenCalled(); // Check if cron job was scheduled
  });
});
