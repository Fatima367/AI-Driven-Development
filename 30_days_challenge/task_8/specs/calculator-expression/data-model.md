# Data Model: Calculator with basic operations

## Entities

### Expression

- **Description**: A string representing a mathematical operation to be evaluated.
- **Attributes**:
    - `value`: string (The raw input string, e.g., "1 + 2 * (3 - 4)")
- **Validation Rules**:
    - Must not be empty.
    - Must contain only allowed characters (numbers, operators +, -, *, /, parentheses).
    - Must represent a syntactically valid mathematical expression.

### Result

- **Description**: A numerical outcome of the evaluated mathematical expression.
- **Attributes**:
    - `value`: number (The computed numerical result, e.g., 5.0)
- **Validation Rules**:
    - Must be a valid numerical value.

## Relationships

- An `Expression` is evaluated to produce a `Result`.

## State Transitions

- An `Expression` can be in a `pending` state (before evaluation) or an `evaluated` state (after evaluation).
- If evaluation fails, the `Expression` leads to an `error` state.
