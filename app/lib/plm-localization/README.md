# PLM UI Localization Service & Bundle
This module provides an Angular service to initialize and import localization bundles.  The localization bundles are included as part of the assets in the packaged zip file.  

## Documentations
See online documentations [here](http://plm360jenkins.ecs.ads.autodesk.com:9090/view/09-NextPLM/view/PLM-UI Repos/job/PLM-UI-Localization/ws/doc/index.html)

## Dependencies
* angular-dynamic-locale
* angular-locale-bundles

## Usage
Import the module `com/autodesk/localization.js`.  Configure the localization provider:
```
plm360.config([
	...
	'LocalizationServiceProvider',
	function (..., LocalizationServiceProvider) {
		...
		LocalizationServiceProvider.setPathToLocaleBundles('lib/plm-localization/build');
        ...
    }
]);
```
where the path should point to where the packaged zip file is unzipped in the application.  
