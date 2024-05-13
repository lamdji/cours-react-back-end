import { CreateUserDTO } from "../controllers/users";
import {
  create,
  findInCollection,
  read,
} from "../libs/file-system/files";
import { createUniqueID } from "../libs/uuid/filesystem";
import { User } from "../modules/users";

export const UserRepository = {
  create: async (user: CreateUserDTO) => {
    const uniqueID = createUniqueID();

    const createdFile = await create("users", uniqueID, {
      ...user,
      id: uniqueID,
    });

    if (!createdFile.success) return null;
    return { ...createdFile.data };
  },
  save: async (user: User) => {
    const createdFile = await create("users", user.id, {
      ...user,
    });

    if (!createdFile.success) return null;
    return { ...createdFile.data };
  },
  getByEmail: async (email: string): Promise<User | null> => {
    const foundUser = await findInCollection<User>(
      "users",
      async (id) => {
        const file = await read("users", id);
        if (!file.success) return null;
        if (file.data.email === email) return file.data;
        return null;
      }
    );

    return foundUser;
  },
  getByID: async (id: string): Promise<User | null> => {
    const foundUser = await read("users", id);
    console.log("foundUser", foundUser);

    return foundUser.data;
  },
};
