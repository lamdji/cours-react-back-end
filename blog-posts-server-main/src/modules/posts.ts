import { CreatePostDTO } from "../controllers/posts";
import { User } from "./users";

export type IUserCreatePost = {
  data: {
    userID: string;
    title: string;
    content: string;
    description?: string;
    imageUrl?: string;
    createdAt: string;
  };
  repository: {
    create: (post: {
      userID: string;
      title: string;
      content: string;
      description?: string;
      imageUrl?: string;
      createdAt: string;
    }) => Promise<Post | null>;
  };
};

export type IGetPostByID = {
  id: string;
  repository: {
    findByID: (id: string) => Promise<Post | null>;
  };
};

export type IRepository = {
  findByID: (id: string) => Promise<Post | null>;
  findAll: (options?: {
    where?: Record<string, any>;
    include?: Record<string, boolean>;
  }) => Promise<Post[] | null>;
};

export const Post = {
  create: async ({ data, repository }: IUserCreatePost) => {
    const createdPost = await repository.create(data);

    return { success: true, data: { post: createdPost } };
  },
  getAll: async ({ repository }: { repository: IRepository }) => {
    const posts = await repository.findAll({
      include: { user: true },
    });

    return {
      success: true,
      data: posts,
    };
  },
  getAllPostsByUserID: async (options: {
    id: string;
    repository: IRepository;
  }) => {
    const { repository, id } = options;
    const posts = await repository.findAll({ where: { userID: id } });

    return posts;
  },
  getByID: async ({ id, repository }: IGetPostByID) => {
    return await repository.findByID(id);
  },
};

export type Post = {
  id: string;
  title: string;
  content: string;
  description?: string;
  imageUrl?: string;
  createdAt: Date;
  userID: string;
};

