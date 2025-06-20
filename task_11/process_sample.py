#!/usr/bin/env python3
"""
Sample script to process the provided CAR0004.mp3 file
This script will generate the required sample files: transcription.md, summary.md, and analysis.json
"""

import os
from main import AudioTranscriber

def process_sample_audio():
    """Process the provided CAR0004.mp3 file and create sample outputs"""
    audio_file = "CAR0004.mp3"
    
    if not os.path.exists(audio_file):
        print(f"❌ Error: Audio file '{audio_file}' not found.")
        return
    
    try:
        # Initialize transcriber
        transcriber = AudioTranscriber()
        
        # Process the audio file
        result = transcriber.process_audio_file(audio_file)
        
        if result:
            # Create the required sample files with specific names
            # Save transcription as transcription.md
            with open('transcription.md', 'w', encoding='utf-8') as f:
                f.write(f"# Audio Transcription - CAR0004.mp3\n\n")
                f.write(f"## Transcript\n\n")
                f.write(result['transcript'])
            
            # Save summary as summary.md
            with open('summary.md', 'w', encoding='utf-8') as f:
                f.write(f"# Audio Summary - CAR0004.mp3\n\n")
                f.write(f"## Summary\n\n")
                f.write(result['summary'])
            
            # Save analytics as analysis.json
            import json
            with open('analysis.json', 'w', encoding='utf-8') as f:
                json.dump(result['analytics'], f, indent=2)
            
            print(f"\n✅ Sample files created:")
            print(f"  • transcription.md")
            print(f"  • summary.md")
            print(f"  • analysis.json")
            
        else:
            print(f"\n❌ Audio processing failed.")
            
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        print("\nNote: Make sure to create a .env file with your OPENAI_API_KEY.")

if __name__ == "__main__":
    process_sample_audio() 