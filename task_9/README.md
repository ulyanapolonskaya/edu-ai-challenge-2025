# Service Analyzer Console Application

A lightweight console application that accepts service or product information and returns a comprehensive, markdown-formatted report from multiple viewpoints—including business, technical, and user-focused perspectives.

## Features

- 🤖 **AI-Powered Analysis**: Uses OpenAI's GPT-4 to generate comprehensive reports
- 📊 **Multi-Perspective Reports**: Covers business, technical, and user viewpoints
- 💻 **Console Interface**: Simple command-line interface with interactive and non-interactive modes
- 📝 **Markdown Output**: Well-formatted reports that can be viewed in any markdown viewer
- 💾 **File Export**: Option to save reports as markdown files

## Prerequisites

- Python 3.7 or higher
- OpenAI API key

## Installation

1. **Clone or download the project files**

2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up your OpenAI API key**:
   
   **Option A: Using environment variable**
   ```bash
   # Windows (PowerShell)
   $env:OPENAI_API_KEY="your_api_key_here"
   
   # Windows (Command Prompt)
   set OPENAI_API_KEY=your_api_key_here
   
   # macOS/Linux
   export OPENAI_API_KEY="your_api_key_here"
   ```
   
   **Option B: Using .env file**
   ```bash
   # Create a .env file in the project directory
   echo "OPENAI_API_KEY=your_api_key_here" > .env
   ```

## Usage

### Interactive Mode (Recommended for beginners)

Run the application in interactive mode where you'll be prompted for input:

```bash
python service_analyzer.py --interactive
```

or simply:

```bash
python service_analyzer.py
```

### Command-Line Mode

Analyze a service directly from the command line:

```bash
python service_analyzer.py "Spotify"
python service_analyzer.py "Notion workspace management"
python service_analyzer.py "Tesla Model 3"
```

### Save Output to File

You can save the report to a specific file:

```bash
python service_analyzer.py "Netflix" --output netflix_analysis.md
```

### Command-Line Options

- `service`: The name or description of the service/product to analyze
- `--interactive`, `-i`: Run in interactive mode
- `--output`, `-o`: Specify output filename for the report
- `--help`, `-h`: Show help message

## Report Sections

Each generated report includes the following sections:

1. **Brief History**: Founding year, milestones, and key developments
2. **Target Audience**: Primary user segments and demographics
3. **Core Features**: Top 2-4 key functionalities
4. **Unique Selling Points**: Key differentiators from competitors
5. **Business Model**: Revenue generation and monetization strategies
6. **Tech Stack Insights**: Technologies and platforms used
7. **Perceived Strengths**: Standout features and advantages
8. **Perceived Weaknesses**: Common criticisms and limitations

## Examples

### Example 1: Analyze Spotify
```bash
python service_analyzer.py "Spotify"
```

### Example 2: Interactive mode
```bash
python service_analyzer.py --interactive
# Then enter: Notion
```

### Example 3: Save to file
```bash
python service_analyzer.py "ChatGPT" --output chatgpt_analysis.md
```

## Troubleshooting

### Common Issues

1. **"OpenAI API key not found" error**
   - Make sure you've set the `OPENAI_API_KEY` environment variable
   - If using a .env file, ensure it's in the same directory as the script
   - Verify your API key is valid and has sufficient credits

2. **"ModuleNotFoundError" errors**
   - Install dependencies: `pip install -r requirements.txt`
   - Make sure you're using Python 3.7 or higher

3. **Network/API errors**
   - Check your internet connection
   - Verify your OpenAI API key is active and has available credits
   - Try again in a few moments (API might be temporarily unavailable)

### Getting Help

If you encounter issues:
1. Check that all prerequisites are met
2. Verify your API key is correctly set
3. Ensure all dependencies are installed
4. Try running with a simple service name first (e.g., "Spotify")

## API Usage and Costs

This application uses OpenAI's GPT-4 model, which is a paid service. Each analysis typically costs a few cents, depending on the length and complexity of the generated report. Monitor your OpenAI usage dashboard to track costs.

## License

This project is for educational and personal use. Please ensure you comply with OpenAI's usage policies when using their API. 