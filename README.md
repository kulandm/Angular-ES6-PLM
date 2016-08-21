# PLMSinglePage - A.K.A. NextPLM

This module holds the application code for NextPLM.


## Externalized Modules
* [API Models Manager](https://git.autodesk.com/plm-ui/plm-api-models-manager)
* [Authentication Service](https://git.autodesk.com/plm-ui/plm-authentication-service)
* [Classic Redirector](https://git.autodesk.com/plm-ui/plm-classic-redirector)
* [Classification](https://git.autodesk.com/plm-ui/plm-cws)
* [Configuration](https://git.autodesk.com/plm-ui/plm-config)
* [Dropdown Widget](https://git.autodesk.com/plm-ui/plm-dropdown)
* [Event Service](https://git.autodesk.com/plm-ui/plm-event-service)
* [Flyout Widget](https://git.autodesk.com/plm-ui/plm-flyout)
* [Loading Data Service](https://git.autodesk.com/plm-ui/plm-loading-data-service)
* [Localization Service](https://git.autodesk.com/plm-ui/plm-localization)
* [Angular Filters](https://git.autodesk.com/plm-ui/plm-ng-filters)
* [Notification](https://git.autodesk.com/plm-ui/plm-notification)
* [REST Wrapper Service](https://git.autodesk.com/plm-ui/plm-rest-wrapper-service)
* [Table Data Widget](https://git.autodesk.com/plm-ui/plm-table-data)
* [Token Service](https://git.autodesk.com/plm-ui/plm-token-service)
* [Underscore Service](https://git.autodesk.com/plm-ui/plm-underscore)
* [Unit Tests Mocks Data & Objects](https://git.autodesk.com/plm-ui/plm-unit-tests-mocks)
* [Dashboard](https://git.autodesk.com/plm-ui/plm-dashboard)

## Modules to be Externalized

We should begin the progress of externalizing codes into separate modules that live in its own repo.  The following is a preliminary order.
* FieldSelector
* Services with zero/very few dependencies
* Isolated directives
* Isolated features such as roamer, search, webhooks
* Models
* Tabs


## Dependencies

There are many third party dependencies.

### AngularJS

### Material


## Setup

### Ruby

### NPM

### Node

### Grunt

### Bower


## Modules

We make use of existing package management tool `bower` to manage in-house modules.  Each of these modules has its own repository, and the dependency is managed through `bower` with `bower.json`.  For example:

```
...
"plm-event-service": "https://svc_d_tabasco_bot:b2f112965549f804d50f8fc68be3171765f131b1@git.autodesk.com/plm-ui/plm-event-service.git#1.0.1",
...
```

The versioning system allows separation of development, where changes in the event service itself do not surface until the version is upgraded to, for example:

```
...
"plm-event-service": "https://svc_d_tabasco_bot:b2f112965549f804d50f8fc68be3171765f131b1@git.autodesk.com/plm-ui/plm-event-service.git#1.0.2",
...
```

