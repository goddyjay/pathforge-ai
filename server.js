import "dotenv/config";
import app from "./src/app.js";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`PathForge AI server running on http://localhost:${PORT}`);
});
