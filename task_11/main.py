#!/usr/bin/env python3
"""
Audio Transcription Console Application
Transcribes audio files using OpenAI Whisper API and provides analytics
"""

import os
import sys
import json
import re
from datetime import datetime
from pathlib import Path
import openai
from openai import OpenAI
import argparse
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class AudioTranscriber:
    def __init__(self, api_key=None):
        """Initialize the AudioTranscriber with OpenAI API key"""
        if api_key:
            self.client = OpenAI(api_key=api_key)
        else:
            # Try to get API key from environment variable or .env file
            api_key = os.getenv('OPENAI_API_KEY')
            if not api_key:
                raise ValueError("OpenAI API key is required. Create a .env file with OPENAI_API_KEY=your_key or pass it as parameter.")
            self.client = OpenAI(api_key=api_key)
    
    def transcribe_audio(self, audio_file_path):
        """Transcribe audio file using OpenAI Whisper API"""
        print(f"Transcribing audio file: {audio_file_path}")
        
        try:
            with open(audio_file_path, "rb") as audio_file:
                transcript = self.client.audio.transcriptions.create(
                    model="whisper-1",
                    file=audio_file,
                    response_format="text"
                )
            
            print("✅ Audio transcription completed successfully!")
            return transcript
            
        except Exception as e:
            print(f"❌ Error transcribing audio: {str(e)}")
            return None
    
    def summarize_transcript(self, transcript_text):
        """Summarize the transcript using GPT model"""
        print("Generating summary using GPT...")
        
        try:
            response = self.client.chat.completions.create(
                model="whisper-1",
                messages=[
                    {
                        "role": "system",
                        "content": "You are a helpful assistant that creates concise, well-structured summaries of transcribed audio content. Focus on key points, main topics, and important details."
                    },
                    {
                        "role": "user",
                        "content": f"Please provide a comprehensive summary of the following transcript:\n\n{transcript_text}"
                    }
                ],
                max_tokens=500,
                temperature=0.3
            )
            
            summary = response.choices[0].message.content
            print("✅ Summary generated successfully!")
            return summary
            
        except Exception as e:
            print(f"❌ Error generating summary: {str(e)}")
            return None
    
    def extract_analytics(self, transcript_text):
        """Extract analytics from the transcript"""
        print("Extracting analytics from transcript...")
        
        # Calculate word count
        words = transcript_text.split()
        word_count = len(words)
        
        # Extract topics using GPT
        try:
            response = self.client.chat.completions.create(
                model="whisper-1",
                messages=[
                    {
                        "role": "system",
                        "content": "You are an expert at analyzing text and identifying the most frequently mentioned topics. Return only a JSON array of objects with 'topic' and 'mentions' fields, focusing on the most significant topics mentioned multiple times."
                    },
                    {
                        "role": "user",
                        "content": f"Analyze this transcript and identify the top 5-10 most frequently mentioned topics with their mention counts. Return only valid JSON:\n\n{transcript_text}"
                    }
                ],
                max_tokens=300,
                temperature=0.1
            )
            
            topics_text = response.choices[0].message.content
            # Try to extract JSON from the response
            try:
                topics = json.loads(topics_text)
            except:
                # If direct JSON parsing fails, try to extract JSON from text
                json_match = re.search(r'\[.*\]', topics_text, re.DOTALL)
                if json_match:
                    topics = json.loads(json_match.group())
                else:
                    topics = []
            
        except Exception as e:
            print(f"⚠️ Warning: Could not extract topics automatically: {str(e)}")
            topics = []
        
        # Estimate speaking speed (assuming average audio length)
        # This is a rough estimation - in a real app, you'd want the actual audio duration
        estimated_duration_minutes = word_count / 150  # Average speaking speed
        speaking_speed_wpm = round(word_count / estimated_duration_minutes) if estimated_duration_minutes > 0 else 0
        
        analytics = {
            "word_count": word_count,
            "speaking_speed_wpm": speaking_speed_wpm,
            "frequently_mentioned_topics": topics
        }
        
        print("✅ Analytics extracted successfully!")
        return analytics
    
    def save_transcription(self, transcript_text, filename_prefix="transcription"):
        """Save transcription to a separate file"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"{filename_prefix}_{timestamp}.md"
        
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(f"# Audio Transcription\n\n")
            f.write(f"**Generated on:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n")
            f.write(f"## Transcript\n\n")
            f.write(transcript_text)
        
        print(f"✅ Transcription saved to: {filename}")
        return filename
    
    def save_summary(self, summary_text, filename_prefix="summary"):
        """Save summary to a separate file"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"{filename_prefix}_{timestamp}.md"
        
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(f"# Audio Summary\n\n")
            f.write(f"**Generated on:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n")
            f.write(f"## Summary\n\n")
            f.write(summary_text)
        
        print(f"✅ Summary saved to: {filename}")
        return filename
    
    def save_analytics(self, analytics_data, filename_prefix="analysis"):
        """Save analytics to a JSON file"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"{filename_prefix}_{timestamp}.json"
        
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(analytics_data, f, indent=2)
        
        print(f"✅ Analytics saved to: {filename}")
        return filename
    
    def process_audio_file(self, audio_file_path):
        """Complete workflow: transcribe, summarize, analyze, and save"""
        print(f"\n🎵 Starting audio processing workflow for: {audio_file_path}")
        print("=" * 60)
        
        # Step 1: Transcribe audio
        transcript = self.transcribe_audio(audio_file_path)
        if not transcript:
            return None
        
        # Step 2: Generate summary
        summary = self.summarize_transcript(transcript)
        if not summary:
            return None
        
        # Step 3: Extract analytics
        analytics = self.extract_analytics(transcript)
        
        # Step 4: Save all results
        transcript_file = self.save_transcription(transcript)
        summary_file = self.save_summary(summary)
        analytics_file = self.save_analytics(analytics)
        
        # Step 5: Display results in console
        print("\n" + "=" * 60)
        print("📊 RESULTS SUMMARY")
        print("=" * 60)
        print(f"\n📝 SUMMARY:")
        print("-" * 40)
        print(summary)
        
        print(f"\n📈 ANALYTICS:")
        print("-" * 40)
        print(f"Word Count: {analytics['word_count']}")
        print(f"Speaking Speed: {analytics['speaking_speed_wpm']} WPM")
        print(f"Top Topics:")
        for topic in analytics['frequently_mentioned_topics'][:5]:
            print(f"  • {topic['topic']}: {topic['mentions']} mentions")
        
        print(f"\n💾 FILES CREATED:")
        print("-" * 40)
        print(f"  • Transcription: {transcript_file}")
        print(f"  • Summary: {summary_file}")
        print(f"  • Analytics: {analytics_file}")
        
        return {
            'transcript': transcript,
            'summary': summary,
            'analytics': analytics,
            'files': {
                'transcript': transcript_file,
                'summary': summary_file,
                'analytics': analytics_file
            }
        }

def main():
    """Main function to run the console application"""
    parser = argparse.ArgumentParser(description='Audio Transcription Console Application')
    parser.add_argument('audio_file', help='Path to the audio file to transcribe')
    parser.add_argument('--api-key', help='OpenAI API key (optional if OPENAI_API_KEY env var is set)')
    
    args = parser.parse_args()
    
    # Check if audio file exists
    if not os.path.exists(args.audio_file):
        print(f"❌ Error: Audio file '{args.audio_file}' not found.")
        sys.exit(1)
    
    try:
        # Initialize transcriber
        transcriber = AudioTranscriber(api_key=args.api_key)
        
        # Process the audio file
        result = transcriber.process_audio_file(args.audio_file)
        
        if result:
            print(f"\n🎉 Audio processing completed successfully!")
        else:
            print(f"\n❌ Audio processing failed.")
            sys.exit(1)
            
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main() 