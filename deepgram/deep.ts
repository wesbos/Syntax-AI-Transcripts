import deep from '@deepgram/sdk';
const { Deepgram } = deep;
import { config } from 'dotenv';
import { readFile, writeFile } from 'fs/promises';
config();

// The API key we created in step 3
const deepgramApiKey = process.env.DEEPGRAM_SECRET;
if(!deepgramApiKey) {
  console.log('Please set the DEEPGRAM_SECRET environment variable.');
  process.exit(1);
}

// Hosted sample file
const audioUrl = "https://static.deepgram.com/examples/Bueller-Life-moves-pretty-fast.wav";

// Initializes the Deepgram SDK
const deepgram = new Deepgram(deepgramApiKey);

console.log('Requesting transcript...')
console.log('Your file may take up to a couple minutes to process.')
console.log('While you wait, did you know that Deepgram accepts over 40 audio file formats? Even MP4s.')
console.log('To learn more about customizing your transcripts check out developers.deepgram.com.')

const podcast = await readFile('./syntax-short.wav');

const url = new URL('https://traffic.libsyn.com/syntax/Syntax_-_599.mp3');
const filename = url.pathname.split('/').pop();
const filenameWithoutExtension = filename?.split('.').slice(0, -1).join('.');

deepgram.transcription.preRecorded(
  {
    // buffer: podcast,
    // mimetype: 'audio/wav',
    url: url.href,
   },
  {
    punctuate: true,
    model: 'nova',
    language: 'en-US',
    detect_entities: true,
    diarize: true,
    smart_format: true,
    paragraphs: true,
    utterances: true,
    detect_topics: true,
    keywords: ['CSS', 'Sass', 'Wes', 'Bos', 'Scott', 'Tolinski']
  },
)
  .then(async (transcription) => {
    console.dir(transcription, { depth: null });
    await writeFile(`${filenameWithoutExtension}.json`, JSON.stringify(transcription, null, 2));
    console.log('Done!');
  })
  .catch((err) => {
    console.log(err);
  });
