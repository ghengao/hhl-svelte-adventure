# Introduction

## Goals
The main goal of this project is to learn frontend development using [SvelteKit](https://kit.svelte.dev/) by taking challenges from [Advent of Svelte](https://advent.sveltesociety.dev/). However in order for this learning adventure more structured and organized, following areas should be covered during the learning process:

1. Summarization svelte specific key features used in the challenges.
2. Enhance the challenges by adding styling using tailwind and (Shadcn Svelte)[https://www.shadcn-svelte.com/]
3. Learn how to deploy the project to [Vercel](https://vercel.com/) or other cloud platforms to make it accessible to the public.

## Branching
The project is branched by the challenges. Each challenge is a separate branch and merge together into the main branch in **sequence**. Because of this, the later challenge branch will have all the challenges' code from the previous challenge branches. So in order to see the code for a specific challenge, a diff between the challenge branch and its previous challenge branch should be performed.

## Folder structure
Besides the folder structure explained in [Svelte Documentation](https://kit.svelte.dev/docs/project-structure), this project will be routing the main application and documents separately by using the following folder structure:

```sh
hhl-svelte-adventure/
|- src/
|  |- routes/
|  |  |- notes/ # for all the summary notes for each challenge
|  |  |  |- advent-day-1/ # for the summary notes for challenge 1 in advent of svelte
|  |  |- challenges/ # for all the challenges
|  |  |  |- advent-day-1/ # for the application code for challenge 1 in advent of svelte
```

## Creating a project

This project is created by using [create-svelte](https://github.com/sveltejs/kit/tree/main/packages/create-svelte) with following command:

```bash
# create a new project in the current directory
npm create svelte@latest

# create a new project in my-app
npm create svelte@latest hhl-svelte-adventure
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
