# Spicetify DeskThing Bridge

This repository contains three main components:

1. **DeskThing App (/spotify/)**: The main application.
2. **Spicetify Extension (/spicetify-deskthing-link/)**: An extension for Spicetify that sends the token to the bridge.
3. **Bridge (/bridge/)**: A Node.js application that allows the DeskThing App and the Spicetify extension to communicate.

## Prerequisites

- Node.js installed on your machine.
- Spicetify CLI installed and configured.

## Setup

### 1. Bridge (/bridge/)

1. Navigate to the `/bridge/` directory.
2. Install the dependencies:
    ```sh
    npm install
    ```
3. Start the bridge server:
    ```sh
    npm start
    ```

### 2. Spicetify Extension (/spicetify-deskthing-link/)

1. Navigate to the `/spicetify-deskthing-link/` directory.
2. Run the setup script:
    ```sh
    npm run setup
    ```
    > Note: Running `npm run setup` will set up the Spicetify config.
3. Build the extension:
    ```sh
    npm run build
    ```
    > Note: Running `npm run build` will automatically run `spicetify apply`.

### 3. DeskThing App (/spotify/)

1. Navigate to the `/spotify/` directory.
2. Install the dependencies:
    ```sh
    npm install
    ```
3. Build the project:
    ```sh
    npm run build
    ```
4. In the `/dist` directory, there should be a .zip file to import into DeskThing
