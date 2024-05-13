import { Request, Response } from "express";
import { Post } from "../modules/posts";
import { AuthenticatedBody } from "../middlewares/authentification";
import { StatusCodes } from "http-status-codes";
import { PostRepository } from "../repositories/posts";
import { getUserData } from "../modules/users";
import { UserRepository } from "../repositories/users";

export type CreatePostDTO = {
  title: string;
  content: string;
  description?: string;
  imageUrl?: string;
};

// /api/posts/create
export async function createPost(
  req: Request<{}, {}, CreatePostDTO & AuthenticatedBody>,
  res: Response
) {
  const { title, content, description, imageUrl, decodedToken } =
    req.body;

  const date = new Date().toISOString();

  const { success, data } = await Post.create({
    data: {
      title,
      content,
      description,
      imageUrl,
      userID: decodedToken.id,
      createdAt: date,
    },
    repository: PostRepository,
  });
  if (!success) {
    return res.status(StatusCodes.FORBIDDEN).json({
      success: false,
      data: { error: "Something went wrong.", errors: [] },
    });
  }

  return res.json({ success, data });
}

// /api/posts
export async function getAllPosts(req: Request, res: Response) {
  const posts = await Post.getAll({ repository: PostRepository });

  return res.json({
    success: true,
    data: {
      posts: posts.data,
    },
  });
}

// /api/post/:id
export async function getPostByID(
  req: Request<{ id: string }>,
  res: Response
) {
  const post = await Post.getByID({
    id: req.params.id,
    repository: PostRepository,
  });

  if (!post || !post.id)
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ sucess: false, data: { error: "Post not found" } });

  const user = await getUserData({
    id: post.userID,
    repository: UserRepository,
  });

  return res.json({
    sucess: true,
    data: { post: { ...post, user: user.data.user } },
  });
}
