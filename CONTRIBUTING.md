# Contributing Guidelines

First off, thank you for considering contributing to this project! It's people like you that make it such a great tool.

## Where do I go from here?

If you've noticed a bug or have a feature request, make one! It's generally best if you get confirmation of your bug or approval for your feature request this way before starting to code.

## Fork & create a branch

If this is something you think you can fix, then fork and create a branch with a descriptive name.

## Setting up the project locally

This project uses `pnpm` workspaces. 
To get started:
1. Clone the repository
2. Run `pnpm install` in the root directory.
3. Run `pnpm run dev` in the specific package directory (e.g. `@workspace/portfolio`)

## Code Style

- We use `Prettier` for formatting. Please ensure your code is formatted before committing.
- We use `TypeScript`. Ensure that `pnpm run typecheck` passes without errors.

## Pull Request Process

1. Ensure any install or build dependencies are removed before the end of the layer when doing a build.
2. Update the README.md with details of changes to the interface, this includes new environment variables, exposed ports, useful file locations and container parameters.
3. You may merge the Pull Request in once you have the sign-off of two other developers, or if you do not have permission to do that, you may request the second reviewer to merge it for you.
