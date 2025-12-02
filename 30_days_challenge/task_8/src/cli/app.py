# src/cli/app.py

import argparse
import sys
from calculator.main import calculate

def main():
    parser = argparse.ArgumentParser(description="A simple command-line calculator.")
    parser.add_argument("command", help="The command to execute (e.g., 'eval').")
    parser.add_argument("expression", nargs='?', help="The mathematical expression to evaluate.")

    args = parser.parse_args()

    if args.command == "eval":
        if args.expression is None:
            print("Error: 'eval' command requires an expression.", file=sys.stderr)
            sys.exit(1)
        
        try:
            result = calculate(args.expression)
            print(result)
            sys.exit(0)
        except (ValueError, ZeroDivisionError) as e:
            print(f"Error: {e}", file=sys.stderr)
            sys.exit(1)
        except Exception as e:
            print(f"An unexpected error occurred: {e}", file=sys.stderr)
            sys.exit(1)
    else:
        print(f"Error: Unknown command '{args.command}'.", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
