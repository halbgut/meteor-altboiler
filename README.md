# meteor-altboiler [WORK IN PROGRESS]

A non render-blocking alternative to the Meteor-core boilerplate-generator package

Loading meteor can take over a minute to load on slow networks. It is huge. This makes for an awful UX. With this package you can server static HTML first and then load meteor in the background. You could for an example serve a loading screen first. Or you could also render the whole site without the parts that need a connection to the server for.

Using the knowledge gained form writing [Meteor-without-blocking-the-rendering-process](https://github.com/Kriegslustig/Meteor-without-blocking-the-rendering-process), I'm now writing this package.

## Usage

```
altboiler({
  action: altboiler.getTemplate.bind({something: 2}, 'templateName')
})
```

### API

#### `altboiler(options)`

**options** - `Object`:
An object containing configuration for `altboilder`.
  * **action** - `HTMLString` | `TemplateName` | `HTMLReturningFunction`, *true*: This is what will be served to all routes before meteor.
  * **onLoad** - `FunctionName`: The name of a function defined in side the `action`. The function is asyncronous. So it's passed a callback that you have to call inside it.

This package exports a variable `altboilder`. It's the function that installs the `connect` handler.

#### `altboiler.getTemplate(templateName)`

**templateName** - `TemplateName`

The templates gets rendered using `meteorhacks:ssr`. So you can also register helpers and stuff. You might want to check out [it's docs](https://github.com/meteorhacks/meteor-ssr). `altboiler.getTemplate` is registered as a server-side global helper.

#### Definitions

##### `HTMLString`
A string of HTML.

##### `TemplateName`
The name of a file (without it's extension) located inside the _private/templates/_ directory. The file has to have the `.html` extension.

##### `HTMLReturningFunction`
A function that return an HTML string.

## TODO

* Check for types
  * css
  * head