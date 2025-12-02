# Quickstart: Calculator with basic operations

This guide provides instructions to quickly get started with the calculator application.

## Prerequisites

- Python 3.9 or higher installed on your system.
- `pip` for installing Python packages.

## Installation

1.  **Clone the repository**:
    ```bash
    git clone [repository_url]
    cd [repository_name]
    ```
2.  **Install dependencies**:
    ```bash
    pip install -r requirements.txt
    ```

## Usage

The calculator is a command-line interface (CLI) application.

### Evaluate an expression

To evaluate a mathematical expression, use the `calculator eval` command followed by the expression string.

```bash
python -m calculator eval "1 + 2 * (3 - 4)"
```

**Expected output (for the example above)**:

```
-3.0
```

### Examples

-   **Addition**:
    ```bash
    python -m calculator eval "10 + 5"
    ```
    Output: `15.0`

-   **Subtraction**:
    ```bash
    python -m calculator eval "20 - 7"
    ```
    Output: `13.0`

-   **Multiplication**:
    ```bash
    python -m calculator eval "6 * 3"
    ```
    Output: `18.0`

-   **Division**:
    ```bash
    python -m calculator eval "100 / 4"
    ```
    Output: `25.0`

-   **With parentheses**:
    ```bash
    python -m calculator eval "(5 + 3) * 2"
    ```
    Output: `16.0`

### Error Handling Examples

-   **Invalid expression**:
    ```bash
    python -m calculator eval "1 + a"
    ```
    Output: `Error: Invalid expression syntax`

-   **Division by zero**:
    ```bash
    python -m calculator eval "10 / 0"
    ```
    Output: `Error: Division by zero`
