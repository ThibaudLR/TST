import {fileURLToPath} from "url";
import path from "path";
import {getLlama, LlamaChatSession} from "node-llama-cpp";
import fs from "fs/promises";
import { selector_model } from "./templates/javascript_playwright.js";


var session;

export async function initAI(specificModel)
{

    console.log("Initiating the AI to respond correctly");
    const __dirname = path.dirname(fileURLToPath(import.meta.url));

    const llama = await getLlama();
    const model = await llama.loadModel({
        //gpuLayers:30,
        modelPath: path.join(__dirname, "models", "Llama-3_2-3B-Q6.gguf"),
        defaultContextFlashAttention: true,
        defaultContextSwaFullCache: true
    });
    const context = await model.createContext();

    session = new LlamaChatSession({
        contextSequence: context.getSequence(),
        systemPrompt:`You are a test automation engineer.
    When responding :
    - Only send the answer with no explanation
    - Use the language asked
    ${specificModel}`
    });

    console.log("Initialization finished, let's get to business");
}

async function dispose()
{
    session.context.dispose();
    session.dispose();
}

export async function ask(data)
{
    await initAI(selector_model);
    const initialChatHistory = session.getChatHistory();
    var response = '';
    try{
        console.log("ask AI to find selectors");
        var question = `Give every selectors for tags <a> in this DOM :
        ${data}`;

        response = await session.prompt(question,{
            temperature: 0.2
        });

        console.log("AI responded, trying to verify if it answered correctly");
        
        let isOutputOK = verifyOutput(response);

        if(!isOutputOK)
        {
            console.log("Retry to execute model and find a correct answer");
            var retry = `Retry using this as template : ${selector_model}`;

            response = await session.prompt(retry, {
                temperature:0.2
            });
            
        }

        console.log("AI finished with this, going next");

        response.replaceAll('```', '');
        response.replace(/^javascript$/, '');
    }catch(e)
    {
        console.error("Something went wrong when asking AI : " + e)
    }finally
    {
        session.setChatHistory(initialChatHistory);
        dispose();
        return response;
    }
}

async function verifyOutput(response)
{
    if(response.match(/^const .* = '.*';*/gm) > 1)
    {
        console.log("Output OK, going next");
        return true;
    }
    else
    {
        console.log("Output was missmatch, retrying");
        return false;
    }
}


// export async function importChatHistory()
// {
//     const chatHistory = JSON.parse(await fs.readFile("chatHistory.json", "utf8"));
//     session.setChatHistory(chatHistory);
// }