# src/calculator/parser.py

def tokenize(expression):
    """
    Tokenizes a mathematical expression string.
    Example: "1 + 2 * (3 - 4)" -> ["1", "+", "2", "*", "(", "3", "-", "4", ")"]
    """
    import re
    # Regular expression to match numbers, operators, and parentheses
    # It handles multi-digit numbers and separates operators/parentheses
    tokens = re.findall(r'\d+\.?\d*|\+|\-|\*|\/|\(|\)', expression)
    return tokens

def shunting_yard(tokens):
    """
    Converts an infix expression to a postfix (Reverse Polish Notation) expression
    using the Shunting-yard algorithm.
    """
    output_queue = []
    operator_stack = []
    
    # Operator precedence
    precedence = {'+': 1, '-': 1, '*': 2, '/': 2}
    
    for token in tokens:
        if token.replace('.', '', 1).isdigit(): # If it's a number
            output_queue.append(token)
        elif token in '+-*/':
            while (operator_stack and operator_stack[-1] != '(' and 
                   precedence.get(operator_stack[-1], 0) >= precedence.get(token, 0)):
                output_queue.append(operator_stack.pop())
            operator_stack.append(token)
        elif token == '(':
            operator_stack.append(token)
        elif token == ')':
            while operator_stack and operator_stack[-1] != '(':
                output_queue.append(operator_stack.pop())
            if operator_stack and operator_stack[-1] == '(':
                operator_stack.pop()
            else:
                raise ValueError("Mismatched parentheses") # Error for unmatched ')'
        
    while operator_stack:
        if operator_stack[-1] == '(':
            raise ValueError("Mismatched parentheses") # Error for unmatched '('
        output_queue.append(operator_stack.pop())
        
    return output_queue

def parse(expression):
    """
    Parses a mathematical expression string into a postfix notation.
    """
    tokens = tokenize(expression)
    postfix = shunting_yard(tokens)
    return postfix

# Example Usage (for testing during development)
if __name__ == "__main__":
    expr1 = "3 + 4 * 2 / ( 1 - 5 )"
    postfix1 = parse(expr1)
    print(f"Infix: {expr1} -> Postfix: {postfix1}") # Expected: ['3', '4', '2', '*', '1', '5', '-', '/', '+']

    expr2 = "10 + 20"
    postfix2 = parse(expr2)
    print(f"Infix: {expr2} -> Postfix: {postfix2}") # Expected: ['10', '20', '+']

    expr3 = "5 * (2 + 3)"
    postfix3 = parse(expr3)
    print(f"Infix: {expr3} -> Postfix: {postfix3}") # Expected: ['5', '2', '3', '+', '*']

    expr4 = "((1 + 2) * 3) / 4"
    postfix4 = parse(expr4)
    print(f"Infix: {expr4} -> Postfix: {postfix4}") # Expected: ['1', '2', '+', '3', '*', '4', '/']
