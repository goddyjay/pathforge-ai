import { Router } from "express";
import { handleRecommendations } from "../controllers/recommendationsController.js";
import { MODULE_TYPES } from "../modules/index.js";

const router = Router();

// Single entrypoint. Dispatches on req.body.type.
router.post("/", handleRecommendations);

// Introspection endpoint — useful for client-side docs / health checks.
router.get("/types", (req, res) => {
  res.json({ success: true, data: { types: MODULE_TYPES } });
});

export default router;
