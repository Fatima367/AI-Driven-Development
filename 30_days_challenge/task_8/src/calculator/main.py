# src/calculator/main.py

from .evaluator import evaluate

def calculate(expression_string):
    """
    Main function to calculate a mathematical expression.
    Handles parsing, evaluation, and potential errors.
    """
    try:
        result = evaluate(expression_string)
        return result
    except (ValueError, ZeroDivisionError) as e:
        # Re-raise the exception or return an error message depending on desired interface
        raise e
    except Exception as e:
        # Catch any other unexpected errors during calculation
        raise ValueError(f"An unexpected error occurred: {e}")

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
            result = calculate(expr)
            print(f"Expression: '{expr}', Result: {result}, Expected: {expected}, Pass: {result == expected}")
        except Exception as e:
            print(f"Expression: '{expr}', Error: {e}")

    # Test error cases
    error_expressions = [
        "10 / 0",
        "1 + + 2",
        "(1 + 2",
        "abc"
    ]

    for expr in error_expressions:
        try:
            calculate(expr)
        except (ValueError, ZeroDivisionError) as e:
            print(f"Error test for '{expr}': {e}")
