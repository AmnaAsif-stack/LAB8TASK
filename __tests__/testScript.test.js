const request = require("supertest");
const app = require("./events");

describe("Event Planner API", () => {
    test("Create an event", async () => {
        const response = await request(app)
            .post("/events")
            .send({
                name: "Test Meeting",
                description: "Project discussion",
                date: "2025-03-15",
                time: "15:00",
                category: "Meeting",
                reminderMinutes: 30
            });
        expect(response.statusCode).toBe(201);
        expect(response.body.event).toHaveProperty("name", "Test Meeting");
    });

    test("Get all events", async () => {
        const response = await request(app).get("/events");
        expect(response.statusCode).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
    });

    test("Get events by category", async () => {
        const response = await request(app).get("/events/category/Meeting");
        expect(response.statusCode).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
    });

    test("Get upcoming events", async () => {
        const response = await request(app).get("/events/upcoming");
        expect(response.statusCode).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
    });
});
