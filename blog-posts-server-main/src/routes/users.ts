import { Router } from "express";
import {
  getMePosts,
  getUserFromToken,
  getUserPosts,
  loginUser,
  signupUser,
  updateUser,
} from "../controllers/users";
import { userRegistrationSchema } from "../libs/validation/users";
import { verifyAuthToken } from "../middlewares/authentification";
import { validateData } from "../middlewares/data-validation";

const usersController = Router();

// /api/users/register
usersController.post(
  "/register",
  validateData(userRegistrationSchema),
  signupUser
);

// /api/users/login
usersController.post("/login", loginUser);

// /api/users/me
usersController.post("/me", verifyAuthToken, getUserFromToken);

usersController.patch("/me", verifyAuthToken, updateUser);

// /api/users/me/posts
usersController.get("/me/posts", verifyAuthToken, getMePosts);

// /api/users/:id/posts
usersController.get("/:id/posts", getUserPosts);

export default usersController;
