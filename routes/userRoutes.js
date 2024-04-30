import express from "express";
import authController from "../controllers/authController.js";

const router = express.Router();
const { signup, login } = authController;

router.post('/signup', signup);
router.post('/login', login);


export default router;