import { Request, Response } from "express";
import { sendPong } from "../modules/pong";

export function getPong(req: Request, res: Response) {
  const data = sendPong();
  return res.json(data);
}
