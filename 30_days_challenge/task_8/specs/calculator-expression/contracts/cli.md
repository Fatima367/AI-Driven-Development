# CLI Contract: Calculator

## Endpoint: `calculator eval`

### Description

Evaluates a mathematical expression provided as a string argument and prints the result to standard output.

### Request (Input)

- **Command**: `calculator eval <expression_string>`
- **Arguments**:
    - `<expression_string>` (required, string): The mathematical expression to be evaluated.
      - **Format**: Expected to contain numbers, operators (+, -, *, /), and parentheses. Spaces are allowed.
      - **Example**: `"1 + 2 * (3 - 4)"`

### Response (Output)

#### Success

- **Standard Output (stdout)**:
    - A single floating-point number representing the result of the evaluation.
    - **Example**: `-3.0` (for input `"1 + 2 * (3 - 4)"`)

#### Error

- **Standard Error (stderr)**:
    - An error message indicating the nature of the failure.
    - **Example (invalid expression)**: `Error: Invalid expression syntax`
    - **Example (division by zero)**: `Error: Division by zero`
- **Exit Code**:
    - Non-zero exit code to indicate an error.
    - **Example**: `1`
