import dotenv from "dotenv";
import { readFile, writeFile } from 'fs/promises';
dotenv.config();
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
export const openai = new OpenAIApi(configuration);

const input = {
  model: "gpt-3.5-turbo",
  "messages": [
    { "role": "system", "content": `You are a helpful assistant formats dates from natural language.` },

    {
      "role": "user", "content": `Format the following dates string input as DD-MM-YYYY. Return the results in a markdown table with spaces so it is nicely readable.` },
    { "role": "user", "content": `When the inputted month and day are ambiguous, provide both options. For example 02/03/1999 could be 02-03-1999 or 03-02-1999. If there are any clarifications, provide them in a paragraph at the bottom under the table.` },
    { "role": "user", "content": `These dates may be absolute or relative. The current date of ${new Date()} should be used for relative times that do not provide context. ` },
    { "role": "user", "content": `
    jan 1 1999
    the first of july nineteen ninety nine
    02/03/2021
    03/02/2021
    March 2 2022
    feb 1 1922
    two years ago
    yesterday
    2.5 days ago
    2 days from now
    31/12/99
    12/31/99
    a fortnight ago
    2/12/88
    18/5/88
    6 years in the future from Jan 2 2021
    nine months after the blue jays won the world series for the second time
    ` },
  ]
}

const completion = await openai.createChatCompletion(input);

writeFile(`completions/date-format-${completion.data.id}.json`, JSON.stringify({ input, output: completion.data }, null, 2));
console.dir(completion.data, { depth: null });
