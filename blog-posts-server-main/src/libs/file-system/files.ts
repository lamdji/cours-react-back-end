import fs from "fs";
import path from "path";
import { Post } from "../../modules/posts";

const dataDir = process.cwd() + "/data";
export function getFilePath(collection: string, id: string): string {
  return path.join(dataDir, `${collection}/${id}.json`);
}

export async function create(
  collection: string,
  id: string,
  data: any
): Promise<{ success: boolean; data: any }> {
  const filePath = getFilePath(collection, id);
  if (!fs.existsSync(dataDir + "/" + collection)) {
    fs.mkdirSync(dataDir + "/" + collection);
  }
  try {
    await fs.promises.writeFile(filePath, JSON.stringify(data));
    return {
      success: true,
      data: data,
    };
  } catch (err) {
    return {
      success: false,
      data: err,
    };
  }
}

export async function read(
  collection: string,
  id: string
): Promise<{ success: boolean; data: any }> {
  const filePath = getFilePath(collection, id);
  try {
    const data = await fs.promises.readFile(filePath, "utf-8");
    return { success: true, data: JSON.parse(data) };
  } catch (err) {
    // File not found
    return {
      success: false,
      data: err,
    };
  }
}

export async function readAllFiles<T>(
  collection: string
): Promise<
  { success: true; data: T[] } | { success: false; data: any }
> {
  try {
    const filesName = await fs.promises.readdir(
      path.join(dataDir, collection)
    );

    let files: T[] = [];

    for (const fileName of filesName) {
      const fileID = fileName.split(".")[0]; // Extract user ID from filename

      const file = await read(collection, fileID);
      files = [...files, file.data];
    }

    return { success: true, data: files };
  } catch (err) {
    // File not found
    return {
      success: false,
      data: err,
    };
  }
}

export async function findInCollection<T>(
  collection: string,
  callback: (id: string) => Promise<T | null>
) {
  const files = await fs.promises.readdir(
    path.join(dataDir, collection)
  );

  for (const file of files) {
    const userId = file.split(".")[0]; // Extract user ID from filename
    console.log(userId);

    const found = await callback(userId);
    if (found) {
      return found;
    }
  }

  return null;
}
