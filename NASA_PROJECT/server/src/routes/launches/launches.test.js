const request = require("supertest");
const app = require("../../app");
const { mongoConnect,mongoDisconnect } = require("../../services/db.mongo");

describe("Launches API", () => {

  beforeAll(async()=>{
    await mongoConnect()
  })

  afterAll(async()=>{
    await mongoDisconnect()
  })

  describe("Test GET/launches", () => {
    test("should respond with 200", async () => {
      const response = await request(app)
        .get("/launches")
        .expect("Content-Type", /json/)
        .expect(200);
    });
  });

  describe("Test POST/launches", () => {
    const completeLaunchData = {
      mission: "ISROPLSV",
      rocket: "SSLV",
      destination: "Kepler-62 f",
      launchDate: "27 July, 2040",
    };

    const dataWithoutDate = {
      mission: "ISROPLSV",
      rocket: "SSLV",
      destination: "Kepler-62 f",
    };

    const dataWithInvalidDate = {
      mission: "ISROPLSV",
      rocket: "SSLV",
      destination: "Kepler-62 f",
      launchDate: "Invalid Date",
    };

    test("should respond with 201 created", async () => {
      const response = await request(app)
        .post("/launches")
        .send(completeLaunchData)
        .expect("Content-Type", /json/)
        .expect(201);

      const requestDate = new Date(completeLaunchData.launchDate).valueOf();
      const responseDate = new Date(response.body.launchDate).valueOf();

      expect(responseDate).toBe(requestDate);
      expect(response.body).toMatchObject(dataWithoutDate);
    });
    test("should catch missing required properties", async () => {
      const response = await request(app)
        .post("/launches")
        .send(dataWithoutDate)
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body).toStrictEqual({
        error: "missing launch mission property",
      });
    });

    test("should catch invalid dates", async () => {
      const response = await request(app)
        .post("/launches")
        .send(dataWithInvalidDate)
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body).toStrictEqual({
        error: "Invalid launch date",
      });
    });
  });
});
