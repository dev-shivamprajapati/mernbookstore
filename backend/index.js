import express from "express";
import mongoose from "mongoose";
// Config
import { config } from "./config.js";
// Models
import { BookModel } from "./models/bookModel.js";

const { PORT, MONGODB_URL } = config;
const app = express();

// Middleware for parsing request body
app.use(express.json());

// ROUTES
app.get("/", (request, respone) => {
  console.log({ request });
  return respone.status(200).send("Wlecdasd");
});

// GET ALL BOOKS

app.get("/books", async (request, respone) => {
  try {
    const books = await BookModel.find({});
    return respone.status(200).json({ count: books.length, data: books });
  } catch (err) {
    console.log({ err });
  }
});
// GET A BOOK BY ID
app.get("/books/:id", async (request, respone) => {
  try {
    const {
      params: { id },
    } = request;
    const book = await BookModel.findById({_id: id });
    return respone.status(200).send(book);
  } catch (err) {
    console.log({ err });
  }
});
// ADD A BOOK
app.post("/books", async (req, response) => {
  try {
    const {
      body: { title, author, publishYear },
    } = req;
    if (!title || !author || !publishYear) {
      return response
        .status(400)
        .send("Send all required fields, title, author & publishYear");
    } else {
      const newBook = { title, author, publishYear };
      const book = await BookModel.create(newBook);
      return response.status(200).send(book);
    }
  } catch (err) {
    console.log("Error in adding a book", { err });
  }
});

// MONGO DB
mongoose
  .connect(MONGODB_URL)
  .then(() => {
    console.log("DB connected successfully!");

    // APP
    app.listen(PORT, () => console.log("Serving on port " + PORT));
  })
  .catch((err) => console.log({ err }));
