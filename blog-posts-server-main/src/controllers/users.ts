import { Request, Response } from "express";
import {
  authenticateUser,
  getUserData,
  registerUser,
  updateUserProfile,
} from "../modules/users";
import { Hasher } from "../libs/hash/password";
import { create } from "../libs/file-system/files";
import { createUniqueID } from "../libs/uuid/filesystem";
import { UserRepository } from "../repositories/users";
import { StatusCodes } from "http-status-codes";
import { createToken, verifyToken } from "../libs/token/token";
import { AuthenticatedBody } from "../middlewares/authentification";
import { Post } from "../modules/posts";
import { PostRepository } from "../repositories/posts";

export type CreateUserDTO = {
  email: string;
  username: string;
  password: string;
};

// /api/users/register
export async function signupUser(
  req: Request<{}, {}, CreateUserDTO>,
  res: Response
) {
  const { email, username, password } = req.body;

  const { success, data } = await registerUser({
    credentials: { email, username, password },
    hasher: Hasher,
    repository: UserRepository,
  });

  if (!success) {
    return res.status(StatusCodes.FORBIDDEN).json({
      success: false,
      data: { error: "Invalid credentials.", errors: [] },
    });
  }

  return res.json({ success, data });
}

export type LoginUserDTO = {
  email: string;
  password: string;
};

// /api/users/login
export async function loginUser(
  req: Request<{}, {}, LoginUserDTO>,
  res: Response
) {
  const { email, password } = req.body;
  const userAuthenticated = await authenticateUser({
    credentials: { email, password },
    hasher: Hasher,
    repository: UserRepository,
  });

  if (
    !userAuthenticated.success ||
    !userAuthenticated.data.user?.id
  ) {
    return res.status(StatusCodes.FORBIDDEN).json({
      success: false,
      data: { error: "Invalid creadentials", errors: [] },
    });
  }
  const token = createToken({ id: userAuthenticated.data.user.id });
  console.log(token);

  return res.json({
    ...userAuthenticated,
    data: { ...userAuthenticated.data, access_token: token },
  });
}

// /GET api/users/me
export async function getUserFromToken(
  req: Request<{}, {}, AuthenticatedBody>,
  res: Response
) {
  const tokenHeader = req.headers.authorization;

  const { data } = await getUserData({
    id: req.body.decodedToken.id,
    repository: UserRepository,
  });

  return res.json({
    success: true,
    data: {
      user: data.user,
      access_token: tokenHeader?.split(" ")[1],
    },
  });
}

// PATCH /api/users/me
export async function updateUser(
  req: Request<
    {},
    {},
    AuthenticatedBody & { avatarUrl?: string; username?: string }
  >,
  res: Response
) {
  const id = req.body.decodedToken.id;

  const { avatarUrl, username } = req.body;
  const updatedUser = await updateUserProfile({
    id,
    repository: UserRepository,
    data: { avatarUrl, username },
  });
  res.json({ success: true, data: { user: updatedUser } });
}

// /api/users/:id/posts
export async function getUserPosts(
  req: Request<{ id: string }, {}, {}>,
  res: Response
) {
  const id = req.params.id;

  const posts = await Post.getAllPostsByUserID({
    id,
    repository: PostRepository,
  });

  return res.json({ success: true, data: { posts } });
}

// /api/users/me/posts
export async function getMePosts(
  req: Request<{}, {}, AuthenticatedBody>,
  res: Response
) {
  const id = req.body.decodedToken.id;

  const posts = await Post.getAllPostsByUserID({
    id,
    repository: PostRepository,
  });

  return res.json({ success: true, data: { posts } });
}
