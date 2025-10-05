import {selector_model} from "./templates/javascript_playwright.js";
import { exploreUat } from "./getUatPages.js";
import { initAI } from "./askAI.js";

//await importChatHistory();

//Setting up the model to respond with the right templates
//await initAI(selector_model);

await exploreUat('https://books.toscrape.com');


