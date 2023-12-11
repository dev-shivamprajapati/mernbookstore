import express from "express";
import mongoose from "mongoose";
import cors from "cors";
// Config
import { config } from "./config.js";

// Routes
import BookRoutes from "./routes/booksRoutes.js";

const { PORT, MONGODB_URL } = config;
const app = express();

// Middleware for Handling CORS
app.use(cors());
// allow custom origins
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);

// Middleware for parsing request body
app.use(express.json());

// ROUTES
app.get("/", (request, respone) => {
  console.log({ request });
  return respone.status(200).send("Wlecdasd");
});
// Middleware to redirect books APIs into books routes
app.use("/books", BookRoutes);

// MONGO DB
mongoose
  .connect(MONGODB_URL)
  .then(() => {
    console.log("DB connected successfully!");

    // APP
    app.listen(PORT, () => console.log("Serving on port " + PORT));
  })
  .catch((err) => console.log({ err }));
