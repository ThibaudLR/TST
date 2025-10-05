import { launch } from 'puppeteer';
import { ask } from './askAI.js';
import { createPageFile } from './createPages.js';

//Used for clearing duplicates in the list
const merge = (a, b, predicate = (a, b) => a === b) => {
    return [...new Set([...a, ...b])];
}

//Takes a page and retrieve all links to be able to analyse further and retrieve the DOM to create selectors
async function examinePage(target_url){
    var page;
    var browser;
    let data;
    let urls;
    try
    {
        console.log(`Opening the browser for ${target_url} to get the DOM`);
        browser = await launch({headless:true});
        page = await browser.newPage();
        await page.goto(target_url, {waitUntil: 'load'});
        data = await page.content();
        console.log(`Got the content of page ${target_url}`)
        urls = await page.$$eval('a', elements =>{
            return elements.map(e => e.href);
        });

        console.log(`Found ${urls.length} links in the page`);
    }catch(e)
    {
        console.error("Error while getting the page" + e);
    }finally
    {
        await page.close();
        await browser.close();
        return {urls:urls, data:data};
    }

}

async function exploreUat(target_domain)
{
    console.log(`Starting to explore every pages of ${target_domain}. See you soon`);
    var dom;
    let listOfUrls = [];
    await examinePage(target_domain)
    .then((result) => {
        listOfUrls = result.urls;
    });

    listOfUrls = listOfUrls.filter((value, index, array) => {return array.indexOf(value) === index});

    console.log("Starting to explore new horizons");
    for(var i = 0; i < listOfUrls.length; i++)
    {
        
        let newUrls = [];
        await examinePage(listOfUrls[i])
        .then((result) => {
            dom = result.data;
            newUrls = result.urls;
        });

        let selectors = await ask(dom);

        console.log("Creating a new page objects file.")
        await createPageFile(listOfUrls[i], selectors);

        listOfUrls = merge(listOfUrls, newUrls);
        console.log(`After those investigations, we have done ${i+1}/${listOfUrls.length} unique pages`);

        //Allow the GPU to rest a litlle
        await new Promise(s => setTimeout(s, 20000));
    }

    console.log("Work is finally over. See you soon.");
}

export {exploreUat};