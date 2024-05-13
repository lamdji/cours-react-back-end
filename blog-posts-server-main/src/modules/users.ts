import { StatusCodes } from "http-status-codes";
import { CreateUserDTO } from "../controllers/users";

export type IRegisterUser = {
  credentials: {
    email: string;
    username: string;
    password: string;
  };
  hasher: {
    hash: (password: string) => Promise<string>;
  };
  repository: {
    create: (user: CreateUserDTO) => Promise<User | null>;
    getByEmail: (email: string) => Promise<User | null>;
  };
};

export async function registerUser({
  credentials,
  hasher,
  repository,
}: IRegisterUser) {
  const existingUser = await repository.getByEmail(credentials.email);

  if (existingUser)
    return {
      success: false,
      data: {
        errors: [
          {
            message: "User already Exists",
          },
        ],
      },
    };

  const hashedPassword = await hasher.hash(credentials.password);

  const createdUser = await repository.create({
    ...credentials,
    password: hashedPassword,
  });

  if (!createdUser)
    return {
      success: false,
      data: { errors: [{ message: "Something went wrong..." }] },
    };

  return {
    success: true,
    data: {
      user: {
        id: createdUser.id,
        email: createdUser.email,
        username: createdUser.username,
      },
    },
  };
}

export type ILoginUser = {
  credentials: {
    email: string;
    password: string;
  };
  hasher: {
    verify: (
      clearPassword: string,
      hashedPassword: string
    ) => Promise<boolean>;
  };
  repository: {
    getByEmail: (email: string) => Promise<User | null>;
  };
};

export async function authenticateUser({
  credentials,
  hasher,
  repository,
}: ILoginUser) {
  const user = await repository.getByEmail(credentials.email);

  if (!user) {
    return {
      success: false,
      data: { errors: [{ message: "User not found" }] },
    };
  }

  const passwordVerified = await hasher.verify(
    credentials.password,
    user.password
  );

  if (!passwordVerified) {
    return {
      success: false,
      data: { errors: [{ message: "Invalid credentials" }] },
    };
  }
  const { email, username, id, avatarUrl } = user;
  return {
    success: true,
    data: { user: { email, username, id, avatarUrl } },
  };
}

export type IGetUserData = {
  id: string;
  repository: {
    getByID: (id: string) => Promise<User | null>;
  };
};

export async function getUserData({ id, repository }: IGetUserData) {
  const user = await repository.getByID(id);

  if (!user) {
    return {
      success: false,
      data: {
        error: "Invalid credential",
      },
    };
  }
  const { email, username, id: userID, avatarUrl } = user;
  return {
    success: true,
    data: { user: { email, username, id: userID, avatarUrl } },
  };
}

export type IUserRepository = {
  getByID: (id: string) => Promise<User | null>;
  save: (user: User) => Promise<User | null>;
};

export async function updateUserProfile({
  id,
  data,
  repository,
}: {
  id: string;
  data: { username?: string; avatarUrl?: string };
  repository: IUserRepository;
}) {
  const user = await repository.getByID(id);
  if (!user) {
    return null;
  }
  const { avatarUrl, username } = data;

  if (!username && !avatarUrl) return user;

  if (username === user.username && avatarUrl === user.avatarUrl)
    return user;

  const updatedUser = await repository.save({
    ...user,
    avatarUrl,
    username: username || user.username,
  });

  return updatedUser;
}

export async function logoutUser() {
  return { data: "Deconnexion a implementé" };
}

export type User = {
  id: string;
  email: string;
  username: string;
  avatarUrl?: string;
  password: string;
};

export type UserDTO = {
  id: string;
  email: string;
  username: string;
  avatarUrl?: string;
};
