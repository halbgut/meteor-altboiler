# Changelog - kriegslustig:altboiler

## 0.9.2
* Fix of a fix of client-side `showLoader` check

## 0.9.1
* Bug fix in the client-side check for `showLoader`

## 0.9.0
* BACKWARDS COMPATIBILITY BREAK: The options `onLoad` and `showLoader` now have to be set in common code (client- and server-side)
* Big architechtural changes. Use Isomorphic code for configuration
* Also load the set css when `showLoader` is falsy

## 0.8.1
* Internal changes

## 0.8.0
* Render the head and body tags directly

## 0.7.0
* Styles will now not be deleted onLoad anymore

## 0.6.0
* Add a `content` option

## 0.5.0
* Fix passing functions to altboiler.configuration.js
* Fix a bug in the default action
* Make the loader fade in to prevent flashing
* Add deep-merge

## 0.4.1
* Fix `altboiler.set`
* Fix error when `onLoad` or `js` is undefined
* Add some tests
* Extend the docs
* Some internal API changes

## 0.4.0
* Add support for iron:router server-side route
* Add the `showLoader` option
* Remove the getTemplate function and SSR

## 0.3.0
* Rename the `getTemplate` helper to `getServerTemplate`
* Fix the meteor CSS loading
* Add a default CSS

## 0.2.0
* Serve a compressed loader.js
* Clean up the API; Now you can configure everything using `altboiler.config`
