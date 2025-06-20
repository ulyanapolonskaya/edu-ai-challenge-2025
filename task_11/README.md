# Audio Transcription Console Application

A powerful console application that transcribes audio files using OpenAI's Whisper API, generates summaries using GPT, and provides detailed analytics about the audio content.

## Features

- 🎵 **Audio Transcription**: Uses OpenAI's Whisper-1 model to transcribe any audio file
- 📝 **AI-Powered Summarization**: Generates concise summaries using GPT-3.5-turbo
- 📊 **Advanced Analytics**: Extracts word count, speaking speed, and frequently mentioned topics
- 💾 **File Management**: Automatically saves transcriptions, summaries, and analytics to separate files
- 🖥️ **Console Interface**: User-friendly command-line interface with colored output

## Requirements

- Python 3.7 or higher
- OpenAI API key
- Audio file in supported format (MP3, WAV, M4A, FLAC, etc.)

## Installation

1. **Clone or download this repository**

2. **Create and activate a virtual environment (recommended):**
   ```bash
   # Create virtual environment
   python -m venv task-11-venv
   
   # Activate virtual environment
   # On Windows:
   task-11-venv\Scripts\activate
   
   # On macOS/Linux:
   source task-11-venv/bin/activate
   ```

3. **Install required dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up your OpenAI API key** (choose one method):
   
   **Method 1: .env File (Recommended)**
   ```bash
   # Copy the example file
   cp env.example .env
   
   # Edit .env file and replace with your actual API key
   # .env file content:
   OPENAI_API_KEY=your_actual_api_key_here
   ```
   
   **Method 2: Environment Variable**
   ```bash
   # Windows
   set OPENAI_API_KEY=your_api_key_here
   
   # macOS/Linux
   export OPENAI_API_KEY=your_api_key_here
   ```
   
   **Method 3: Command Line Parameter**
   ```bash
   python main.py audio_file.mp3 --api-key your_api_key_here
   ```

## Usage

### Basic Usage
```bash
python main.py path/to/your/audio_file.mp3
```

### With API Key Parameter
```bash
python main.py path/to/your/audio_file.mp3 --api-key your_openai_api_key
```

### Example with Provided Audio File
```bash
# Make sure your .env file is set up first
python main.py CAR0004.mp3
```

## Output

The application will:

1. **Console Output**: Display real-time progress and final results including:
   - Summary of the audio content
   - Analytics (word count, speaking speed, top topics)
   - List of generated files

2. **Generated Files**: Create timestamped files:
   - `transcription_YYYYMMDD_HHMMSS.md` - Full transcription
   - `summary_YYYYMMDD_HHMMSS.md` - AI-generated summary
   - `analysis_YYYYMMDD_HHMMSS.json` - Analytics in JSON format

## Analytics Format

The analytics JSON file contains:
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

## Supported Audio Formats

The application supports all audio formats supported by OpenAI's Whisper API:
- MP3
- MP4
- MPEG
- MPGA
- M4A
- WAV
- WEBM

## Error Handling

The application includes comprehensive error handling for:
- Missing audio files
- Invalid API keys
- Network connection issues
- API rate limits
- Unsupported file formats

## Troubleshooting

### Common Issues

1. **"OpenAI API key is required" error**
   - Make sure you've created a `.env` file with your `OPENAI_API_KEY`
   - Or set the `OPENAI_API_KEY` environment variable
   - Or use the `--api-key` parameter

2. **"Audio file not found" error**
   - Check the file path is correct
   - Ensure the file exists and is accessible

3. **API errors**
   - Verify your OpenAI API key is valid and has sufficient credits
   - Check your internet connection
   - Ensure the audio file size is under the API limits (25MB)

### Getting Help

If you encounter issues:
1. Check the error message for specific details
2. Verify your API key and internet connection
3. Ensure the audio file is in a supported format
4. Check that all dependencies are installed correctly

## API Usage and Costs

This application uses OpenAI's APIs:
- **Whisper API**: For audio transcription (~$0.006 per minute)
- **GPT-3.5-turbo**: For summarization and topic extraction

Make sure you have sufficient credits in your OpenAI account before running the application.

## License

This project is provided as-is for educational and demonstration purposes. 