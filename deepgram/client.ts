import { Utterance } from '@deepgram/sdk/dist/types';
import transcript from './Syntax_-_599-base';

// Select .transcript
const transcriptEl = document.querySelector<HTMLDivElement>('.transcript');
const audioEl = document.querySelector<HTMLAudioElement>('audio');

const speakers = {
  0: 'Growler',
  1: 'Scott Tolinski',
  2: 'Wes Bos',
}

function createUtterance(utterance: Utterance, timestamp?: number) {
  let sentence = utterance.transcript;
  if (timestamp) {
    const word = findClosestUtteranceWord(utterance, timestamp);
    if (word) {
      sentence = utterance.words.map((w) => {
        if (w === word) {
          return `<span class="word active">${w.punctuated_word}</span>`;
        }
        return `<span class="word">${w.punctuated_word}</span>`;
      }).join(' ');
    }
  }

  // const sentence = utterance.words.map(word => word.punctuated_word).join(' ');
  return `<div class="utterance" id="utterance-${utterance.id}">
    <h3>${speakers[utterance.speaker]}</h3>
    <p>${sentence}</p>
  </div>`
}

function start() {
  const utterances = transcript.results?.utterances?.map(uts => createUtterance(uts)).join('');
  transcriptEl.innerHTML = utterances;
  // console.log(utterances);
}

function findUtterance(utterances: Utterance[], timestamp: number) {
  return utterances.find((utterance) => {
    return timestamp > utterance.start && timestamp < utterance.end;
  });
}

function findUtteranceWord(utterance: Utterance, timestamp: number) {
  return utterance.words.find((word) => {
    return timestamp > word.start && timestamp < word.end;
  });
}

function findClosestUtteranceWord(utterance: Utterance, timestamp: number) {
  return utterance.words.reduce((prev, curr) => {
    return (Math.abs(curr.start - timestamp) < Math.abs(prev.start - timestamp) ? curr : prev);
  });
}

function findClosestUtterance(utterances: Utterance[], timestamp: number) {
  return utterances.reduce((prev, curr) => {
    return (Math.abs(curr.start - timestamp) < Math.abs(prev.start - timestamp) ? curr : prev);
  });
}

audioEl.addEventListener('timeupdate', handleTimeUpdate);

let lastUtterance: Utterance | null = null;

function removeActive() {
  const activeEl = document.querySelector<HTMLDivElement>('.utterance.active');
  activeEl?.classList.remove('active');
}

function handleTimeUpdate(e: Event) {
  const audio = e.currentTarget as HTMLAudioElement;
  let utterance = findUtterance(transcript.results?.utterances || [], audio.currentTime);

  // If there is no utterance, set it to the next one in the array after the current one. This helps when there is a pause in the audio.
  // if(!utterance) {
  //   const nextUtterance = transcript.results?.utterances?.find((u) => u.start > audio.currentTime);
  //   utterance = nextUtterance;
  // }
  if (utterance) {
    let word = findUtteranceWord(utterance, audio.currentTime);
    console.log(word);
    // if (utterance === lastUtterance) return;
    lastUtterance = utterance;
    const utteranceHTML = createUtterance(utterance, audio.currentTime);
    const utteranceFragment = document.createRange().createContextualFragment(utteranceHTML);
    const utteranceEl = document.querySelector<HTMLDivElement>(`#utterance-${utterance.id}`);
    removeActive();

    utteranceEl?.classList.add('active');
    console.log(utteranceFragment.firstChild?.innerHTML);
    utteranceEl.innerHTML = utteranceFragment.firstChild?.innerHTML || '';
    utteranceEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

start();
