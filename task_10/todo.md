# Product Search Tool - Todo List

## Technical Setup
- [x] Install dependencies in virtual environment (venv)
- [x] Set up OpenAI API with model="gpt-4.1-mini"

## Core Development Tasks
- [x] Create console-based product search tool
- [x] Implement natural language input acceptance (e.g., "I need a smartphone under $800 with a great camera and long battery life")
- [x] Use products.json dataset as input parameter
- [x] Implement OpenAI function calling to extract and return matching products (no manual filtering logic allowed)
- [x] Search dataset for requested items based on user preferences:
  - [x] Category filtering
  - [x] Max price filtering
  - [x] Min rating filtering
  - [x] In-stock status filtering
- [x] Return filtered product list in structured format
- [x] Ensure response format matches example:
  ```
  Filtered Products:
  1. Wireless Headphones - $99.99, Rating: 4.5, In Stock
  2. Smart Watch - $199.99, Rating: 4.6, In Stock
  ```

## Finalization Tasks
- [x] Create .gitignore file
- [x] Create comprehensive README.md with:
  - [x] Clear and detailed instructions on how to run the application
  - [x] Virtual environment creation and activation steps
- [x] Create sample_outputs.md with at least two sample runs for different user requests

## Requirements Checklist
- [x] Console-based application ✓
- [x] Natural language input processing ✓
- [x] OpenAI function calling implementation ✓
- [x] No manual filtering logic ✓
- [x] Structured output format ✓
- [x] Complete documentation ✓