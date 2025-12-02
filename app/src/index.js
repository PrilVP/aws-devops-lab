import express from "express";
import { initDb } from "./db.js";
import { createRouter } from "./routes.js";

const app = express();
const PORT = process.env.APP_PORT || 8080;

async function start() {
  try {
    console.log("Initializing DB...");
    await initDb();

    app.use("/", createRouter());

    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start app:", err);
    process.exit(1);
  }
}

start();
