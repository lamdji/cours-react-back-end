import { CreateUserDTO } from "../controllers/users";
import {
  create,
  findInCollection,
  read,
  readAllFiles,
} from "../libs/file-system/files";
import { createUniqueID } from "../libs/uuid/filesystem";
import { Post } from "../modules/posts";
import { User, UserDTO } from "../modules/users";

export const PostRepository = {
  create: async (post: {
    userID: string;
    title: string;
    content: string;
    description?: string;
    imageUrl?: string;
    createdAt: string;
  }) => {
    const uniqueID = createUniqueID();

    const createdFile = await create("posts", uniqueID, {
      ...post,
      id: uniqueID,
    });

    if (!createdFile.success) return null;
    return { ...createdFile.data };
  },

  findByID: async (id: string): Promise<Post | null> => {
    const foundPost = await read("posts", id);

    return foundPost.data as Post;
  },
  findAll: async (options?: {
    where?: Record<string, any>;
    include?: Record<string, any>;
  }): Promise<Post[] | null> => {
    const foundPosts = await readAllFiles<Post>("posts");

    if (!foundPosts.success) {
      return null;
    }

    if (!options) {
      return foundPosts.data;
    }

    const posts: (Post & { user?: UserDTO })[] = [];

    await Promise.all(
      foundPosts.data.map(async (post) => {
        let postToPush: (Post & { user?: UserDTO }) | null = post;
        if (options?.where) {
          for (const key in options.where) {
            if (options.where[key] !== post[key as keyof Post]) {
              postToPush = null;
            }
          }
        }

        if (postToPush && options.include && options.include.user) {
          const { id, email, username, avatarUrl } = (
            await read("users", post.userID)
          ).data;

          postToPush.user = { id, email, username, avatarUrl };
        }

        if (postToPush) posts.push(postToPush);
      })
    );

    return posts;
  },
};
