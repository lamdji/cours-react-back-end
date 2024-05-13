import crypto from "crypto";

export function createUniqueID() {
  const id = crypto.randomUUID();
  return id;
}
