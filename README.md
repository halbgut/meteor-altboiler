# meteor-altboiler [WORK IN PROGRESS]

A non render-blocking alternative to the Meteor-core boilerplate-generator package

Loading meteor can take over a minute to load on slow networks. It is huge. This makes for an awful UX. With this package you can server static HTML first and then load meteor in the background. You could for an example serve a loading screen first. Or you could also render the whole site without the parts that need a connection to the server for.

Using the knowledge gained form writing [Meteor-without-blocking-the-rendering-process](https://github.com/Kriegslustig/Meteor-without-blocking-the-rendering-process), I'm now writing this package.

## Usage

```
altboiler({
  serveMeteor: true,
  defaultAction: altboiler.getTemplate.bind({something: 2}, 'templateName')
})

altboiler.route('someRoute', {
  action: altboiler.getTemplate.bind({something: 2}, 'someRoute')
})
```

### API

#### `altboiler(options)`

**options** - `Object`:
An object containing configuration for `altboilder`.
  * **serveMeteor** - `Boolean`, *true*: Wether or not meteor itself should be served.
  * **defaultAction** - `HTMLString` | `TemplateName` | `HTMLReturningFunction`, *true*: This is what will be served to all routes before meteor.
  * **onLoad** - `FunctionName`: The name of a function defined in side the `action`

This package exports a variable `altboilder`. It's a helper function that takes an object and configures `altboiler` with it.

#### `altboiler.route(route[, options])`

**route** - `String`:
A simple url. It's completely static (for now). That means no parameters are possible.

**options** - `Object`:
An Object that contains options for a certain route.
  * **action** - `HTMLString` | `TemplateName` | `HTMLReturningFunction`: This is what will  be served to all routes before meteor. This overrides the `altboiler.config.defaultAction`
  * **onLoad** - `FunctionName`: The name of a function defined in side the `action`. This doesn't override the `altboiler.config.onLoad`.

#### `altboiler.getTemplate(templateName)`

**templateName** - `TemplateName`

The templates gets rendered using `meteorhacks:ssr`. So you can also register helpers and stuff. You might want to check out [it's docs](https://github.com/meteorhacks/meteor-ssr).

##### `Boilerplate(arch, manifest[, options])`

This is the core of the whole thing. It overrides the meteor-core `boilerplate-generator`-packages' `Boilerplate` object.

#### Definitions

##### `HTMLString`
A string of HTML.

##### `TemplateName`
The name of a file (without it's extension) located inside the _private/templates/_ directory. The file has to have the `.html` extension.

##### `HTMLReturningFunction`
A function that return an HTML string.

## Goals

With this package you can configure a piece of HTML that is loaded before the standard meteor WebApp kicks in. The WebApp is loaded in a non-blocking manner. You can configure different HTML to be loaded on different routes.