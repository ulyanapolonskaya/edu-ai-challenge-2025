#!/usr/bin/env python3
"""
Service Analyzer Console Application

A lightweight console application that accepts service or product information
and returns a comprehensive, markdown-formatted report from multiple viewpoints.
"""

import os
import sys
import argparse
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class ServiceAnalyzer:
    def __init__(self):
        """Initialize the ServiceAnalyzer with OpenAI client."""
        api_key = os.getenv('OPENAI_API_KEY')
        if not api_key:
            print("Error: OpenAI API key not found. Please set OPENAI_API_KEY environment variable.")
            print("You can set it in a .env file or as an environment variable.")
            sys.exit(1)
        
        self.client = OpenAI(api_key=api_key)
    
    def get_analysis_prompt(self, service_input):
        """Generate the prompt for OpenAI to analyze the service."""
        return f"""
You are a business and technology analyst. Analyze the following service/product and provide a comprehensive report in markdown format.

Service/Product to analyze: {service_input}

Please provide a detailed analysis structured as follows:

# {service_input} - Comprehensive Analysis Report

## Brief History
Provide founding year, key milestones, and important developments in the company's history.

## Target Audience
Identify and describe the primary user segments and demographics this service targets.

## Core Features
List and describe the top 2-4 key functionalities that define this service.

## Unique Selling Points
Highlight the key differentiators that set this service apart from competitors.

## Business Model
Explain how the service generates revenue and monetizes its offerings.

## Tech Stack Insights
Provide insights about the technologies, platforms, and technical approaches used (based on publicly available information).

## Perceived Strengths
List and explain the standout features, advantages, and positive aspects commonly mentioned by users and industry experts.

## Perceived Weaknesses
Identify and describe the commonly cited drawbacks, limitations, or areas for improvement.

Please ensure each section is detailed and informative, drawing from your knowledge of the service. Use proper markdown formatting with headers, bullet points, and emphasis where appropriate.
"""
    
    def analyze_service(self, service_input):
        """Analyze the service using OpenAI API and return markdown report."""
        try:
            print(f"Analyzing: {service_input}")
            print("Generating comprehensive report using AI...")
            
            prompt = self.get_analysis_prompt(service_input)
            
            response = self.client.chat.completions.create(
                model="gpt-4.1-mini",
                messages=[
                    {"role": "system", "content": "You are an expert business and technology analyst with deep knowledge of various services and products across different industries."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=2000,
                temperature=0.7
            )
            
            return response.choices[0].message.content
            
        except Exception as e:
            print(f"Error analyzing service: {str(e)}")
            return None
    
    def save_report(self, report, filename=None):
        """Save the report to a file."""
        if not filename:
            timestamp = __import__('datetime').datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"service_analysis_{timestamp}.md"
        
        try:
            with open(filename, 'w', encoding='utf-8') as f:
                f.write(report)
            print(f"Report saved to: {filename}")
            return filename
        except Exception as e:
            print(f"Error saving report: {str(e)}")
            return None

def main():
    """Main function to run the console application."""
    parser = argparse.ArgumentParser(
        description="Analyze services and generate comprehensive markdown reports",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python service_analyzer.py "Spotify"
  python service_analyzer.py "Netflix streaming platform"
  python service_analyzer.py --interactive
        """
    )
    
    parser.add_argument(
        'service',
        nargs='?',
        help='Service or product name to analyze'
    )
    
    parser.add_argument(
        '--interactive', '-i',
        action='store_true',
        help='Run in interactive mode'
    )
    
    parser.add_argument(
        '--output', '-o',
        help='Output filename for the report'
    )
    
    args = parser.parse_args()
    
    # Initialize analyzer
    analyzer = ServiceAnalyzer()
    
    # Get service input
    if args.interactive or not args.service:
        print("=== Service Analyzer ===")
        print("Enter the name of a service or product you want to analyze.")
        print("Examples: 'Spotify', 'Notion', 'Tesla Model 3', 'ChatGPT'")
        service_input = input("\nService/Product to analyze: ").strip()
        
        if not service_input:
            print("Error: No service provided.")
            sys.exit(1)
    else:
        service_input = args.service
    
    # Analyze the service
    report = analyzer.analyze_service(service_input)
    
    if report:
        print("\n" + "="*80)
        print("ANALYSIS REPORT")
        print("="*80)
        print(report)
        print("="*80)
        
        # Ask if user wants to save
        if args.interactive:
            save_choice = input("\nWould you like to save this report to a file? (y/n): ").strip().lower()
            if save_choice in ['y', 'yes']:
                filename = input("Enter filename (or press Enter for auto-generated): ").strip()
                analyzer.save_report(report, filename if filename else None)
        else:
            # Save automatically when not in interactive mode
            analyzer.save_report(report, args.output)
    else:
        print("Failed to generate analysis report.")
        sys.exit(1)

if __name__ == "__main__":
    main() 