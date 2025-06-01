# Cosmic.ts ✨

<p align="left">
  <img src="logo.png" alt="Cosmic.ts Logo" width="200"/>
</p>

A Typescript Multi-Repo Framework For Next.Js With A Structured Approach To Managing Multiple Projects In Clusters.

## Table of Contents 📚

- [Project Overview](#project-overview) 🚀
- [Features](#features) 💡
- [Technologies Used](#technologies-used) 🛠️
- [Project Structure](#project-structure) 🏗️
- [Getting Started](#getting-started) 🏁
    - [Prerequisites](#prerequisites) ✅
    - [Installation](#installation) 📦
    - [Environment Variables](#environment-variables) 🔑
    - [Running the Application](#running-the-application) ▶️
- [Database Setup](#database-setup) 🗄️
- [Authentication Flow](#authentication-flow) 🔒
- [Data Management](#data-management) 📊
- [Configuration](#configuration) ⚙️
    - [ESLint](#eslint) 🧹
    - [Next.js](#nextjs) 🌐
    - [Tailwind CSS](#tailwind-css) 🎨
    - [TypeScript](#typescript) 📝
- [Scripts](#scripts) 📜
- [Docker](#docker) 🐳
- [Runtime Configuration](#runtime-configuration) 🖥️
- [Customization and Important Considerations](#customization-and-important-considerations) ⚠️
- [Contributing](#contributing) 🤝
- [License](#license) 📄

---

## Project Overview 🚀

Cosmic.ts is a robust, TypeScript-first monorepo framework meticulously engineered to streamline the development and management of multiple Next.js applications within a single, cohesive repository.
**It serves as a production-grade boilerplate, designed to be cloned and adapted to your specific project needs.** It's built for scalability and maintainability, making it ideal for complex web
applications, micro-frontends, or projects requiring distinct, yet interconnected, services. By leveraging [TurboRepo](https://turborepo.org/) for efficient monorepo management and
[Drizzle ORM](https://orm.drizzle.team/) with SQLite for type-safe database operations, Cosmic.ts provides a structured environment that promotes code reusability, simplifies dependency management,
and enhances developer collaboration. The framework introduces a unique "cluster" concept, allowing developers to logically group and manage related projects, fostering a modular and organized
codebase.

---

## Features 💡

- **Monorepo Architecture:** Built with [TurboRepo](https://turborepo.org/) to efficiently manage multiple Next.js projects and shared configurations within a single repository. This approach
  optimizes build times, simplifies dependency management, and promotes code sharing across projects.
- **TypeScript First:** Developed entirely with TypeScript, ensuring strong type safety across the codebase. This enhances code quality, reduces runtime errors, improves maintainability, and provides
  a superior developer experience with intelligent autocompletion and refactoring capabilities.
- **Next.js Framework:** Utilizes [Next.js](https://nextjs.org/) for building powerful React applications. Benefits include server-side rendering (SSR), static site generation (SSG), API routes, and
  optimized performance, making it suitable for modern web development.
- **Drizzle ORM:** Integrates [Drizzle ORM](https://orm.drizzle.team/) for type-safe and performant database interactions. Paired with SQLite for local development and testing (easily extendable to
  PostgreSQL, MySQL, etc., for production), Drizzle provides a seamless and intuitive way to define schemas and perform queries.
- **NextAuth.js:** Implements [NextAuth.js](https://next-auth.js.org/) (v5 beta) as a flexible and secure authentication solution. It supports various authentication providers (e.g., Google,
  credentials) and handles session management, ensuring robust user authentication and authorization.
- **Zustand & Tanstack Query:** Employs [Zustand](https://zustand-demo.pmnd.rs/) for lightweight global state management and [Tanstack Query](https://tanstack.com/query/latest) (React Query) for
  efficient server-state management and data fetching. This combination ensures optimal performance and a streamlined data flow within the applications.
- **Framer Motion:** Incorporates [Framer Motion](https://www.framer.com/motion/) for declarative and fluid animations. This library simplifies the creation of smooth UI/UX transitions and interactive
  elements, enhancing the overall user experience.
- **Shared Configurations:** Centralizes configurations for essential development tools like ESLint, Next.js, Tailwind CSS, and TypeScript within dedicated internal packages. This ensures consistency
  in code style, build processes, and development environments across all projects in the monorepo.
- **Docker Support:** Includes a `dockerfile` for containerizing the application, providing a consistent and isolated development and deployment environment. This simplifies setup and ensures that the
  application runs uniformly across different machines.
- **Structured Project Organization ("Clusters"):** Introduces a unique "cluster" concept, allowing for logical grouping of related projects. This promotes modularity, enables independent development
  and deployment of sub-projects, and facilitates domain-driven design within a large application landscape.

---

## Technologies Used 🛠️

- **Next.js** (React Framework): For building server-rendered React applications and API routes.
- **TypeScript**: For type-safe JavaScript, improving code quality and developer tooling.
- **TurboRepo** (Monorepo Tool): For fast, incremental builds and efficient task management across multiple packages in the monorepo.
- **Drizzle ORM** (Type-safe ORM): For interacting with databases in a type-safe and efficient manner.
- **SQLite** (Database): A lightweight, file-based database used for local development and testing with Drizzle ORM.
- **NextAuth.js** (Authentication): A complete open-source authentication solution for Next.js applications.
- **Zustand** (State Management): A small, fast, and scalable bear-bones state-management solution.
- **Tanstack Query** (Data Fetching): For managing, caching, and synchronizing server state in React applications.
- **Framer Motion** (Animations): A production-ready motion library for React.
- **Tailwind CSS** (Utility-first CSS Framework): For rapidly building custom designs with utility classes.
- **ESLint** (Code Linting): For identifying and reporting on patterns found in JavaScript/TypeScript code, ensuring code quality and consistency.
- **Prettier** (Code Formatting): An opinionated code formatter that enforces a consistent style across the codebase.
- **Zod** (Schema Validation): A TypeScript-first schema declaration and validation library.
- **Docker** (Containerization): For packaging applications and their dependencies into isolated containers.
- **Yarn** (Package Manager): Used for managing project dependencies and workspaces.

---

## Project Structure 🏗️

Cosmic.ts is meticulously structured as a monorepo, designed to facilitate efficient management of shared code, configurations, and multiple independent applications. The architecture is organized to
promote modularity, scalability, and clear separation of concerns.

- `config/`: This directory is a dedicated workspace for shared configurations, acting as a central hub for consistent tooling across the entire monorepo.
    - `config/eslint/`: Contains reusable ESLint configurations (`base.js`, `next.js`, `react-internal.js`) that enforce consistent code style and identify potential issues across all TypeScript and
      Next.js projects.
    - `config/next/`: Houses shared Next.js configurations (`index.ts`, `tsconfig.json`) that define common Next.js settings and TypeScript compiler options for Next.js applications within the
      monorepo.
    - `config/tailwind-config/`: Manages core Tailwind CSS configurations (`postcss.config.js`, `shared-styles.css`) and PostCSS settings, ensuring a unified design system.
    - `config/tailwindcss/`: Provides additional Tailwind CSS configurations (`styles.css`, `tsconfig.json`) that might extend or specialize the base Tailwind setup.
    - `config/typescript/`: Defines foundational TypeScript configurations (`base.json`, `nextjs.json`, `react-library.json`) that ensure consistent type checking and compilation settings across
      different types of projects.
- `source/`: This is the primary directory for all application-specific code.
    - `source/__main__/`: Represents the core, primary Next.js application. This application typically serves as the main entry point or a central hub, potentially integrating functionalities from
      various clusters.
        - `source/__main__/auth.ts`: Configures [NextAuth.js](https://next-auth.js.org/), defining authentication providers (Google, GitHub, Discord), session management, and integration with Drizzle
          ORM for database persistence.
        - `source/__main__/drizzle/`: Contains the database schema (`schema.ts`) defined using [Drizzle ORM](https://orm.drizzle.team/) and manages database migrations. The `index.ts` file initializes
          the Drizzle client with `better-sqlite3` for SQLite.
        - `source/__main__/middleware.ts`: Implements Next.js middleware using NextAuth.js to protect routes (e.g., `/private`) and handle authentication redirects, ensuring secure access control.
        - `source/__main__/public/`: Stores static assets like `logo.png`, `favicon.ico`, `apple-touch-icon.png`, and web manifest files (`site.webmanifest`), which are served directly by Next.js.
        - `source/__main__/scripts/`: Holds application-specific development (`dev.js`) and production start (`start.js`) scripts. `dev.js` specifically starts the Next.js development server with
          Turbopack and handles URL rewriting for base paths.
        - `source/__main__/src/app/`: Adheres to the Next.js App Router structure, containing core application pages, layouts, and API routes.
            - `source/__main__/src/app/layout.tsx`: The root layout for the main application, importing global styles, setting metadata (SEO, PWA icons), and wrapping the application with
              `AppProviders`.
            - `source/__main__/src/app/page.tsx`: The main landing page, which is a client-side component handling user authentication (sign-in with Google, GitHub, Discord) using NextAuth.js,
              displaying loading/error states, and redirecting authenticated users to `/private`. It heavily uses Framer Motion for animations and Tailwind CSS for styling.
            - `source/__main__/src/app/error.tsx`: Defines the error boundary for the application.
            - `source/__main__/src/app/not-found.tsx`: Custom 404 page.
            - `source/__main__/src/app/api/`: Contains Next.js API routes, including the `[...nextauth]/route.ts` which re-exports NextAuth.js handlers.
            - `source/__main__/src/app/private/`: Contains protected routes accessible only to authenticated users.
            - `source/__main__/src/app/public/`: Contains public-facing routes.
        - `source/__main__/src/providers/`: Contains React context providers (`index.tsx`) that wrap the application to provide global state (e.g., authentication context from NextAuth.js, data
          fetching context from Tanstack Query, global Zustand stores).
        - `source/__main__/src/styles/`: Includes global CSS styles (`globals.css`) that apply across the entire main application.
        - `source/__main__/src/utils/`: Houses utility functions.
            - `source/__main__/src/utils/CorsHeaders.ts`: Provides functions (`setCorsHeaders`, `handleCorsPreflight`) for managing Cross-Origin Resource Sharing (CORS), dynamically allowing origins
              based on `NEXT_PUBLIC_CONNECT_PEERS`.
            - `source/__main__/src/utils/dynamicEnv.ts`: Loads public environment variables like `NEXT_PUBLIC_CONNECT_PEERS` and `NEXT_PUBLIC_BASE_PORT`, crucial for inter-service communication and
              routing.
    - `source/clusters/`: This directory is the cornerstone of the "cluster" concept, enabling logical grouping and independent management of related Next.js projects. Each cluster can represent a
      distinct domain, micro-frontend, or a separate team's responsibility, allowing for highly modular and scalable application development. Each project within a cluster is a self-contained Next.js
      application, mirroring the structure and capabilities of the `source/__main__` application, but designed to operate under a specific base path.
        - `source/clusters/cluster-1/`: An example of a cluster, which might contain projects related to a specific business domain or feature set.
            - `source/clusters/cluster-1/project-1/`: An independent Next.js project residing within `cluster-1`. These projects are self-contained but can leverage shared configurations and utilities
              from the monorepo. Its `package.json` confirms it has its own scripts and dependencies, similar to the main app.
            - `source/clusters/cluster-1/project-2/`: Another independent Next.js project within `cluster-1`, demonstrating how multiple projects can coexist and be managed within a single cluster.
        - `source/clusters/cluster-2/`: Another example cluster, showcasing the extensibility of the framework for additional project groupings.
            - `source/clusters/cluster-2/project-1/`: An independent Next.js project within `cluster-2`.
            - `source/clusters/cluster-2/project-2/`: Another independent Next.js project within `cluster-2`.
- `scripts/`: Contains root-level utility scripts that automate common development and maintenance tasks across the entire monorepo.
    - `scripts/clean.js`: A comprehensive cleanup script that recursively deletes `node_modules`, `.turbo` caches, `drizzle/meta` directories, and database files (`.db`, `.sql`) across the entire
      monorepo, ensuring a clean development environment.
    - `scripts/commit.js`: An advanced script that automates Git commit message generation using an AI model (OpenRouter API) based on staged file diffs, enforcing
      [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) and pushing changes. Requires `OPENROUTER_API_KEY`.
    - `scripts/setup.js`: A critical orchestration script that reads `cosmic.yaml` and dynamically generates `docker/supervisord.conf` (for process management) and `docker/nginx.conf` (for reverse
      proxy routing) based on the defined `BASE` and `CLUSTERS` configurations.
    - `scripts/update.js`: Recursively finds all `package.json` files within projects (excluding `node_modules`, `.turbo`, `.git`) and executes `yarn upgrade --latest --force` to update all project
      dependencies to their latest versions.
- `dockerfile`: Defines the Docker image for the application, setting up the environment, installing dependencies, and preparing the application for containerized execution, often leveraging the
  generated `supervisord.conf` and `nginx.conf`.
- `turbo.json`: The configuration file for [TurboRepo](https://turborepo.org/), detailing how tasks (`build`, `lint`, `dev`, `start`, `check-types`) are run, cached, and depend on each other across
  the monorepo workspaces. It also defines global environment variables that are passed to all tasks.
- `package.json`: The root package file, defining the monorepo's workspaces (`config/*`, `source/__main__`, `source/clusters/**`), global scripts, and overall project metadata.

---

## Getting Started 🏁

Follow these comprehensive steps to set up and run the Cosmic.ts project locally.

### Prerequisites ✅

- **Node.js (>=18):** Ensure you have a compatible Node.js version installed. You can use a version manager like `nvm` for easy switching.
- **Yarn (v1.22.22 or later):** Cosmic.ts uses Yarn as its package manager, specifically for its workspace capabilities.
- **Docker (optional):** Recommended for consistent development and deployment environments, especially if you plan to containerize your applications.

### Installation 📦

1.  **Clone the repository:** Begin by cloning the Cosmic.ts repository to your local machine:
    ```bash
    git clone https://github.com/ShovitDutta/Cosmic.ts.git
    cd Cosmic.ts
    ```
2.  **Install dependencies:** Cosmic.ts leverages Yarn workspaces to manage dependencies across all projects and shared configurations within the monorepo. Install all required packages by running:
    ```bash
    yarn install
    ```
    This command will hoist common dependencies to the root `node_modules` and link workspace packages, optimizing disk space and installation time.
3.  **Setup the project:** The `yarn setup` script is crucial for initializing the project's runtime environment. It reads the `cosmic.yaml` configuration (which you need to create based on the
    example provided in the [Runtime Configuration](#runtime-configuration) section) and dynamically generates `supervisord.conf` and `nginx.conf` files within the `docker/` directory. These files are
    essential for orchestrating the various applications and services within the Docker container.

    Execute the setup script:

    ```bash
    yarn setup
    ```

    > **Important:** Ensure you have created your `cosmic.yaml` file before running `yarn setup`, as the script will fail if it's not found. This script ensures that your local environment is ready
    > for development and containerization.

### Environment Variables 🔑

Environment variables are crucial for configuring different aspects of the application, especially sensitive information like API keys and database connections. Create a `.env` file in the
`source/__main__/` directory. If individual projects within `source/clusters/` require specific environment variables, create `.env` files in their respective directories as well, based on their
`.env.example` counterparts.

For the main application (`source/__main__/.env.example`), you will typically need:

```env
DATABASE_URL="file:./sqlite.db" # Path to your SQLite database file
NEXTAUTH_SECRET="YOUR_NEXTAUTH_SECRET" # A secret key for NextAuth.js session encryption
NEXTAUTH_URL="http://localhost:3000" # The base URL for NextAuth.js callbacks
# Add other environment variables as needed, e.g., for external APIs, cloud service credentials, etc.
```

> **Important Security Note:** The `NEXTAUTH_SECRET` should be a strong, randomly generated string. **Never commit this secret directly to your version control.** You can generate a suitable secret
> using `openssl rand -base64 32` in your terminal.

### Running the Application ▶️

To start the main Next.js application in development mode:

```bash
yarn dev
```

This command, defined in the root `package.json` and configured by `turbo.json`, will orchestrate the following:

1.  **Prebuild Steps:** It will execute the `prebuild` script defined in `source/__main__/package.json`, which typically involves running Drizzle ORM migrations and schema generation
    (`drizzle-kit push` and `drizzle-kit generate`). This ensures your database schema is up-to-date before the application starts.
2.  **Start Development Server:** It will then start the Next.js development server for the `source/__main__` application.

You can access the main application in your browser at `http://localhost:3000` (or the port configured by the `NEXT_PUBLIC_BASE_PORT` environment variable if it's set differently in your `.env` file
or `cosmic.yaml`).

To run other projects located within the `source/clusters/` directories, you can either navigate to their respective project directories and use their `dev` scripts (if available), or leverage
TurboRepo's filtering capabilities from the monorepo root.

For example, to run `project-1` in `cluster-1`:

```bash
cd source/clusters/cluster-1/project-1
yarn dev
```

Alternatively, from the monorepo root using TurboRepo's filtering:

```bash
turbo run dev --filter=cluster-1/project-1
```

This command tells TurboRepo to only run the `dev` script for the specified project, along with any of its dependencies.

---

## Database Setup 🗄️

Cosmic.ts utilizes [Drizzle ORM](https://orm.drizzle.team/) for its database interactions, providing a type-safe and efficient way to manage your data. By default, it's configured to use SQLite, a
lightweight, file-based database, which is excellent for local development and testing.

- **Schema Definition:** The database schema is defined in `source/__main__/drizzle/schema.ts`. This file uses Drizzle's schema definition language to describe your database tables, relationships, and
  data types.
- **Migrations:** Drizzle migrations are managed automatically through predefined scripts. These migrations allow you to evolve your database schema over time without losing data.

To perform comprehensive database operations (push schema changes to the database, generate new migration files based on schema changes, and apply pending migrations):

```bash
yarn drizzle-things
```

This convenient script, defined in `source/__main__/package.json`, combines the following Drizzle Kit commands:

- `drizzle-kit push --config=drizzle.config.ts`: Synchronizes your schema with the database.
- `drizzle-kit generate --config=drizzle.config.ts`: Generates new migration files if there are changes in your `schema.ts`.
- `drizzle-kit migrate --config=drizzle.config.ts`: Applies any pending migration files to your database.

This `drizzle-things` script is also automatically executed as part of the `prebuild` script, which runs before `yarn dev`, ensuring your database is always in sync with your latest schema during
development.

---

## Authentication Flow 🔒

Cosmic.ts integrates [NextAuth.js](https://next-auth.js.org/) (v5 beta) to handle authentication. This provides a flexible and secure way to manage user sessions and integrate with various
authentication providers.

- **Configuration:** NextAuth.js configuration is typically found in `source/__main__/auth.ts` and `source/__main__/middleware.ts`. `auth.ts` defines the authentication providers (Google, GitHub,
  Discord), the Drizzle adapter for database persistence, and custom pages for authentication flows.
- **Providers:** The example `cosmic.yaml` shows configuration for Google authentication (`AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, `GOOGLE_AUTHORIZED_REDIRECT_URL`). You can extend this to include
  other providers or credential-based authentication.
- **Session Management:** NextAuth.js handles session creation, management, and validation, often storing session data in the database via `@auth/drizzle-adapter` as defined in
  `source/__main__/drizzle/schema.ts`.
- **Middleware:** The `middleware.ts` file uses NextAuth.js's `auth` handler as its middleware. Its `matcher` configuration (`/((?!api|_next/static|_next/image|favicon.ico).*)"`, `"/private/:path*"`)
  ensures that all application routes (except specific public assets and API routes) and explicitly protected `/private` routes require authentication, redirecting unauthenticated users to the sign-in
  page.

---

## Data Management 📊

The framework employs a combination of [Zustand](https://zustand-demo.pmnd.rs/) and [Tanstack Query](https://tanstack.com/query/latest) for efficient and scalable data management.

- **Zustand (Client State):** Used for lightweight, global client-side state management. It's ideal for managing UI states, user preferences, or any data that doesn't require persistent storage or
  complex caching logic. Zustand stores are simple to create and consume, promoting a clean and predictable state flow.
- **Tanstack Query (Server State):** Primarily used for managing, caching, and synchronizing server-side data. It simplifies data fetching, re-fetching, and invalidation, significantly reducing the
  boilerplate associated with asynchronous operations. Tanstack Query automatically handles caching, background updates, and error handling, providing a robust solution for interacting with API routes
  or external data sources.
- **Data Flow:** Typically, data is fetched from Next.js API routes (defined in `source/__main__/src/app/api/`) using Tanstack Query. This data can then be used directly in components or, if needed
  for global client-side interactions, stored in a Zustand store. The `AppProviders` in `source/__main__/src/app/layout.tsx` likely sets up the necessary contexts for these state management libraries.

---

## Configuration ⚙️

Cosmic.ts places a strong emphasis on centralized and reusable configurations, located within the `config/` workspace. This approach ensures consistency, reduces duplication, and simplifies
maintenance across all projects in the monorepo. Each configuration package is consumed by individual projects via `@cosmic/` scoped imports.

### ESLint 🧹

Shared ESLint configurations are located in `config/eslint/`. These configurations are designed to enforce consistent code style, identify potential errors, and maintain high code quality standards
across all TypeScript and Next.js projects within the monorepo.

- `base.js`: Defines the fundamental ESLint rules applicable to all TypeScript and JavaScript files, integrating `typescript-eslint`, `eslint-config-prettier`, and `eslint-plugin-turbo` (with
  `turbo/no-undeclared-env-vars` warning). It also uses `eslint-plugin-only-warn` to downgrade all errors to warnings, allowing builds to pass while still providing linting feedback.
- `next.js`: Extends the base configuration with rules specifically tailored for Next.js applications, including best practices for Next.js components and API routes.
- `react-internal.js`: Provides ESLint rules for internal React components or libraries that might be shared across projects, ensuring consistent React coding patterns.

Projects consume these configurations by adding `@cosmic/eslint` to their `devDependencies` and extending the configuration in their `eslint.config.js`.

### Next.js 🌐

Shared Next.js configurations are managed in `config/next/`. This package centralizes common Next.js settings and TypeScript configurations specific to Next.js projects, ensuring a unified build and
development environment.

- `index.ts`: Contains the main `commonNextConfig` object. Notable settings include `eslint: { ignoreDuringBuilds: true }` and `typescript: { ignoreBuildErrors: true }`, which prevent linting and
  TypeScript errors from blocking the Next.js build process, relying on separate `yarn lint` and `yarn check-types` commands for error enforcement. It also configures `images.remotePatterns` to allow
  images from any HTTPS hostname.
- `tsconfig.json`: Provides a base TypeScript configuration specifically optimized for Next.js projects, ensuring correct compilation and type checking.

Projects integrate these configurations by importing from `@cosmic/next` in their `next.config.ts`.

### Tailwind CSS 🎨

Tailwind CSS configurations and shared styles are meticulously managed across `config/tailwind-config/` and `config/tailwindcss/`. This setup ensures a consistent design system and efficient
utility-first styling across the monorepo.

- `config/tailwind-config/postcss.config.js`: Defines PostCSS plugins and configurations, primarily including `@tailwindcss/postcss` for processing Tailwind CSS.
- `config/tailwind-config/shared-styles.css`: Contains common CSS styles that are shared across all projects, promoting design consistency.
- `config/tailwindcss/styles.css`: Provides additional, project-specific Tailwind styles or overrides.
- `config/tailwindcss/tsconfig.json`: TypeScript configuration for Tailwind-related files, ensuring proper type inference for utility classes.

Projects consume these configurations via `@cosmic/tailwindcss` and `@cosmic/tailwind-config` imports.

### TypeScript 📝

Base TypeScript configurations are defined in `config/typescript/`. These configurations provide a consistent and robust TypeScript environment across all packages and applications in the monorepo.

- `base.json`: Contains fundamental TypeScript compiler options applicable to all TypeScript files, enforcing strict type checking (`"strict": true`), modern target (`"ES2022"`), and module resolution
  (`"NodeNext"`). It also enables declaration file generation (`"declaration": true`) and isolated module compilation (`"isolatedModules": true`).
- `nextjs.json`: Extends the base configuration with settings specifically optimized for Next.js projects.
- `react-library.json`: Provides TypeScript settings tailored for React libraries or components that are intended for reuse.

Projects extend these configurations in their `tsconfig.json` files by referencing `@cosmic/typescript`.

---

## Scripts 📜

The project includes a comprehensive set of utility scripts at both the root level and within the main application, designed to automate common development, build, and maintenance tasks.

### Root-level Scripts (defined in `package.json`)

These scripts leverage TurboRepo to operate across the entire monorepo or perform global tasks.

- `yarn format`: Executes `prettier --write "**/*.{ts,tsx,md}"` to automatically format all TypeScript, TSX, and Markdown files, ensuring consistent code style across the entire project.
- `yarn commit`: Runs `node scripts/commit.js`, an advanced script that automates Git commit message generation using an AI model (OpenRouter API) based on staged file diffs. It enforces
  [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) and automatically pushes changes. **Requires `OPENROUTER_API_KEY` environment variable.**
- `yarn update`: Executes `node scripts/update.js`, a custom script that recursively finds all `package.json` files within projects (excluding `node_modules`, `.turbo`, `.git`) and executes
  `yarn upgrade --latest --force` to update all project dependencies to their latest versions. This is a powerful tool for monorepo dependency management.
- `yarn clean`: Runs `node scripts/clean.js`, a comprehensive cleanup script that recursively deletes `node_modules` directories, `.turbo` caches, `drizzle/meta` directories (Drizzle migration
  metadata), and database files (`.db`, `.sql`) across the entire monorepo, ensuring a clean development environment. It supports both Windows and Unix-like systems.
- `yarn setup`: Executes `node scripts/setup.js`, a critical orchestration script. It reads the `cosmic.yaml` configuration (which defines the main application and clustered projects) and dynamically
  generates `docker/supervisord.conf` (for process management within the Docker container) and `docker/nginx.conf` (for reverse proxy routing). This script is fundamental for setting up the
  multi-application runtime environment.
- `yarn check-types`: Runs `turbo run check-types`, which triggers TypeScript type checking (`tsc --noEmit`) across all relevant projects in the monorepo, ensuring type safety and catching potential
  errors early.
- `yarn build`: Executes `turbo run build`, initiating the optimized build process for all projects in the monorepo. TurboRepo intelligently rebuilds only changed packages and their dependents,
  significantly speeding up build times.
- `yarn start`: Runs `turbo run start`, designed to start all persistent services or applications within the monorepo, typically in a production-like environment.
- `yarn lint`: Executes `turbo run lint`, which runs ESLint across all projects in the monorepo, enforcing code quality and style guidelines.
- `yarn dev`: Runs `turbo run dev`, starting development servers for all projects configured for development, enabling hot-reloading and efficient local development.

### Docker Scripts (defined in `package.json`) 🐳

These scripts facilitate Docker-based development and deployment workflows, integrating with the generated `supervisord.conf` and `nginx.conf`.

- `yarn docker:start`: A composite command (`yarn docker:stop && yarn docker:build && yarn docker:publish`) that first stops any existing `cosmic.ts` Docker containers, then rebuilds the Docker image,
  and finally publishes (runs) the new container, making the application accessible.
- `yarn docker:publish`: Runs the `cosmic.ts` Docker image, mapping host port 8000 to container port 8000, making the application accessible via the Nginx reverse proxy.
- `yarn docker:build`: Builds the Docker image from the `dockerfile` in the root directory, tagging it as `cosmic.ts`.
- `yarn docker:prune`: Executes `docker system prune --all --force` to remove all stopped containers, unused networks, and dangling images, freeing up disk space and ensuring a clean Docker
  environment.
- `yarn docker:stop`: Removes the `cosmic.ts` Docker image, effectively stopping and cleaning up the running container.

### Main Application Scripts (`source/__main__/scripts/`)

These are specific scripts for the primary Next.js application, often called by the root `yarn dev` or `yarn start` commands.

- `node scripts/dev.js`: A custom script that directly starts the Next.js development server for the `source/__main__` application. It uses `next dev` with `--turbopack` for performance, sets the port
  using `NEXT_PUBLIC_BASE_PORT`, and includes logic to rewrite output URLs to correctly reflect `NEXT_PUBLIC_BASE_PATH` for subpath routing.
- `node scripts/start.js`: A custom script that starts the Next.js production server for the `source/__main__` application, usually after a successful build.

---

## Runtime Configuration 🖥️

Cosmic.ts is designed for flexible runtime configuration, primarily orchestrated through a conceptual `cosmic.yaml` file. This YAML structure defines how the main application (`BASE`) and various
clustered projects (`CLUSTERS`) are set up, including their network ports, execution commands, and crucial environment variables. This configuration is vital for managing complex deployments and
ensuring proper inter-service communication.

> **Note:** The `cosmic.yaml` file presented below is an _example configuration_ intended to illustrate the project's runtime setup. It is **not** a file that exists by default in the repository. You
> would typically create or adapt such a configuration based on your specific deployment environment (e.g., using a process manager like PM2, Docker Compose, Kubernetes, or a custom orchestration
> script that consumes this structure). The `yarn setup` script relies on this file to generate the necessary `supervisord.conf` and `nginx.conf` for Docker deployment.

Below is a detailed breakdown of the example `cosmic.yaml` configuration:

```yaml
HOST_PORT: 8000 # The main host port through which all applications (base and clusters) are exposed. This acts as a reverse proxy or gateway port for external access.
BASE: # Configuration for the primary, main application (source/__main__). This is the central application of the monorepo.
    - NAME: main # The logical name of the base application, used for internal referencing (e.g., in Nginx upstream blocks).
      PORT: 3000 # The internal port on which the main application runs within its container or local environment.
      COMMAND: /bin/sh -ec "yarn build && yarn start" # The shell command executed to build and start the main application. This command is managed by Supervisord in the Docker environment.
      ENVIRONMENT_VARIABLES: # Key-value pairs of environment variables specific to the main application.
          DATABASE_URL: "__main__.db" # Path to the SQLite database file for the main application.
          NEXT_PUBLIC_BASE_PORT: 3000 # Publicly accessible base port for Next.js, typically matching the internal PORT. Used by Next.js for client-side routing and asset loading.
          AUTH_TRUST_HOST: "true" # Required for NextAuth.js when deployed behind a proxy (like Nginx), ensuring correct callback URLs.
          AUTH_URL: "http://localhost:8000" # The public URL for NextAuth.js callbacks, using the HOST_PORT for external access.
          AUTH_SECRET: "--------------------------------------" # NextAuth.js secret for session encryption. **CRITICAL: REPLACE THIS WITH A STRONG, UNIQUE SECRET IN PRODUCTION!**
          AUTH_GOOGLE_ID: "--------------------------------------" # Google OAuth Client ID for authentication. **REPLACE WITH YOUR ACTUAL ID!**
          AUTH_GOOGLE_SECRET: "--------------------------------------" # Google OAuth Client Secret. **REPLACE WITH YOUR ACTUAL SECRET!**
          GOOGLE_AUTHORIZED_REDIRECT_URL: "http://localhost:3000/api/auth/callback/google" # Google OAuth redirect URL for the main app, using its internal port.
          CONNECT_PEERS: "http://localhost:3000,http://localhost:4001,http://localhost:4002,http://localhost:5001,http://localhost:5002" # Comma-separated list of all application URLs (main and clusters) for inter-service communication, used by CORS headers.
CLUSTERS: # Configuration for the clustered projects. Each cluster can contain multiple independent Next.js applications.
    - NAME: cluster-1 # Logical name for the first cluster.
      PROJECTS: # List of projects within cluster-1.
          - NAME: project-1 # Logical name for project-1 within cluster-1.
            PORT: 4001 # Internal port for cluster-1/project-1.
            COMMAND: /bin/sh -ec "yarn build && yarn start" # Command to build and start project-1.
            ENVIRONMENT_VARIABLES: # Environment variables specific to cluster-1/project-1.
                NEXT_PUBLIC_BASE_PATH: "/cluster-1/project-1" # Base path for Next.js routing for this project. All routes will be prefixed with this path.
                DATABASE_URL: "cluster-1-project-1.db" # SQLite database file for this project.
                NEXT_PUBLIC_BASE_PORT: 4001 # Publicly accessible base port for Next.js.
                AUTH_TRUST_HOST: "true"
                AUTH_URL: "http://localhost:8000/cluster-1/project-1" # Public URL for NextAuth.js callbacks, using HOST_PORT and BASE_PATH.
                AUTH_SECRET: "--------------------------------------"
                AUTH_GOOGLE_ID: "--------------------------------------"
                AUTH_GOOGLE_SECRET: "--------------------------------------"
                GOOGLE_AUTHORIZED_REDIRECT_URL: "http://localhost:4001/cluster-1/project-1/api/auth/callback/google"
                CONNECT_PEERS: "http://localhost:3000,http://localhost:4001,http://localhost:4002,http://localhost:5001,http://localhost:5002"
          - NAME: project-2 # Logical name for project-2 within cluster-1.
            PORT: 4002 # Internal port for cluster-1/project-2.
            COMMAND: /bin/sh -ec "yarn build && yarn start" # Command to build and start project-2.
            ENVIRONMENT_VARIABLES: # Environment variables specific to cluster-1/project-2.
                NEXT_PUBLIC_BASE_PATH: "/cluster-1/project-2"
                DATABASE_URL: "cluster-1-project-2.db"
                NEXT_PUBLIC_BASE_PORT: 4002
                AUTH_TRUST_HOST: "true"
                AUTH_URL: "http://localhost:8000/cluster-1/project-2"
                GOOGLE_AUTHORIZED_REDIRECT_URL: "http://localhost:4002/cluster-1/project-2/api/auth/callback/google"
                CONNECT_PEERS: "http://localhost:3000,http://localhost:4001,http://localhost:4002,http://localhost:5001,http://localhost:5002"
    - NAME: cluster-2 # Logical name for the second cluster.
      PROJECTS: # List of projects within cluster-2.
          - NAME: project-1
            PORT: 5001
            COMMAND: /bin/sh -ec "yarn build && yarn start"
            ENVIRONMENT_VARIABLES:
                NEXT_PUBLIC_BASE_PATH: "/cluster-2/project-1"
                DATABASE_URL: "cluster-2-project-1.db"
                NEXT_PUBLIC_BASE_PORT: 5001
                AUTH_TRUST_HOST: "true"
                AUTH_URL: "http://localhost:8000/cluster-2/project-1"
                AUTH_SECRET: "--------------------------------------"
                AUTH_GOOGLE_ID: "--------------------------------------"
                AUTH_GOOGLE_SECRET: "--------------------------------------"
                GOOGLE_AUTHORIZED_REDIRECT_URL: "http://localhost:5001/cluster-2/project-1/api/auth/callback/google"
                CONNECT_PEERS: "http://localhost:3000,http://localhost:4001,http://localhost:4002,http://localhost:5001,http://localhost:5002"
          - NAME: project-2
            PORT: 5002
            COMMAND: /bin/sh -ec "yarn build && yarn start"
            ENVIRONMENT_VARIABLES:
                NEXT_PUBLIC_BASE_PATH: "/cluster-2/project-2"
                DATABASE_URL: "cluster-2-project-2.db"
                NEXT_PUBLIC_BASE_PORT: 5002
                AUTH_TRUST_HOST: "true"
                AUTH_URL: "http://localhost:8000/cluster-2/project-2"
                AUTH_SECRET: "--------------------------------------"
                AUTH_GOOGLE_ID: "--------------------------------------"
                AUTH_GOOGLE_SECRET: "--------------------------------------"
                GOOGLE_AUTHORIZED_REDIRECT_URL: "http://localhost:5002/cluster-2/project-2/api/auth/callback/google"
                CONNECT_PEERS: "http://localhost:3000,http://localhost:4001,http://localhost:4002,http://localhost:5001,http://localhost:5002"
```

---

## Customization and Important Considerations ⚠️

Cosmic.ts is provided as a robust boilerplate to kickstart your Next.js monorepo projects. While it's designed for flexibility and adaptation, certain core aspects are fundamental to its architecture
and should be handled with care during customization.

- **Boilerplate Nature:** This repository is intended as a starting point. You are encouraged to clone it and modify it to suit your specific application requirements, features, and design.
- **Preserving Core Architecture:**
    - **Monorepo Structure (TurboRepo):** The `turbo.json` configuration and the `workspaces` definition in the root `package.json` are central to the monorepo's efficiency. Modifications here should
      be done with a clear understanding of TurboRepo's task orchestration and caching mechanisms.
    - **Shared Configurations (`config/`):** The packages within the `config/` directory (`@cosmic/eslint`, `@cosmic/next`, `@cosmic/tailwind-config`, `@cosmic/tailwindcss`, `@cosmic/typescript`) are
      designed for consistency across all projects. When adding new projects or modifying existing ones, ensure they correctly consume these shared configurations to maintain a unified development
      environment.
    - **Drizzle ORM Patterns:** The database schema (`source/__main__/drizzle/schema.ts`) and migration scripts are integral to data management. When extending or modifying the database, adhere to
      Drizzle's patterns and use the provided `yarn drizzle-things` script.
    - **NextAuth.js Integration:** The authentication flow configured in `source/__main__/auth.ts` and `middleware.ts` is a critical security component. When customizing authentication, ensure that
      security best practices are followed and that the integration remains robust.
- **Environment Variables (`.env` files):** Always manage sensitive information (like `NEXTAUTH_SECRET`, API keys, etc.) through `.env` files and **never commit them to version control**. Ensure that
  `.env.example` files are updated to reflect all necessary variables for new developers.
- **Runtime Configuration (`cosmic.yaml`):** The `cosmic.yaml` example illustrates how the main application and clustered projects are orchestrated. When deploying, you will need to implement a
  similar configuration using your chosen deployment tools (e.g., PM2, Docker Compose, Kubernetes) to correctly manage ports, commands, and environment variables for each service. Adapt this example
  to your production environment.
- **Project Naming:** When creating new projects or clusters, ensure unique and descriptive names to maintain clarity within the monorepo.

By understanding and respecting these core architectural decisions, you can effectively customize Cosmic.ts to build scalable and maintainable applications while leveraging the benefits of its
structured framework.

---

## Contributing 🤝

Contributions are highly encouraged! To contribute to Cosmic.ts, please follow these guidelines:

1.  **Fork the repository:** Start by forking the `Cosmic.ts` repository to your GitHub account.
2.  **Clone your fork:** Clone your forked repository to your local machine.
3.  **Create a new branch:** Create a new branch for your feature or bug fix.
4.  **Make your changes:** Implement your changes, ensuring they adhere to the project's coding standards and best practices.
5.  **Run tests:** Before committing, ensure all existing tests pass and add new tests for your changes if applicable.
6.  **Format code:** Use `yarn format` to ensure your code is properly formatted.
7.  **Conventional Commits:** Follow the [Conventional Commits specification](https://www.conventionalcommits.org/en/v1.0.0/) for your commit messages. This helps in generating changelogs and
    understanding the nature of changes. Use `yarn commit` to guide you through the process.
8.  **Open a Pull Request:** Submit a pull request to the `main` branch of the original `Cosmic.ts` repository. Provide a clear and concise description of your changes.

---

## License 📄

This project is currently UNLICENSED. Please contact the author for licensing inquiries.
