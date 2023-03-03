import { readFile } from 'fs/promises';
import {encode, decode}  from 'gpt-3-encoder';


const transcriptRaw = await readFile('./Syntax_-_578-LOGGING.srt', 'utf-8');

console.log(transcriptRaw);

const encoded = encode(transcriptRaw)
console.log('Encoded this string looks like: ', encoded)

console.log('Token Count: ', encoded.length);
console.log('Price: ', Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format((encoded.length / 1000) * 0.002));

