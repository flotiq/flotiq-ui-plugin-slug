# Flotiq Slug Plugin in React

## Quickstart:

1. `yarn`
2. `yarn start`
3. work work work
4. `yarn build`
5. paste js code from `./build/static/js/main.xxxxxxxx.js` to Flotiq console
6. navigate to affected Flotiq pages


## Deployment

<!-- TO DO -->

## Loading the plugin

### Via URL

1. Open Flotiq editor
2. Open Chrome Dev console
3. Execute the following script
   ```javascript
   FlotiqPlugins.loadPlugin('plugin-id', '<URL TO COMPILED JS>')
   ```
4. Navigate to the view that is modified by the plugin

### Directly

1. Open Flotiq editor
2. Open Chrome Dev console
3. Paste the content of `static/js/main.xxxxxxxx.js` 
4. Navigate to the view that is modified by the plugin

### Deployment

1. Open Flotiq editor
2. Add a new plugin and paste the URL to the hosted `plugin-manifest.json` file
3. Navigate to the view that is modified by the plugin