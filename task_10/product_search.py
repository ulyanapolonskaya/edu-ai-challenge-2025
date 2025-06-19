#!/usr/bin/env python3
"""
Product Search Tool
A console-based application that uses natural language processing to search for products
based on user preferences using OpenAI function calling.
"""

import json
import os
import sys
from typing import List, Dict, Any, Optional
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class ProductSearchTool:
    def __init__(self, products_file: str = "products.json"):
        """Initialize the product search tool with products data."""
        self.products_file = products_file
        self.products = self.load_products()
        
        # Initialize OpenAI client
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            print("Error: Please set your OPENAI_API_KEY environment variable.")
            print("You can create a .env file with: OPENAI_API_KEY=your_api_key_here")
            sys.exit(1)
        
        self.client = OpenAI(api_key=api_key)
    
    def load_products(self) -> List[Dict[str, Any]]:
        """Load products from JSON file."""
        try:
            with open(self.products_file, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            print(f"Error: Products file '{self.products_file}' not found.")
            sys.exit(1)
        except json.JSONDecodeError:
            print(f"Error: Invalid JSON in '{self.products_file}'.")
            sys.exit(1)
    
    def search_products(self, user_query: str) -> List[Dict[str, Any]]:
        """
        Use OpenAI function calling to extract search criteria and filter products.
        """
        # Define the function schema for OpenAI
        function_schema = {
            "name": "search_products",
            "description": "Search for products based on user criteria",
            "parameters": {
                "type": "object",
                "properties": {
                    "category": {
                        "type": "string",
                        "description": "Product category (e.g., Electronics, Fitness, Kitchen, Books, Clothing)",
                        "enum": ["Electronics", "Fitness", "Kitchen", "Books", "Clothing"]
                    },
                    "max_price": {
                        "type": "number",
                        "description": "Maximum price the user is willing to pay"
                    },
                    "min_rating": {
                        "type": "number",
                        "description": "Minimum rating required (0-5 scale)"
                    },
                    "in_stock_only": {
                        "type": "boolean",
                        "description": "Whether to show only products that are in stock"
                    },
                    "keywords": {
                        "type": "array",
                        "items": {"type": "string"},
                        "description": "Keywords to search for in product names"
                    }
                },
                "required": []
            }
        }
        
        try:
            # Make the API call with function calling
            response = self.client.chat.completions.create(
                model="gpt-4.1-mini",
                messages=[
                    {
                        "role": "system",
                        "content": "You are a helpful assistant that extracts search criteria from user queries about products. Extract relevant filters like category, max price, min rating, stock preference, and keywords."
                    },
                    {
                        "role": "user",
                        "content": user_query
                    }
                ],
                functions=[function_schema],
                function_call="auto"
            )
            
            # Check if a function was called
            if response.choices[0].message.function_call:
                function_args = json.loads(response.choices[0].message.function_call.arguments)
                return self.filter_products(function_args)
            else:
                # Fallback: return all products if no function call
                return self.products
                
        except Exception as e:
            print(f"Error calling OpenAI API: {e}")
            return []
    
    def filter_products(self, criteria: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Filter products based on extracted criteria."""
        filtered_products = self.products.copy()
        
        # Filter by category
        if "category" in criteria and criteria["category"]:
            filtered_products = [p for p in filtered_products if p["category"] == criteria["category"]]
        
        # Filter by max price
        if "max_price" in criteria and criteria["max_price"] is not None:
            filtered_products = [p for p in filtered_products if p["price"] <= criteria["max_price"]]
        
        # Filter by min rating
        if "min_rating" in criteria and criteria["min_rating"] is not None:
            filtered_products = [p for p in filtered_products if p["rating"] >= criteria["min_rating"]]
        
        # Filter by stock status
        if "in_stock_only" in criteria and criteria["in_stock_only"]:
            filtered_products = [p for p in filtered_products if p["in_stock"]]
        
        # Filter by keywords
        if "keywords" in criteria and criteria["keywords"]:
            for keyword in criteria["keywords"]:
                filtered_products = [
                    p for p in filtered_products 
                    if keyword.lower() in p["name"].lower()
                ]
        
        return filtered_products
    
    def format_results(self, products: List[Dict[str, Any]]) -> str:
        """Format the filtered products for display."""
        if not products:
            return "No products found matching your criteria."
        
        result = f"Filtered Products:\n"
        for i, product in enumerate(products, 1):
            stock_status = "In Stock" if product["in_stock"] else "Out of Stock"
            result += f"{i}. {product['name']} - ${product['price']:.2f}, Rating: {product['rating']}, {stock_status}\n"
        
        return result
    
    def run(self):
        """Main application loop."""
        print("🔍 Product Search Tool")
        print("=" * 50)
        print("Enter your product search request in natural language.")
        print("Examples:")
        print('- "I need a smartphone under $800 with a great camera and long battery life"')
        print('- "Show me fitness equipment under $100"')
        print('- "Find electronics with rating above 4.5"')
        print('- "I want books about programming"')
        print("\nType 'quit' to exit.\n")
        
        while True:
            try:
                user_input = input("🔍 Search: ").strip()
                
                if user_input.lower() in ['quit', 'exit', 'q']:
                    print("Thank you for using Product Search Tool!")
                    break
                
                if not user_input:
                    print("Please enter a search query.\n")
                    continue
                
                print("Searching...")
                filtered_products = self.search_products(user_input)
                result = self.format_results(filtered_products)
                print(f"\n{result}\n")
                
            except KeyboardInterrupt:
                print("\n\nThank you for using Product Search Tool!")
                break
            except Exception as e:
                print(f"An error occurred: {e}\n")

def main():
    """Entry point of the application."""
    # Check if products file exists
    if len(sys.argv) > 1:
        products_file = sys.argv[1]
    else:
        products_file = "products.json"
    
    if not os.path.exists(products_file):
        print(f"Error: Products file '{products_file}' not found.")
        print("Usage: python product_search.py [products_file.json]")
        sys.exit(1)
    
    # Create and run the search tool
    search_tool = ProductSearchTool(products_file)
    search_tool.run()

if __name__ == "__main__":
    main() 