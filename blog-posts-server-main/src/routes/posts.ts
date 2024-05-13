import { Router } from "express";
import { verifyAuthToken } from "../middlewares/authentification";
import { validateData } from "../middlewares/data-validation";
import { postCreationSchema } from "../libs/validation/posts";
import {
  createPost,
  getAllPosts,
  getPostByID,
} from "../controllers/posts";

const postsController = Router();

// /api/users/register
postsController.post(
  "/create",
  verifyAuthToken,
  validateData(postCreationSchema),
  createPost
);

// /api/users/register
postsController.get("/", getAllPosts);
postsController.get("/:id", getPostByID);

export default postsController;
