import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { makeCsv, makeKml } from "./app-core.mjs";

const here = dirname(fileURLToPath(import.meta.url));
await Promise.all([
  writeFile(join(here, "istanbul-family-trip-places.csv"), `\uFEFF${makeCsv()}\n`, "utf8"),
  writeFile(join(here, "istanbul-family-trip-places.kml"), `${makeKml()}\n`, "utf8")
]);
console.log("Generated Istanbul CSV and KML exports.");
