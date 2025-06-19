# Sample Outputs

This document demonstrates the Product Search Tool with various user queries and their corresponding outputs.

## Sample Run 1: Electronics with Price and Rating Filters

### User Input:
```
🔍 Search: I need electronics under $100 with rating above 4.5
```

### Output:
```
Filtered Products:
1. Wireless Headphones - $99.99, Rating: 4.5, In Stock
```

---

## Sample Run 2: Fitness Equipment with Budget Constraint

### User Input:
```
🔍 Search: Show me fitness equipment under $50 that's in stock
```

### Output:
```
Searching...

Filtered Products:
1. Yoga Mat - $19.99, Rating: 4.3, In Stock
2. Resistance Bands - $14.99, Rating: 4.1, In Stock
3. Kettlebell - $39.99, Rating: 4.3, In Stock
4. Foam Roller - $24.99, Rating: 4.5, In Stock
5. Jump Rope - $9.99, Rating: 4.0, In Stock
6. Ab Roller - $19.99, Rating: 4.2, In Stock
```

---

## Sample Run 3: Books with Keyword Search

### User Input:
```
🔍 Search: I want books about programming
```

### Output:
```
Searching...

Filtered Products:
1. Programming Guide - $49.99, Rating: 4.7, In Stock
```

---

## Sample Run 4: Kitchen Appliances with High Rating

### User Input:
```
🔍 Search: Find kitchen appliances with rating 4.5 or higher
```

### Output:
```
Searching...

Filtered Products:
1. Air Fryer - $89.99, Rating: 4.6, In Stock
2. Microwave Oven - $129.99, Rating: 4.5, Out of Stock
3. Pressure Cooker - $99.99, Rating: 4.7, In Stock
4. Dishwasher - $549.99, Rating: 4.6, Out of Stock
5. Refrigerator - $999.99, Rating: 4.8, Out of Stock
```

---

## Sample Run 5: Smartphone Search (Specific Request)

### User Input:
```
🔍 Search: I need a smartphone under $800 with great camera and long battery life
```

### Output:
```
Searching...

No products found matching your criteria.
```

*Note: This happens because our sample dataset doesn't contain smartphones under $800 that are in stock (the smartphone in our dataset is $799.99 but out of stock). The AI correctly identifies the search criteria but no products match all conditions.*

---

## Sample Run 6: General Category Search

### User Input:
```
🔍 Search: Show me all clothing items
```

### Output:
```
Searching...

Filtered Products:
1. Men's T-Shirt - $14.99, Rating: 4.2, In Stock
2. Women's Dress - $39.99, Rating: 4.4, In Stock
3. Men's Jeans - $49.99, Rating: 4.1, In Stock
4. Women's Jacket - $79.99, Rating: 4.5, Out of Stock
5. Men's Shoes - $69.99, Rating: 4.3, In Stock
6. Women's Sandals - $29.99, Rating: 4.2, In Stock
7. Men's Hoodie - $34.99, Rating: 4.6, In Stock
8. Women's Scarf - $19.99, Rating: 4.3, In Stock
9. Men's Socks - $9.99, Rating: 4.1, In Stock
10. Women's Hat - $24.99, Rating: 4.4, In Stock
```

---

## Sample Run 7: Empty Search Result

### User Input:
```
🔍 Search: Find gaming laptops under $500
```

### Output:
```
Searching...

No products found matching your criteria.
```

*Note: The dataset contains a Gaming Laptop but it costs $1299.99, which is well above the $500 budget, so no results are returned.*

---

## Application Startup

### Initial Display:
```
🔍 Product Search Tool
==================================================
Enter your product search request in natural language.
Examples:
- "I need a smartphone under $800 with a great camera and long battery life"
- "Show me fitness equipment under $100"
- "Find electronics with rating above 4.5"
- "I want books about programming"

Type 'quit' to exit.
```

---

## Exit Scenarios

### Normal Exit:
```
🔍 Search: quit
Thank you for using Product Search Tool!
```

### Keyboard Interrupt (Ctrl+C):
```
🔍 Search: ^C

Thank you for using Product Search Tool!
```

---

## Error Scenarios

### Missing OpenAI API Key:
```
Error: Please set your OPENAI_API_KEY environment variable.
You can create a .env file with: OPENAI_API_KEY=your_api_key_here
```

### Missing Products File:
```
Error: Products file 'products.json' not found.
Usage: python product_search.py [products_file.json]
```

### API Error (Network/Quota Issues):
```
🔍 Search: show me electronics
Searching...
Error calling OpenAI API: [specific error message]

No products found matching your criteria.
``` 