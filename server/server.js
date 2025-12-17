import app from "./app.js";
import { connectDB } from "./config/db.js";

const PORT = 5050;

connectDB();

app.listen(PORT, () => {
  console.log(`SERVER RUNNING ON PORT ${PORT}`);
});
