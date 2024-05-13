import jwt from "jsonwebtoken";

const SECRET = process.env.SECRET || "supersecret";
const EXPIRATION_TIME = "3 hours";

export function createToken<T extends {}>(data: T) {
  const token = jwt.sign(data, SECRET, {
    expiresIn: EXPIRATION_TIME,
  });
  return token;
}

export async function verifyToken<T>(token: string): Promise<
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      data: { error: any };
    }
> {
  try {
    const decodedToken = jwt.verify(token, SECRET);
    return { success: true, data: decodedToken as T };
  } catch (error) {
    return {
      success: false,
      data: { error },
    };
  }
}
