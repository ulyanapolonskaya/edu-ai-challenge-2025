#!/usr/bin/env python3
"""
Example usage script for the Audio Transcription Console Application

This script demonstrates how to use the AudioTranscriber class programmatically.
You can also use the main.py script directly from the command line.
"""

import os
from main import AudioTranscriber

def example_usage():
    """Example of how to use the AudioTranscriber class"""
    
    # Example 1: Basic usage with environment variable API key
    print("Example 1: Using environment variable for API key")
    print("="*50)
    
    try:
        # Make sure OPENAI_API_KEY is set in .env file or environment
        transcriber = AudioTranscriber()
        
        # Process an audio file
        audio_file = "CAR0004.mp3"
        if os.path.exists(audio_file):
            result = transcriber.process_audio_file(audio_file)
            if result:
                print("✅ Processing completed successfully!")
            else:
                print("❌ Processing failed.")
        else:
            print(f"❌ Audio file '{audio_file}' not found.")
            
    except ValueError as e:
        print(f"❌ {e}")
        print("\nTo use this example:")
        print("1. Create a .env file with: OPENAI_API_KEY=your_key_here")
        print("2. Run this script: python example_usage.py")
    
    print("\n" + "="*50)
    
    # Example 2: Using API key as parameter
    print("Example 2: Using API key as parameter")
    print("="*50)
    
    # Uncomment and replace with your actual API key
    # api_key = "your-openai-api-key-here"
    # transcriber = AudioTranscriber(api_key=api_key)
    # result = transcriber.process_audio_file("CAR0004.mp3")
    
    print("Uncomment the lines in this section and add your API key to test.")
    
    print("\n" + "="*50)
    
    # Example 3: Individual method usage
    print("Example 3: Using individual methods")
    print("="*50)
    
    try:
        transcriber = AudioTranscriber()
        
        # Example transcript text for demonstration
        sample_transcript = """
        Hello, this is a sample transcript for demonstration purposes. 
        We're discussing customer onboarding processes and how to improve 
        the user experience. The Q4 roadmap includes several AI integration 
        features that will enhance our customer onboarding workflow.
        """
        
        # Generate summary
        print("Generating summary...")
        summary = transcriber.summarize_transcript(sample_transcript)
        if summary:
            print(f"Summary: {summary[:100]}...")
        
        # Extract analytics
        print("\nExtracting analytics...")
        analytics = transcriber.extract_analytics(sample_transcript)
        print(f"Analytics: {analytics}")
        
        # Save files
        print("\nSaving files...")
        transcriber.save_transcription(sample_transcript, "example_transcription")
        transcriber.save_summary(summary if summary else "Example summary", "example_summary")
        transcriber.save_analytics(analytics, "example_analysis")
        
    except ValueError as e:
        print(f"❌ {e}")
        print("Create a .env file with OPENAI_API_KEY=your_key to test this example.")

def command_line_examples():
    """Show command line usage examples"""
    print("\n" + "="*60)
    print("COMMAND LINE USAGE EXAMPLES")
    print("="*60)
    
    print("\n1. Basic usage (with .env file containing OPENAI_API_KEY):")
    print("   python main.py CAR0004.mp3")
    
    print("\n2. Using API key parameter:")
    print("   python main.py CAR0004.mp3 --api-key your_api_key_here")
    
    print("\n3. Processing different audio files:")
    print("   python main.py path/to/your/audio.mp3")
    print("   python main.py recording.wav")
    print("   python main.py interview.m4a")
    
    print("\n4. Get help:")
    print("   python main.py --help")

if __name__ == "__main__":
    print("🎵 Audio Transcription Application - Usage Examples")
    print("="*60)
    
    example_usage()
    command_line_examples()
    
    print(f"\n✅ All examples completed!")
    print("\nNext steps:")
    print("1. Create .env file: cp env.example .env")
    print("2. Add your API key to .env file: OPENAI_API_KEY=your_key_here")
    print("3. Install dependencies: pip install -r requirements.txt")
    print("4. Run the application: python main.py CAR0004.mp3") 