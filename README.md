# meteor-altboiler - 0.4.0 [UNRELEASED]

A non render-blocking alternative to the Meteor-core boilerplate-generator package.

Loading meteor can take over a minute to load on slow networks. It is huge. This makes for an awful UX. With this package you can server static HTML first and then load meteor in the background. You could for an example serve a loading screen first. Or you could also render the whole site without the parts that need a connection to the server for.

## Issues

Don't hesitate to create an Issue just check the [TODO](https://github.com/Kriegslustig/meteor-altboiler#todo) section first. If you're not sure if it's a bug or an issue with your set up, just PM me. :)

## Table of Contents

- [Installing](https://github.com/Kriegslustig/meteor-altboiler#installing)
- [Usage](https://github.com/Kriegslustig/meteor-altboiler#usage)
- [API](https://github.com/Kriegslustig/meteor-altboiler#api)
  - [`altboiler.getTemplate`](https://github.com/Kriegslustig/meteor-altboiler#altboilergettemplatetemplatename-assets)
  - [`altboiler.config`](https://github.com/Kriegslustig/meteor-altboiler#altboilerconfigconfig)
- [Configuration](https://github.com/Kriegslustig/meteor-altboiler#configuration)
- [TODO](https://github.com/Kriegslustig/meteor-altboiler#todo)

## Installing

```bash
meteor install kriegslustig:altboiler
```

## Usage

```js
// Render a file saved in private/myLoadScreen.html as the loading screen
altboiler.config({
  action: altboiler.getTemplate.bind({something: 2}, 'myLoadScreen.html', Assets),

  // Render a file saved in private/myLoadScript.js as JS inside the loading screen

  js: Assets.getText('myLoadScript.js'),

  // Render a file saved in private/myLoadStyles.css as CSS inside the loading screen
  css: Assets.getText('myLoadScript.css')
})


```

## API

The package installs two `connect`-handles. One on `WebApp.rawConnectHandlers` and one on `WebApp.connectHandlers`. The latter is used to serve the loader (load-screen). It simply doesn't call the `next` callback to prevent the meteor core from loading. The former, raw handler is for the app-script. It compiles all files inside the manifest and serves it as one file.

When a client hits the server it responds with the rendered altboiler `Boilerplate`. Its basically rendering [`assets/main.html`](https://github.com/Kriegslustig/meteor-altboiler/blob/master/assets/main.html). Here's an overview of what happens inside;

* First your styles (`altboiler.configuration.css`) gets loaded
* The loader-script ([`assets/loader`](https://github.com/Kriegslustig/meteor-altboiler/blob/master/assets/loader.js)) gets loaded
* Your script loads (`altboiler.configuration.js`)
* All the `altboiler.configuration.onLoad` get installed
* The return value of `altboiler.configuration.action` gets loaded
* The app-script is loaded over the raw connect-handler
* `onLoad` hook triggers

### `altboiler.getTemplate(templateName[, assets])` - *Server*

**templateName** - `TemplateName` | `Template`: If you pass the filename of a resource, you have to pass the `Assets`-object
**Assets** - `Object`: The current contexts `Assets` object

The templates get rendered using `meteorhacks:ssr`. So you can also register helpers and stuff. You might want to check out [it's docs](https://github.com/meteorhacks/meteor-ssr). `altboiler.getTemplate` is registered as a server-side global helper, it's called `getServerTemplate`.

### `altboiler.config(config)` - *Server*

**config** - `Object`: An object holding configuration options. They will be merged with the current configuration. When properties already exist, the new one will be used.

This configures altboiler. The configuration is saved in `altboiler.configuration`.

#### When to call `altboiler.config`

Normally, when you configure altboiler you'll use `getTemplate`. It renders a template using SSR and returns static HTML. You'll often bind some data-context to that call. To make the server's first response as quick as possible, you'll want to decrease the times a loading template is rendered. If your data is static, that's easy to do. You can just put the call to `altboiler.config` inside a `Meteor.startup` call and use `altboiler.getTemplate.call`. That way the template is only rendered once.

## Configuration

### `css` - `Array` || `String`
An array of strings of CSS. The CSS added via this option will be rendered into the loading template. The best way to use this is with [`Assets`](http://docs.meteor.com/#/full/assets).

### `js` - `Array` || `String` || `Function`
Same as the CSS. The configured JS will be executed right after `assets/loader.js`. The array may also contain functions. `toString` will be called on these. It is then executed after the HTML and CSS is loaded. There is a little problem with this tough. The HTML is not guaranteed to be rendered when this is loaded tough. So you might want to wrap you script inside a `setTimeout(someFunc, 0)`.

### `action` - `String` || `Function`
This is what will be served to all routes before meteor. The best way to use this, is to create a `.html` file as an asset and then call `altboiler.getTemplate.call`.

### `onLoad` - `Array` || `String` || `Function`
An array of strings or functions to be triggered when the app-scripts are loaded. The functions have to take one argument `next` which calls the next function inside the `onLoad` queue. You can interact with the script inside the `boilerplate.configuration.js`. You may get variables from the `window` object, instead of searching them inside the global-scope. This is because the onLoad listener is installed before `boilerplate.configuration.js` is executed. So you'll get an `is undefined` error when you try to get a variable defined inside `boilerplate.configuration.js` directly.

## TODO
* Write an API to use connectHandlers
