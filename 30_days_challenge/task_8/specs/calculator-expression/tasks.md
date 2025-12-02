---
description: "Task list for Calculator with basic operations feature implementation"
---

# Tasks: Calculator with basic operations

**Input**: Design documents from `/specs/calculator-expression/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: This plan assumes a TDD approach as recommended by the project constitution.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- Paths shown below assume single project as per plan.md structure

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Create project directory `src/calculator/`
- [X] T002 Create project directory `src/cli/`
- [X] T003 Create project directory `src/lib/`
- [X] T004 Create project directory `tests/unit/`
- [X] T005 Create project directory `tests/integration/`
- [X] T006 Create `requirements.txt` with `pytest` at project root
- [X] T007 Initialize Python package structure with `__init__.py` files in `src/calculator/`, `src/cli/`, `src/lib/`, `tests/unit/`, `tests/integration/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

Currently, no specific foundational tasks are identified beyond the initial setup, as the feature is self-contained.

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Evaluate Basic Arithmetic (Priority: P1) 🎯 MVP

**Goal**: Enable the calculator to evaluate valid basic arithmetic expressions and handle errors.

**Independent Test**: Use the `calculator eval` command with an expression and verify the output as described in `specs/calculator-expression/contracts/cli.md`.

### Tests for User Story 1

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T008 [P] [US1] Unit test for expression parsing `tests/unit/test_parser.py`
- [X] T009 [P] [US1] Unit test for expression evaluation `tests/unit/test_evaluator.py`
- [X] T010 [P] [US1] Unit test for error handling (invalid syntax) `tests/unit/test_error_handling.py`
- [X] T011 [P] [US1] Unit test for error handling (division by zero) `tests/unit/test_error_handling.py`
- [X] T012 [US1] Integration test for CLI `tests/integration/test_cli.py`

### Implementation for User Story 1

- [X] T013 [P] [US1] Implement expression parser (e.g., Shunting-yard algorithm) in `src/calculator/parser.py`
- [X] T014 [P] [US1] Implement expression evaluator in `src/calculator/evaluator.py`
- [X] T015 [US1] Implement main calculator logic in `src/calculator/main.py`
- [X] T016 [US1] Implement CLI command `calculator eval` in `src/cli/app.py`
- [X] T017 [US1] Integrate parser, evaluator, and error handling in `src/cli/app.py`
- [X] T018 [US1] Add entry point for CLI application (e.g., `pyproject.toml` or `setup.py` configuration)

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T019 [P] Update `README.md` with usage instructions from `specs/calculator-expression/quickstart.md`
- [X] T020 [P] Add comments and docstrings to core calculator logic `src/calculator/*.py`
- [X] T021 Code cleanup and refactoring across the project
- [X] T022 Verify constitution compliance (e.g., modularity, error handling, test coverage)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: No specific tasks, but implicitly dependent on Setup completion.
- **User Stories (Phase 3+)**: All depend on Setup completion.
- **Polish (Final Phase)**: Depends on all desired user stories being complete.

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Setup. No dependencies on other stories.

### Within Each User Story

- Tests MUST be written and FAIL before implementation.
- Parser and Evaluator implementation can run in parallel.
- CLI implementation depends on parser and evaluator.
- Core calculator logic in `src/calculator/main.py` depends on parser and evaluator.

### Parallel Opportunities

- All Setup tasks T001-T005 are largely independent for directory creation. T006 and T007 are sequential after directories are ready.
- Within User Story 1, tasks T008-T011 (unit tests for parser, evaluator, error handling) can run in parallel.
- Tasks T013 and T014 (parser and evaluator implementation) can run in parallel.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1.  Complete Phase 1: Setup
2.  Complete Phase 3: User Story 1
3.  **STOP and VALIDATE**: Test User Story 1 independently.
4.  Deploy/demo if ready.

### Incremental Delivery

1.  Complete Setup → Project structure and basic environment ready.
2.  Complete User Story 1 → Test independently → Deploy/Demo (MVP!)
3.  Continue with Polish phase.

### Parallel Team Strategy

With multiple developers:

1.  Team completes Setup together.
2.  Once Setup is done:
    -   Developer A: Focus on parsing and evaluation (T008, T009, T010, T011, T013, T014, T015).
    -   Developer B: Focus on CLI integration (T012, T016, T017, T018).
3.  Integrate work after parsing/evaluation and CLI components are developed.

---

## Notes

-   [P] tasks = different files, no dependencies
-   [Story] label maps task to specific user story for traceability
-   Each user story should be independently completable and testable
-   Verify tests fail before implementing
-   Commit after each task or logical group
-   Stop at any checkpoint to validate story independently
-   Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
