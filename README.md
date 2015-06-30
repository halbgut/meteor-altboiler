# meteor-altboiler - 0.1.0 [WORK IN PROGRESS]

A non render-blocking alternative to the Meteor-core boilerplate-generator package.

Loading meteor can take over a minute to load on slow networks. It is huge. This makes for an awful UX. With this package you can server static HTML first and then load meteor in the background. You could for an example serve a loading screen first. Or you could also render the whole site without the parts that need a connection to the server for.

Using the knowledge gained form writing [Meteor-without-blocking-the-rendering-process](https://github.com/Kriegslustig/Meteor-without-blocking-the-rendering-process), I'm now writing this package.

## Issues

The package goes pretty deep into the meteor core. So it's likely that there are edge cases that I've missed.

So don't hesitate to create an Issue and if you're not sure if it's a bug or an issue with your set up, just PM me.

## Usage

```
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
An object containing the configuration for `altboilder`.
  * **action** - `HTMLString` | `TemplateName` | `HTMLReturningFunction`, *true*: This is what will be served to all routes before meteor.
  * **onLoad** - `FunctionName`: The name of a function defined in side the `action`. The function is asynchronous. So it's passed a callback that you have to call inside it.

This function is a helper to configure altboiler. You shouldn't access `altboilder.config` directly.

### `altboiler.getTemplate(templateName, assets)`

**templateName** - `TemplateName` | `Template`
**Assets** - `Obejct` - The current contexts `Assets` object

The templates get rendered using `meteorhacks:ssr`. So you can also register helpers and stuff. You might want to check out [it's docs](https://github.com/meteorhacks/meteor-ssr). `altboiler.getTemplate` is registered as a server-side global helper.

### `altboiler.onLoad(funcToHookUp)`

**funcToHookUp** - `FunctionName` | `Function`: The function to be triggered when the scripts are loaded. The function has to take one argument `next` which calls the next function in the `onLoad` queue.

The passed function is pushed to `config.onLoad`. That function is passed to the client using `.toString` and is then executed in a different context. This means, that the function can't have any *dependencies* (except for stuff loaded into the boilerplate).

### `altboiler.css(css)`

**css** - `String` - A string containing CSS

The CSS added via this function will be rendered inside the loading template. It pushes the passed CSS to `altboilder.hookedCss`. It returns the index of the newly added item.

### `altboiler.js(js)`

**js** - `String` - A string containing JS

The JS added via this function will be rendered inside the loading template. It pushes the passed JS to `altboilder.hookedJs`. It returns the index of the newly added item.

### Definitions

#### `HTMLString`
A string of HTML.

#### `TemplateName`
A [asset's](http://docs.meteor.com/#/full/assets) name. The file has to have the `.html` extension.

#### `Template`
A string containing a valid spacebars template

#### `HTMLReturningFunction`
A function that return an HTML string.

## TODO
...