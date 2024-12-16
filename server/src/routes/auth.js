import express from 'express';
import {loginUser } from "../controllers/authController.js";
import { createUser } from "../controllers/userController.js";

const router = express.Router();

router.post("/", createUser);

router.post("/tokens", loginUser);

export default router;