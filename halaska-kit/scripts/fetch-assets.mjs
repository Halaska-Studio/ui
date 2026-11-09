// Fetches build assets that are not in the repository (the licensed display
// font) from the project's private Vercel Blob store. Runs on prebuild. A
// local checkout that already has the file skips the download; a build with
// no credentials carries on without the font, and the CSS falls back.
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const ASSETS = [
  { env: "FONT_FK_RASTER_URL", to: "public/fonts/FKRasterRomanCompact-Smooth.woff2" },
];

const token = process.env.BLOB_READ_WRITE_TOKEN;
for (const { env, to } of ASSETS) {
  const out = resolve(to);
  if (existsSync(out)) continue;
  const url = process.env[env];
  if (!url || !token) { console.warn(`fetch-assets: ${to} missing and ${env} or BLOB_READ_WRITE_TOKEN not set; building without it`); continue; }
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) { console.warn(`fetch-assets: ${env} returned ${res.status}; building without ${to}`); continue; }
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, Buffer.from(await res.arrayBuffer()));
  console.log(`fetch-assets: wrote ${to}`);
}
