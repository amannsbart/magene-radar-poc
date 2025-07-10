# Circle of Light Landing Page

## Overview

This is a PoC repo for connecting to the Magene L508 Backlight radar via the Web Bluetooth standard.

## Tech Stack

- **Framework** - [Next.js 15 (App Router)](https://nextjs.org)
- **Language** - [TypeScript](https://www.typescriptlang.org)
- **Package Management** - [bun](https://bun.sh)
- **Deployment** - [Vercel](https://vercel.com/docs/concepts/next.js/overview)
- **Styling** - [Tailwind CSS](https://tailwindcss.com)
- **Components** - [Shadcn UI](https://ui.shadcn.com/)
- **Icons** - [Lucide](https://lucide.dev)
- **Formatting** - [Prettier](https://prettier.io)
- **Linting** - [ESLint](https://eslint.org/)

## Structure

### File Structure

```
/magene-radar-poc
├── app                      # Core application structure
├── config                   # Global configuration files
├── lib                      # Utility & logic functions
│   ├── components           # UI components for the application
│   │   └── ui               # General UI components (e.g., buttons, modals) based on shadcns
│   └── utils                # General utility functions
└── public                   # Static assets such as favicons etc.
```

### Naming Conventions

This project follows consistent naming conventions to maintain code readability and organization:

- **Files and Folders**: Use **kebab-case** for file and folder names (e.g., `user-profile.tsx`, `dashboard-overview`). This includes component files to keep a uniform naming scheme across the project.
- **Components**: While component files are named in **kebab-case**, the components themselves are written in **PascalCase** (e.g., `NavBar`, `UserCard`). This makes it easier to distinguish components in the codebase.
- **Variables and Functions**: Use **camelCase** for variable and function names (e.g., `handleSubmit`, `userData`). This is a common convention in JavaScript and TypeScript to improve readability.

### Naming Conventions

All branches, commit messages, issues, and pull requests should follow a consistent format based on the type of change being made. This helps maintainers and contributors quickly understand the purpose of each item.

#### Types

- **`bug(fix)`** – Fixes a bug.
- **`chore`** – Maintenance tasks like updating dependencies.
- **`ci`** – Changes to CI/CD configuration.
- **`docs`** – Documentation changes.
- **`feat`** – Introduces a new feature.
- **`refactor`** – Code changes that neither fix a bug nor add a feature.
- **`test`** – Adding or updating tests.
- **`wip`** - Used for changes on working branches which are still in development.

#### Issue naming format

Each issue should include the appropriate category tag followed by a concise description of the issue. In the issue description you can include additional context like a reference to a specific component.

#### Branch naming format

- **`main` branch**: This is the production-ready branch. Only thoroughly tested and reviewed code is merged here. All production deployments are made from `main`.
- **`develop` branch**: Serves as the integration branch where features and bug fixes are merged before being merged to `main`.
- **Working branches**: Branches created from `develop` and merged back after completion.
  - Naming convention: `[type]/[issue-number]-[description]`
  - Example: `feat/123-add-user-auth`

#### Commit message & pull request naming format

Naming should follow this format:

- Naming convention: `[type]: [description]`
- Example: `feat: 123-add-user-auth`

#### Writing Commit Messages & PR messages

- Use **present imperative tense** (e.g., "Add feature" instead of "Added feature").
- Keep the **subject line** (the first line) to 50 characters or less.
- Use a the comment section for detailed descriptions.

## Developement

### Branch Protection Rules

To maintain high code quality:

- All merges to `main` or `develop` must go through Pull Requests.
- PRs must pass:
  - Linting and formatting checks
  - Automated testing (CI/CD pipelines)
  - Code review by at least one other developer

### Workflow

1. **Create an issue:**
   - Open an issue/sub-issue and make sure to use the right issue type.

2. **Create a working branch:**

- Create a branch from `develop` and make sure to use the right prefix such as `feat/7421-add-auth`.

3. **Develop and Test Locally:**
   - Implement your changes on the branch.
   - Run all relevant tests & linting locally to ensure functionality.

4. **Commit Changes:**
   - After reviewing your changes commit any necessary updates with meaningful well-formatted commit messages using prefix wip: (Work In Progress) to indicate that the changes are still being developed.

5. **Rebase the Branch:**
   - Before opening a Pull Request (PR), ensure your branch is up-to-date with the latest changes from `develop` by rebasing:

```

     git fetch origin
     git rebase origin/develop

```

- Resolve any conflicts that arise during the rebase.

6. **Open a Pull Request:**

- Push your branch and open a PR to merge it into `develop`.
- Ensure the PR message is prefixed with the appropriate prefix (e.g. feat: for features).
- Include a link to the relevant issue in the PR description.

7. **Code Review & CI Checks:**

- Ensure that your PR passes all Continuous Integration (CI) checks, including unit tests, integration tests, and linting.
- Address any feedback provided during the code review process.

8. **Merge & Clean Up:**

- Once your PR is approved, squash and merge your branch into `develop`.
- Delete the feature branch to keep the repository clean.

### Continuous Deployment (CD)

- **Deployment**: Production deployment occurs automatically from the `main` branch (e.g., via Vercel). Also preview environments from the `develop` branch and every PR branch are provided for testing and quality assurance.

## Local Setup

To set up the project for local development, follow these steps:

### Prerequisites

Ensure you have the following installed on your machine:

- [VSCode](https://code.visualstudio.com)
- [Node.js](https://nodejs.org/en/) (LTS version recommended)
- [bun](https://bun.sh/) (package manager installed globally)

### Setup Instructions

1. **Clone the Repository**
   Start by cloning the repository:

```

git clone https://github.com/REPOSITORY
cd your-repo-directory

```

2. **Install Dependencies**
   After cloning the repository, install the required dependencies:

```bash
bun install
```

3. **Switch to the Development Branch**  
   Once you have installed all dependencies switch to the `develop` branch:

   ```
   git checkout develop
   ```

4. **Create a Feature Branch**  
   Create a feature branch from the `develop` branch to encapsulate your changes:

   ```
   git checkout -b feat/your-feature-name
   ```

5. **Install Dependencies and Start the Development Server**  
   Run the following commands to install the necessary dependencies and start the local development server:

   ```
   bun install
   bun dev
   ```

6. **Access the Application**  
   Once the server is running, you can access the application at [http://localhost:3000](http://localhost:3000).

You are now ready to start developing locally!

## License

This project is licensed under the GNU GPL V3 - see the [LICENSE.md](LICENSE.md) file for details.

## Contact

For questions or support, please contact [alexander.mannsbart@proton.me](mailto:alexander.mannsbart@proton.me).
