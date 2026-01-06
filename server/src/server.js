// App entry point (Express setup)

import app from "./app.js";
import "./config/db.js";

const PORT = 5050;

app.listen(PORT, () => {
  console.log(`SERVER RUNNING ON PORT ${PORT}`);
});
