# What is Speckit Plus?
**Speckit Plus** is an advanced, structured framework designed for *Spec Driven Development*. It is designed to guide learners and developers through a clear, systematic approach to standardize the interaction between a developer (or user) and an *AI coding assistant* or *Large Language Model (LLM)*, improving the efficiency and reliability of AI-assisted coding tasks. It expands on the foundational SPECKit methodology by adding some more features. It guides the user through a sequential, five-phase process—from setting the initial system rules (Constitution) to final code implementation, to ensure clarity, consistency, and traceability in the AI's generated output.

## 5 Core Concepts Of Speckit Plus
The five concepts are commands/prompts that break down the software development process into distinct, manageable stages for an AI agent.

### 1. /constitution
*Defines Global Rules and Quality Standards*
This command is used to define the global rules, constraints for a project before any specific development task begins. It dictates the coding style (e.g., must include docstrings, use snake_case), tech stack, and overall code quality expectations. 
It acts as the foundational *Rule Book* on which all decisions are made, ensuring clarity and direction.

### 2. /specify
*Complete Specifications*
This phase focuses on outlining exact system requirements and scope of the current task or feature.The user provides the AI with crystal-clear requirements that AI can build from. Here we translate the problem into clear specifications—inputs, outputs, data needs, performance expectations, and limitations, user stories, acceptance criteria and precise input regarding what the final product must achieve. It defines the desired outcome.


### 3. /plan
*Architecture Decisions*
After receiving the specification, this command instructs the AI to develop a high-level, step-by-step strategic roadmap of architecture and implementation strategy. It outlines the necessary components, the order of operations, dependency management, and the overall architectural approach before writing any actual code. It determines the strategy.

### 4. /tasks
*Atomic Work Units and Checkpoints*
This concept involves breaking down the high-level plan into smaller, executable sub-tasks. Each task must be small enough to be completed independently by the AI or a human without losing context and has a clear objective, responsibility, and expected outcome. This makes progress trackable, manageable, easier to debug and execute collaboratively or individually.

### 5. /implement
*Execute Tasks with AI Collaboration*
This is the execution phase where the AI, generates the actual source code of the project. This command triggers the AI to work through the list of tasks one-by-one, ensuring alignment with all previously set rules and requirements. It is the phase where the actual building happens. Code is written and the planned tasks are carried out. This stage transforms the structured plan into a functional, testable, and deployable solution.