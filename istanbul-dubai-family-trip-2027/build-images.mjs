import { buildImages } from "../stopover-family-trip-2027/build-images.mjs";
import { imageRequests, spec } from "./trip-spec.mjs";

await buildImages({ here: new URL(".", import.meta.url).pathname, checkedAt: spec.checkedAt, requests: imageRequests });
