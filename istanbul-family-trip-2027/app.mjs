import * as data from "./trip-data.mjs";
import * as core from "./app-core.mjs";
import { bootTripApp } from "./trip-app.mjs";
import { initAssistant } from "./assistant-ui.mjs";

bootTripApp({ data, core, initAssistant });
