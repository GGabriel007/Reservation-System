// App entry point (Express setup)
import 'dotenv/config';
import app from "./app.js";
import "./config/db.js";


const PORT = process.env.PORT || 5050;

app.listen(PORT, () => {
  console.log(`SERVER RUNNING ON PORT ${PORT}`);
});
