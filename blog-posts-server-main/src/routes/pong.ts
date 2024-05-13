import { Router } from "express";
import { getPong } from "../controllers/pong";

const pingController = Router();

// /api/ping
pingController.get("/", (req, res) => {
  return getPong(req, res);
});

export default pingController;
