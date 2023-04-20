import { TranscribeClient, CreateCallAnalyticsCategoryCommand, CreateCallAnalyticsCategoryCommandInput, StartTranscriptionJobCommand } from "@aws-sdk/client-transcribe";

// dotenv
import { config } from "dotenv";
config();

// a client can be shared by different commands.
const client = new TranscribeClient({
  region: "us-east-1",
});

const command = new StartTranscriptionJobCommand({
  TranscriptionJobName: 'Syntax-Test',
  LanguageCode: 'en-US',
  MediaFormat: 'wav',
  Media: {
    MediaFileUri: 's3://syntaxfm/syntax-short.wav'
  },
  Subtitles: {
    Formats: ['vtt', 'srt']
  },
  Settings: {
    ShowSpeakerLabels: true,
    MaxSpeakerLabels: 2,
  }
})

const response = await client.send(command);
console.log(response);
