# src/calculator/evaluator.py

def evaluate_postfix(postfix_expression):
    """
    Evaluates a mathematical expression in postfix (Reverse Polish Notation) form.
    """
    stack = []
    
    for token in postfix_expression:
        if token.replace('.', '', 1).isdigit(): # If it's a number
            stack.append(float(token))
        elif token in '+-*/':
            if len(stack) < 2:
                raise ValueError("Invalid expression: insufficient operands for operator")
            
            operand2 = stack.pop()
            operand1 = stack.pop()
            
            if token == '+':
                stack.append(operand1 + operand2)
            elif token == '-':
                stack.append(operand1 - operand2)
            elif token == '*':
                stack.append(operand1 * operand2)
            elif token == '/':
                if operand2 == 0:
                    raise ZeroDivisionError("Division by zero")
                stack.append(operand1 / operand2)
    
    if len(stack) != 1:
        raise ValueError("Invalid expression: too many operands or operators")
        
    return stack[0]

def evaluate(expression_string):
    """
    Parses and evaluates a mathematical expression string.
    This function will be integrated with the parser.
    """
    # This function will call the parser to get postfix expression
    # For now, it's a placeholder or can directly call evaluate_postfix if parser is imported
    # Example usage assumes parser is imported and provides postfix expression
    
    from .parser import parse # Assuming relative import from calculator package
    postfix_expr = parse(expression_string)
    result = evaluate_postfix(postfix_expr)
    return result

# Example Usage (for testing during development)
if __name__ == "__main__":
    test_expressions = {
        "3 + 4 * 2 / ( 1 - 5 )": -1.0,
        "10 + 20": 30.0,
        "5 * (2 + 3)": 25.0,
        "((1 + 2) * 3) / 4": 2.25,
        "7 - (3 * 2)": 1.0,
        "15 / 3": 5.0,
        "1 + 2 + 3": 6.0,
        "10 - 5 - 2": 3.0
    }

    for expr, expected in test_expressions.items():
        try:
            result = evaluate(expr)
            print(f"Expression: {expr}, Result: {result}, Expected: {expected}, Pass: {result == expected}")
        except Exception as e:
            print(f"Expression: {expr}, Error: {e}")

    # Test error cases
    try:
        evaluate("10 / 0")
    except ZeroDivisionError as e:
        print(f"Error test (division by zero): {e}")

    try:
        evaluate("1 + + 2")
    except ValueError as e:
        print(f"Error test (invalid expression): {e}")

    try:
        evaluate("(1 + 2")
    except ValueError as e:
        print(f"Error test (mismatched parentheses): {e}")
