import "server-only";
import { randomBytes } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

// Uploaded images live outside the build in UPLOAD_DIR (default ./uploads)
// and are served by src/app/uploads/[file]/route.ts. SVG is refused because
// it can carry scripts.

const MAX_BYTES = 2 * 1024 * 1024;
const TYPES: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
};
export const CONTENT_TYPES: Record<string, string> = Object.fromEntries(
  Object.entries(TYPES).map(([type, ext]) => [ext, type]),
);
export const FILE_NAME = /^[a-z0-9-]+\.(png|jpg|webp|gif)$/;

function uploadDir() {
  return process.env.UPLOAD_DIR ?? path.join(/* turbopackIgnore: true */ process.cwd(), "uploads");
}

export class UploadError extends Error {}

export async function saveImage(file: File, prefix: string) {
  const ext = TYPES[file.type];
  if (!ext) throw new UploadError("Logo must be a PNG, JPG, WebP or GIF image.");
  if (file.size > MAX_BYTES) throw new UploadError("Logo must be 2 MB or smaller.");
  const safePrefix = prefix.replace(/[^a-z0-9-]/g, "").slice(0, 40) || "image";
  const name = `${safePrefix}-${randomBytes(4).toString("hex")}.${ext}`;
  await mkdir(uploadDir(), { recursive: true });
  await writeFile(path.join(uploadDir(), name), Buffer.from(await file.arrayBuffer()));
  return `/uploads/${name}`;
}

export async function readImage(name: string) {
  if (!FILE_NAME.test(name)) return null;
  try {
    return await readFile(path.join(uploadDir(), name));
  } catch {
    return null;
  }
}
