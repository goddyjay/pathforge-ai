import express from "express";
import cors from "cors";
import helmet from "helmet";
import recommendationsRoutes from "./routes/recommendations.js";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "PathForge AI API" });
});

// Single entry point — dispatches internally on req.body.type.
app.use("/api/recommendations", recommendationsRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Internal server error" });
});

export default app;
