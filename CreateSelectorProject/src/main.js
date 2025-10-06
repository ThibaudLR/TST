import {selector_model} from "./templates/javascript_playwright.js";
import { exploreUat } from "./getUatPages.js";
import { initAI } from "./askAI.js";
import { exit } from "node:process";

var domain;
var iaModel;

function main()
{
    var indexOfModelFlag = process.argv.indexOf('-m');
    if(indexOfModelFlag > 0)
    {
        iaModel = process.argv[indexOfModelFlag + 1];
    }else
    {
        throw new Error("No model has been given");
    }

    var indexOfDomainFlag = process.argv.indexOf('-w');
    if(indexOfDomainFlag > 0)
    {
        domain = process.argv[indexOfDomainFlag + 1];
    }else
    {
        throw new Error("No website to scrap");
    }
}

main();
await exploreUat(domain, iaModel);



