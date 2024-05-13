import bcrypt from "bcrypt";
const saltRounds = 10;

export const Hasher = {
  hash: async (plainPassword: string) => {
    return bcrypt.hashSync(plainPassword, saltRounds);
  },
  verify: async (plainPassword: string, hashedPassword: string) => {
    return bcrypt.compareSync(plainPassword, hashedPassword);
  },
};
