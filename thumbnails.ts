// dotenv
import { config } from "dotenv";
config();
import { createReadStream } from 'fs';
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
const response = await openai.createImageEdit(
  createReadStream('./fullstack-shack-square.png'),
  createReadStream('./fullstack-shack-square.png'),
  "A woman in a red shirt",
  2,
  "1024x1024"
);

console.dir(response.data);
debugger;
