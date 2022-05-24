This project was bootstrapped with [DHIS2 Application Platform](https://github.com/dhis2/app-platform).

## Available Scripts

After cloning the repo, run:

`yarn install`<br />
`yarn d2-style install`

<br />

For development you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner and runs all available tests found in `/src`.<br />

See the section about [running tests](https://platform.dhis2.nu/#/scripts/test) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
A deployable `.zip` file can be found in `build/bundle`!

See the section about [building](https://platform.dhis2.nu/#/scripts/build) for more information.

### `yarn deploy`

Deploys the built app in the `build` folder to a running DHIS2 instance.<br />
This command will prompt you to enter a server URL as well as the username and password of a DHIS2 user with the App Management authority.<br/>
You must run `yarn build` before running `yarn deploy`.<br />

See the section about [deploying](https://platform.dhis2.nu/#/scripts/deploy) for more information.

### Cypress tests

In order to run the cypress tests locally make sure you have configured your gitignore'd `cypress.env.json` like so:

```
{
    "dhis2BaseUrl": "http://localhost:8081",
    "dhis2Username": ...,
    "dhis2Password": ...
}
```

Your desired username and password should be in double quotes.

http://localhost:8081 is a proxy for https://debug.dhis2.org/dev (see package.json)

#### `yarn cypress:live`

Runs the tests locally in interactive mode.

#### `yarn cypress:capture`

Generates new fixtures, which will be used on CI. Make sure to commit the changes to the fixture files.

#### `yarn cypress:stub`

Runs the tests locally against the fixture files.

## Learn More

You can learn more about the platform in the [DHIS2 Application Platform Documentation](https://platform.dhis2.nu/).

You can learn more about the runtime in the [DHIS2 Application Runtime Documentation](https://runtime.dhis2.nu/).

To learn React, check out the [React documentation](https://reactjs.org/).
