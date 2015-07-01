# meteor-altboiler - 0.1.0

A non render-blocking alternative to the Meteor-core boilerplate-generator package.

Loading meteor can take over a minute to load on slow networks. It is huge. This makes for an awful UX. With this package you can server static HTML first and then load meteor in the background. You could for an example serve a loading screen first. Or you could also render the whole site without the parts that need a connection to the server for.

## Issues

Don't hesitate to create an Issue just check the [TODO]() section first. If you're not sure if it's a bug or an issue with your set up, just PM me. :)

## Table of Contents

- [Usage](https://github.com/Kriegslustig/meteor-altboiler#usage)
- [API](https://github.com/Kriegslustig/meteor-altboiler#api)
  - [`altboiler`](https://github.com/Kriegslustig/meteor-altboiler#altboiler)
  - [`altboiler.getTemplate`](https://github.com/Kriegslustig/meteor-altboiler#altboiler_getTemplate)
  - [`altboiler.onLoad`](https://github.com/Kriegslustig/meteor-altboiler#altboiler_onload)
  - [`altboiler.css`](https://github.com/Kriegslustig/meteor-altboiler#altboiler_css)
  - [`altboiler.js`](https://github.com/Kriegslustig/meteor-altboiler#altboiler_js)
- [Definitions](https://github.com/Kriegslustig/meteor-altboiler#definitions)
  - [`HTMLString`](https://github.com/Kriegslustig/meteor-altboiler#htmlstring)
  - [`TemplateName`](https://github.com/Kriegslustig/meteor-altboiler#templatename)
  - [`Template`](https://github.com/Kriegslustig/meteor-altboiler#template)
  - [`HTMLReturningFunction`](https://github.com/Kriegslustig/meteor-altboiler#htmlreturningfunction)
- [TODO](https://github.com/Kriegslustig/meteor-altboiler#todo)

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