import express from "express";
const router = express.Router();
import { BookModel } from "../models/bookModel.js";

// GET ALL BOOKS

router.get("/", async (request, respone) => {
  try {
    const books = await BookModel.find({});
    return respone.status(200).json({ count: books.length, data: books });
  } catch (err) {
    console.log({ err });
  }
});
// GET A BOOK BY ID
router.get("/:id", async (request, respone) => {
  try {
    const {
      params: { id },
    } = request;
    const book = await BookModel.findById({ _id: id });
    return respone.status(200).send(book);
  } catch (err) {
    console.log({ err });
  }
});
// ADD A BOOK
router.post("", async (req, response) => {
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

// Update a book
router.put("/:id", async (req, res) => {
  try {
    const {
      body: { title, author, publishYear },
      params: { id },
    } = req;
    if (!title || !author || !publishYear) {
      return res
        .status(400)
        .send("Send all required fields, title, author & publishYear");
    } else {
      const result = await BookModel.findByIdAndUpdate(id, req.body);
      if (result) {
        return res
          .status(200)
          .send({ message: "Book by id " + id + " updated successfully." });
      } else {
        return res.status(404).send("Book by id " + id + " found.");
      }
    }
  } catch (error) {
    console.log({ error });
    res.status(500).send("error in update book", { error });
  }
});

// Delete a book

router.delete("/:id", async (req, res) => {
  try {
    const {
      params: { id },
    } = req;

    const result = await BookModel.findByIdAndDelete(id);
    if (result) {
      return res
        .status(200)
        .send({ message: "Book by id " + id + " delete successfully." });
    } else {
      return res.status(404).send("Book by id " + id + " found.");
    }
  } catch (error) {
    console.log({ error });
    res.status(500).send("error in delete book", { error });
  }
});

export default router;
