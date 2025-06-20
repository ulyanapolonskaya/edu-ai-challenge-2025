# Audio Transcription Console Application - TODO List

## Core Requirements
- [x] Create a console application that accepts any spoken audio file
- [x] Transcribe audio using OpenAI's Whisper API
- [x] Include calls to OpenAI API
- [x] Use OpenAI whisper-1 model (do not change the model!)
- [x] Summarize the transcription using GPT model

## Analytics Features
- [x] Extract custom statistics from the transcript:
  - [x] Total word count
  - [x] Speaking speed (in words per minute)
  - [x] Frequently mentioned topics and how many times each is mentioned

## File Operations
- [x] Save transcription result in a separate file (each new transcription should create a new separate file)
- [x] Return summary and analytics to the user in console

## Example Analytics Format
```json
{
  "word_count": 1280,
  "speaking_speed_wpm": 132,
  "frequently_mentioned_topics": [
    { "topic": "Customer Onboarding", "mentions": 6 },
    { "topic": "Q4 Roadmap", "mentions": 4 },
    { "topic": "AI Integration", "mentions": 3 }
  ]
}
```

## Required Files to Create
- [x] .gitignore file
- [x] README.md with detailed instructions on how to run your application
- [x] Transcription for the provided audio file - transcription.md
- [x] Summary for the provided audio file - summary.md
- [x] Analysis for the provided audio file - analysis.json

## Provided Assets
- ✅ CAR0004.mp3 AUDIO FILE to work with