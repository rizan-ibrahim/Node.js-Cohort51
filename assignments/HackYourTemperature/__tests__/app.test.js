import request from "supertest";
import app from "../server.js";

describe("POST /weather", () => {
  it("should return a 400 error if cityName is missing", async () => {
    const response = await request.post("/weather").send({});
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "City name is required." });
  });

  it("should return a 404 error if cityName is not found", async () => {
    const response = await request
      .post("/weather")
      .send({ cityName: "invalidCity" });
    expect(response.status).toBe(404);
    expect(response.body.weatherText).toBe("city is not found!");
  });

  it("should return a valid weather response for a real city", async () => {
    const response = await request(app)
      .post("/weather")
      .send({ cityName: "Amsterdam" });
    expect(response.status).toBe(200);
    expect(response.body.weatherText).toContain(
      "The temperature in Amsterdam is"
    );
  });
});
