# Yodo

A simple Todo list manager created with React, Vite, and Firebase.

I followed the KISS protocol to keep the app simple and straightforward, avoiding unnecessary comments or code.

## Features

- Support for `English`, `Japanese` and `Portuguese`, defaulting to the browser's language
- Dark and light mode
- Create, edit, and delete tasks
- Real-time sync with Firebase
- Data persistence to avoid fetching the data every time the app is opened
- E2E tests with Cypress
- Components folder structure: Each page has its own folder with its components and a shared components folder for components that are shared across pages. This makes it easier to generate lighter builds for each page using lazy loading
- [Design created and maintained by Komura Nanami](https://www.figma.com/design/jXI9zuus6HmDDCuDTbhx4A/Webapp?node-id=123-2088&node-type=canvas&t=Gys67KFOfeUe5De2-11)

## Dev

First install the dependencies:

```bash
pnpm install

npm install -g firebase-tools
```

Then run the development server:

```bash
pnpm dev
```
