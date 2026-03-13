const request = require("supertest");
const app = require("../server");
const mongoose = require("mongoose");

let noteId;

describe("Notes API", () => {

  // GET ALL NOTES
  it("GET /notes should return notes", async () => {
    const res = await request(app).get("/notes");
    expect(res.statusCode).toBe(200);
  });

  // CREATE NOTE
  it("POST /notes should create a note", async () => {
    const res = await request(app)
      .post("/notes")
      .send({
        title: "Test Note",
        content: "This is a test note"
      });

    expect(res.statusCode).toBe(201);
    noteId = res.body.data._id;
  });

  // GET NOTE BY ID
  it("GET /notes/:id should return a note", async () => {
    const res = await request(app).get(`/notes/${noteId}`);

    expect(res.statusCode).toBe(200);
  });

  // DELETE NOTE
  it("DELETE /notes/:id should delete a note", async () => {
    const res = await request(app).delete(`/notes/${noteId}`);

    expect(res.statusCode).toBe(200);
  });

});

afterAll(async () => {
  await mongoose.connection.close();
});