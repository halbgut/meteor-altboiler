# meteor-altboiler - 0.1.0

A non render-blocking alternative to the Meteor-core boilerplate-generator package.

Loading meteor can take over a minute to load on slow networks. It is huge. This makes for an awful UX. With this package you can server static HTML first and then load meteor in the background. You could for an example serve a loading screen first. Or you could also render the whole site without the parts that need a connection to the server for.

## Issues

Don't hesitate to create an Issue just check the [TODO]() section first. If you're not sure if it's a bug or an issue with your set up, just PM me. :)

## Table of Contents

- [Installing](https://github.com/Kriegslustig/meteor-altboiler#installing)
- [Usage](https://github.com/Kriegslustig/meteor-altboiler#usage)
- [API](https://github.com/Kriegslustig/meteor-altboiler#api)
  - [`altboiler`](https://github.com/Kriegslustig/meteor-altboiler#altboileroptions)
  - [`altboiler.getTemplate`](https://github.com/Kriegslustig/meteor-altboiler#altboilergettemplatetemplatename-assets)
  - [`altboiler.onLoad`](https://github.com/Kriegslustig/meteor-altboiler#altboileronloadfunctohookup)
  - [`altboiler.css`](https://github.com/Kriegslustig/meteor-altboiler#altboilercsscss)
  - [`altboiler.js`](https://github.com/Kriegslustig/meteor-altboiler#altboilerjsjs)
- [Definitions](https://github.com/Kriegslustig/meteor-altboiler#definitions)
- [TODO](https://github.com/Kriegslustig/meteor-altboiler#todo)

## Installing

```bash
meteor install kriegslustig:altboiler
```

## Usage

```js
// Render a file saved in private/myLoadScreen.html as the loading screen
altboiler({
  action: altboiler.getTemplate.bind({something: 2}, 'myLoadScreen.html', Assets)
})

// Render a file saved in private/myLoadScript.js as JS inside the loading screen
altboiler.js(Assets.getText('myLoadScript.js'))

// Render a file saved in private/myLoadStyles.css as CSS inside the loading screen
altboiler.js(Assets.getText('myLoadScript.js'))
```

## API

The package installs two `connect`-handles. One on `WebApp.rawConnectHandlers` and one on `WebApp.connectHandlers`. The latter is used to serve the loader (load-screen). It simply doesn't call the `next` callback to prevent the meteor core from loading. The former, raw handler is for the app-script. It compiles all files inside the manifest and serves it as one file.

When a client hits the server it responds with the rendered altboiler `Boilerplate`. Its basically rendering [`assets/main.html`](https://github.com/Kriegslustig/meteor-altboiler/blob/master/assets/main.html). Here's an overview of what happens inside;

* First your styles (`altboiler.hookedCss`) gets loaded
* The loader-script ([`assets/loader`](https://github.com/Kriegslustig/meteor-altboiler/blob/master/assets/loader.js)) gets loaded
* All the `onLoadHooks` get installed
* The return value of `altboiler.config.action` gets loaded
* The app-script is loaded over the raw connect-handler
* `onLoad` hook triggers

### `altboiler(options)`

**options** - `Object`:
An object containing the configuration for `altboiler`.
  * **action** - `HTMLString` | `TemplateName` | `HTMLReturningFunction`, *true*: This is what will be served to all routes before meteor.
  * **onLoad** - `FunctionName`: The name of a function defined in side the `action`. The function is asynchronous. So it's passed a callback that you have to call inside it.

This function is a helper to configure altboiler. You shouldn't access `altboiler.config` directly.

### `altboiler.getTemplate(templateName, assets)`

**templateName** - `TemplateName` | `Template`
**Assets** - `Obejct` - The current contexts `Assets` object

The templates get rendered using `meteorhacks:ssr`. So you can also register helpers and stuff. You might want to check out [it's docs](https://github.com/meteorhacks/meteor-ssr). `altboiler.getTemplate` is registered as a server-side global helper.

### `altboiler.onLoad(funcToHookUp)`

**funcToHookUp** - `FunctionName` | `Function`: The function to be triggered when the scripts are loaded. The function has to take one argument `next` which calls the next function in the `onLoad` queue.

The passed function is pushed to `config.onLoad`. That function is passed to the client using `.toString` and is then executed in a different context. This means, that the function can't have any *dependencies* (except for stuff loaded into the boilerplate).

### `altboiler.css(css)`

**css** - `String` - A string containing CSS

The CSS added via this function will be rendered inside the loading template. It pushes the passed CSS to `altboiler.hookedCss`. It returns the index of the newly added item.

### `altboiler.js(js)`

**js** - `String` - A string containing JS

The JS added via this function will be rendered inside the loading template. It pushes the passed JS to `altboiler.hookedJs`. It returns the index of the newly added item.

## Definitions

#### `HTMLString`
A string of HTML.

#### `TemplateName`
A [asset's](http://docs.meteor.com/#/full/assets) name. The file has to have the `.html` extension.

#### `Template`
A string containing a valid spacebars template

#### `HTMLReturningFunction`
A function that return an HTML string.

## TODO

* Don't show the loading screen when the main script's cached
* Minimize the load script