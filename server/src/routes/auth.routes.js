import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";
import passportStatelessAuth from "../auth/passport-middleware/passportStatelessAuth.js";

const router = Router();

router.get("/local", (req, res) => {
  res.send("auth route working");
});

router.get("/secure", passportStatelessAuth, (req, res) => {
  res.send("You have accessed a protected route!");
});

router.post("/register", AuthController.createUser);

export default router;
