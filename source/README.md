# Monorepo Projects

This repository contains multiple projects managed within a single monorepo structure. This setup allows for shared configurations, dependencies, and streamlined development across different
applications.

## Projects

### `project-1`

A Next.js application with authentication and Prisma for database interactions. This project demonstrates a typical web application setup with server and client components.

### `project-2`

Another Next.js application, similar in structure to `project-1`, also featuring authentication and Prisma. This project can serve as a template for new applications or a separate service within the
monorepo.

## Environment Variables

Each project (`project-1` and `project-2`) utilizes `.env.development` and `.env.production` files for managing environment-specific configurations. These files are crucial for storing sensitive
information and API keys, and for differentiating settings between development and production environments.

**Important:** Files like `.env.development` and `.env.production` are used for environment-specific configurations and are typically not committed to version control (prevented by `.gitignore`).
These files serve as a guide for users to set up their local development and production environments. You will need to create these files locally based on your environment's requirements.
