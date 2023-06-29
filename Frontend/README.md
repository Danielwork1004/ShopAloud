# ShopAloud Widget

## Description
This is a widget for the ShopAloud service. It allows you to add a ShopAloud widget to your site that will have the ability to record the user's audio and screen recording to capture their shopping experience. 

## Local Development
This widget development is setup using:
- [Vite](https://vitejs.dev/) for building the assets and running a local dev server
- [Preact](https://preactjs.com/) for the UI framework (minimal bundle size and same dev experience as React)
- [TypeScript](https://www.typescriptlang.org/) for type safety
- [Yarn](https://yarnpkg.com/) for package management
- [TailwindCSS](https://tailwindcss.com/) for styling

Add a `.env` file in the root of the project with the following variables:
```
VITE_API_URL=http://localhost:4001
```

Run `yarn` to install dependencies and then `yarn dev` to start the dev server. The dev server will be available at http://localhost:5173

## Building
Run `yarn build` to build the assets for production. The assets will be built to the `dist` directory.

## Hosting
This widget is currently hosted on [Render](https://render.com) via their static site hosting service with a CDN in front of it. The build is set up to automatically deploy to Render when a new version is pushed to the `main` branch and assets will be built and deployed to the CDN as well. 

The js and css files are hosted on the CDN so the widget is loaded via a script tag in the HTML so that it can be used on any site.

You can currently access the widget test page at https://shop-aloud.onrender.com/ with assets hosted at https://shop-aloud.onrender.com/assets/

## Example embedded based off Render hosting
```html
<head>
    <link rel="stylesheet" href="https://shop-aloud.onrender.com/assets/index.css" />
    <script defer type="module" src="https://shop-aloud.onrender.com/assets/index.js"></script>
</head>
<body>
  <!-- ... -->
  <div id="shopaloud_widget"></div>
</body>
```

