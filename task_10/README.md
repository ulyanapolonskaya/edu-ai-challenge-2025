# Product Search Tool

A console-based application that uses natural language processing to search for products based on user preferences. The tool leverages OpenAI's function calling capability to extract search criteria from natural language queries and filter products accordingly.

## Features

- **Natural Language Input**: Enter search queries in plain English
- **AI-Powered Search**: Uses OpenAI's gpt-4.1-mini with function calling to understand user intent
- **Multiple Filter Types**: 
  - Category filtering (Electronics, Fitness, Kitchen, Books, Clothing)
  - Price range filtering
  - Rating filtering
  - Stock status filtering
  - Keyword searching
- **Structured Output**: Clean, formatted results with product details

## Prerequisites

- Python 3.7 or higher
- OpenAI API key

## Installation and Setup

### 1. Create and Activate Virtual Environment

#### On Windows:
```bash
python -m venv product-search-venv
product-search-venv\Scripts\activate
```

#### On macOS/Linux:
```bash
python -m venv product-search-venv
source product-search-venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Set Up OpenAI API Key

Create a `.env` file in the project directory and add your OpenAI API key:

```
OPENAI_API_KEY=your_api_key_here
```

Alternatively, you can set the environment variable directly:

#### On Windows:
```bash
set OPENAI_API_KEY=your_api_key_here
```

#### On macOS/Linux:
```bash
export OPENAI_API_KEY=your_api_key_here
```

## Usage

### Basic Usage

Run the application with the default products.json file:

```bash
python product_search.py
```

### Using a Custom Products File

You can specify a different products JSON file:

```bash
python product_search.py path/to/your/products.json
```

### Example Queries

Once the application is running, you can enter natural language queries such as:

- `"I need a smartphone under $800 with a great camera and long battery life"`
- `"Show me fitness equipment under $100"`
- `"Find electronics with rating above 4.5 that are in stock"`
- `"I want books about programming"`
- `"Show me kitchen appliances under $50"`

### Exiting the Application

Type `quit`, `exit`, or `q` to exit the application, or use `Ctrl+C`.

## Data Format

The products JSON file should contain an array of product objects with the following structure:

```json
[
  {
    "name": "Product Name",
    "category": "Category",
    "price": 99.99,
    "rating": 4.5,
    "in_stock": true
  }
]
```

### Supported Categories

- Electronics
- Fitness
- Kitchen
- Books
- Clothing

## Technical Details

### Architecture

The application uses OpenAI's function calling feature to:

1. Parse natural language queries
2. Extract relevant search criteria (category, price range, rating, keywords, etc.)
3. Apply filters to the product dataset
4. Return structured results

### Key Components

- **ProductSearchTool**: Main class handling the search logic
- **OpenAI Function Calling**: Extracts search criteria from natural language
- **Product Filtering**: Applies extracted criteria to filter the product dataset
- **Result Formatting**: Presents results in a user-friendly format

## Error Handling

The application includes comprehensive error handling for:
- Missing or invalid OpenAI API key
- Missing or malformed products.json file
- Network connectivity issues
- Invalid user input

## Dependencies

- `openai>=1.0.0`: OpenAI API client
- `python-dotenv>=1.0.0`: Environment variable management

## Troubleshooting

### Common Issues

1. **OpenAI API Key Error**: Ensure your API key is correctly set in the `.env` file or environment variables.

2. **Products File Not Found**: Make sure the `products.json` file exists in the same directory as the script, or provide the correct path.

3. **Import Errors**: Ensure you've activated your virtual environment and installed all dependencies.

4. **Network Issues**: Check your internet connection if API calls are failing.

### Getting Help

If you encounter issues:
1. Verify your virtual environment is activated
2. Check that all dependencies are installed
3. Ensure your OpenAI API key is valid and has sufficient credits
4. Review the error messages for specific guidance 