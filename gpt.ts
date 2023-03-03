import dotenv from "dotenv";
import { readFile, writeFile } from 'fs/promises';
dotenv.config();
import { Configuration, OpenAIApi } from "openai";
import { summarize } from './summarize.js';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
export const openai = new OpenAIApi(configuration);
const FILE_NAME = `579-warp.txt`;
const transcriptRaw = await readFile(`./transcripts/${FILE_NAME}`, 'utf8');

// split the transcript on blank lines
export type TranscriptBlock = {
  speaker: string;
  time: string;
  lines: string;
}

const transcriptBlocks = transcriptRaw.split(/\n\n/).map(block => {
  const [speakerTime, ...lines] = block.split(/\n/);
  const [speaker, time] = speakerTime.split('  ');
  return {
    speaker,
    time,
    lines: lines.join('\n'),
  }
}).filter(block => block.speaker || block.lines)
  .filter(block => !block.speaker.includes('Announcer'))

const summaries = await Promise.all(transcriptBlocks.map(summarize));

await writeFile(`summaries/${FILE_NAME}.json`, JSON.stringify(summaries, null, 2));

const input = {
  model: "gpt-3.5-turbo",
  "messages": [
    { "role": "system", "content": "You are a helpful assistant that summarizes web development podcasts" },
    { "role": "user", "content": "Syntax is a podcast about web development. Available at https://Syntax.fm" },
    { "role": "user", "content": `Here is a transcript of Episode 578 entitled "Logging":` },
    ...summaries.map((hunk) => ({ "role": "user", "content": `${hunk.time} ${hunk.speaker} \n ${hunk.summary}` })),
    {
      "role": "user", "content": `Provide these three things:
1. A short summary of the entire episode in about two sentences.
1. Summarize the podcast into bullet points with time stamps
1. Produce a list of 5 hashtags that would be relevant to the episode

Here is the podcast transcript:
    ` },
  ]
}

const completion = await openai.createChatCompletion(input);

// // Write the input and output to file
writeFile(`completions/${FILE_NAME}-${completion.data.id}.json`, JSON.stringify({ input, output: completion.data }, null, 2));
console.dir(completion.data, { depth: null });
