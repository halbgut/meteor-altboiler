# Changelog - kriegslustig:altboiler

## 0.5.0 [UNRELEASED]
* Fix passing functions to altboiler.configuration.js
* Fix a bug in the default action
* Make the loader fade in to prevent flashing

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
