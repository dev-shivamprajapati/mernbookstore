import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/userModel.js";
import { config } from "../config.js";
const router = express.Router();

const { SECRET_KEY } = config;

// GET ALL BOOKS

// router.get("/", async (request, respone) => {
//   try {
//     const books = await UserModel.find({});
//     return respone.status(200).json({ count: books.length, data: books });
//   } catch (err) {
//     console.log({ err });
//   }
// });

// GET A USER BY TOKEN
router.post("", async (request, respone) => {
  try {
    const {
      body: { token },
    } = request;
    const { userId } = jwt.verify(token, SECRET_KEY);

    const user = await UserModel.findById({ _id: userId });

    if (user) return respone.status(200).send(user);
    else respone.status(404).send("User not found");
  } catch (err) {
    console.log({ err });
  }
});

// ADD A USER
router.post("/register", async (req, response) => {
  try {
    const {
      body: { name, email, password },
    } = req;
    if (!name || !email || !password) {
      return response
        .status(400)
        .send("Send all required fields, name, email & password");
    } else {
      const hashedPass = await bcrypt.hash(password, 12);
      const newUser = { name, email, password: hashedPass };
      const user = await UserModel.create(newUser);
      return response.status(200).send(user);
    }
  } catch (err) {
    console.log("Error in adding a user", { err });
  }
});

// LOGIN USER
router.post("/login", async (req, response) => {
  try {
    const {
      body: { email, password },
    } = req;
    if (!email || !password) {
      return response.status(400).send("Send all required  email & password");
    } else {
      const userData = await UserModel.findOne({ email });
      const isPassCorrect = await bcrypt.compare(password, userData?.password);
      if (isPassCorrect) {
        const token = jwt.sign({ userId: userData?.["_id"] }, SECRET_KEY, {
          expiresIn: "24h",
        });

        return response.status(200).send({ status: "Login successful", token });
      } else response.status(401).send("Invalid creds");
    }
  } catch (err) {
    console.log("Error in logging a user", { err });
  }
});

// Update a book
// router.put("/:id", async (req, res) => {
//   try {
//     const {
//       body: { title, author, publishYear },
//       params: { id },
//     } = req;
//     if (!title || !author || !publishYear) {
//       return res
//         .status(400)
//         .send("Send all required fields, title, author & publishYear");
//     } else {
//       const result = await UserModel.findByIdAndUpdate(id, req.body);
//       if (result) {
//         return res
//           .status(200)
//           .send({ message: "Book by id " + id + " updated successfully." });
//       } else {
//         return res.status(404).send("Book by id " + id + " found.");
//       }
//     }
//   } catch (error) {
//     console.log({ error });
//     res.status(500).send("error in update book", { error });
//   }
// });

// // Delete a book

// router.delete("/:id", async (req, res) => {
//   try {
//     const {
//       params: { id },
//     } = req;

//     const result = await UserModel.findByIdAndDelete(id);
//     if (result) {
//       return res
//         .status(200)
//         .send({ message: "Book by id " + id + " delete successfully." });
//     } else {
//       return res.status(404).send("Book by id " + id + " found.");
//     }
//   } catch (error) {
//     console.log({ error });
//     res.status(500).send("error in delete book", { error });
//   }
// });

export default router;
