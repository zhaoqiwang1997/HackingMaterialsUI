This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Setting up your development environment

1. Make sure you're in `HA-2022-SM2/src/frontend/`.
1. Install prerequisites (node and npm) by following [this guide](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).
1. Run `npm install` to install dependencies (to see the dependencies being installed, have a look at `package.json`).
1. Setup your IDE to enable linting and syntax highlighting by following [this guide](https://create-react-app.dev/docs/setting-up-your-editor/).
   All done! You can now run `npm start` to run the app locally or `npm run storybook` to start the Storybook.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run storybook`

Launches the Storybook viewer to see your components in action. To add more stories to the Storybook, create a `examples.tsx` file in your component's directory. \
To learn more about Storybook, check out the [Storybook documentaion](https://storybook.js.org/docs/react/get-started/introduction).

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Docker

A dockerfile is provided for packaging the front-end as a Docker container, using an NGINX proxy server.

To build the docker container, run:

```sh
docker build -t hacking-materials-frontend .
```

Then, to run the container:

```sh
docker run -p 80:80 hacking-materials-frontend
```

After running the second command, the frontend should be accessible at `http://localhost` or `http://localhost:80`. If you'd like to use a different local port, replace the first `80` in the run command with the desired port.

Please note that this setup is intended for production builds only. Development behaviour like automatic refresh/reload is not supported.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
