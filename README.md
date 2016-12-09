# POLYMER-CHAT STYLE GUIDE

This is a compilation of rules and style guides that i used while developing Polymer components.

This guidelines are mostly influenced by the following resources:

+ [Polymer library documentation](https://www.polymer-project.org/1.0/docs/devguide/feature-overview)
+ [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
+ [Clean Code: A Handbook of Agile Software Craftsmanship ](http://blog.cleancoder.com/)

## Table of Contents

  1. [Properties](#properties)
  1. [Functions](#functions)
  1. [Observers](#observers)
  1. ["this" Context](#this)
  1. [Code Layout](#layout)



<a name="properties"></a>
## Properties

All properties defined inside a Polymer component consisting of more than one word are always written using *lowerCamelCase*

```javascript
// for example setting a user´s name
const userName = "Polymer"
```
By defining properties inside a  component, every variable should be initializad with a default value:

```javascript
Polymer({

  is: 'x-custom',

  properties: {

    name: {
      type: String,
      value: 'xxx'
    },
    age: {
      type: Number,
      value: -1
    },
    isAlive: {
      type: Boolean,
      value: true
    },
    data: {
      type: Object,
      notify: true,
      value: function() { return {}; }
    },
    wishList: {
      type: Array,
      notify: true,
      value: function() { return []; }
    },
  }

});
```
<a name="functions"></a>
## Functions

All functions defined inside a  component whose name consiss of more than one word are always written using *lowerCamelCase*.

According to the [Clean Code](http://blog.cleancoder.com/) guidelines, functions are defined considering; *"Do one thing"* and *"Don´t repeat yourself"* principles.

When defining custom/helper functions, the definition should be as representative as possible, regardless of the name´s length.

```javascript
...
scrollToBottom: function() {
    ...
},
...
checkCollapsibleTime: function(timestamp, timestampnext) {
    ...
}
...
```
This functions should not be defined with the **prefixes** or **suffixes** used in Observers and Listeners, in this way, custom functions and system functions will be easier to distinguish.

<a name="observers"></a>
## Observers

In order make Obverser callback functions as distinguishable as possible, i will be using `_` prefix and fifferent suffixes accorto the their use. In most cases `xxx` will be the target variable whitch will update.

### Simple and complex Observers
Use of expression `_xxxChanged`

#### Example (simple)
```javascript
Polymer({

  is: 'x-custom',

  properties: {
    myVariable: {
      type: Boolean,
      observer: '_myVariableChanged'
    }
  },

  _myVariableChanged: function(newValue, oldValue) {
    ...
  }

});
```
#### Example (complex)
```javascript
Polymer({

  is: 'x-custom',

  properties: {
    myUsers: {
      type: Array
    }
  },
  observers: [
    'myUsersChanged(users.*)'
  ],
  myUsersChanged: function(newValue, oldValue) {
    ...
  }

});
```
### Multiple properties
Use of expression `_updatexxx`
#### Example
```javascript
Polymer({

  is: 'x-custom',

  properties: {
    preload: Boolean,
    src: String,
    size: String
  },

  observers: [
    '_updateImage(preload, src, size)'
  ],

  _updateImage: function(preload, src, size) {
    // ... do work using dependent values
  }

});
```
### Array mutations
Use of expression `_xxxAdedOrRemoved`
#### Example
```javascript
Polymer({

  is: 'x-custom',

  properties: {
    myUsers: {
      type: Array
    }
  },
  observers: [
    'usersAddedOrRemoved(users.splices)'
  ],
  myUsersCusersAddedOrRemovedhanged: function(changeRecord) {
    ...
  }

});
```
<a name="this"></a>
## "this" Context

When calling functions or variables defined inside the component the `this` variable is called many times. Whenever a function changes context, like `Promises` or JavaScript's own functions, the `bind` function will be used to pass the `this` variable and keep context.

### Example
  ```javascript
  const referenceValue = ...
  ...
    // in JavaScript's own function
    myList.forEach(function(listValue){
      // do your work for each value
      if (listValue === this.referenceValue) {
        console.log("eureka");
      }
    }.bind(this));

  ...
    // in Promise
    this.findValue({
      // your params
    }).then(function(foundValue){
      // do your work with value
      if (foundValue === this.referenceValue) {
        console.log("eureka");
      }
    }.bind(this));
  ```



<a name="layout"></a>
## Code layout

Finally, while coding and writing Polymer components in a relatively big project, i thought that it was important to have a certain order or arrangement in order to have a readable and mantainable code ( which is every developer´s dream).

In this purpose, the idea is to have a *"hierarchy"* taking into account all the items mentioned above.

Here will be represented the layout proposed by the next diagrams.

### Component Generic Layout
```
- definition
|
- properties
|
- behaviors
- observers
- listeners
|
- variables
|
- functions
```

### Component Expanded Layout
```
- definition
|
- properties
  |
  - order can be decided according to property´s relevance
|
- behaviors
- observers
  |
  - order can be defined the same as the "observed's" property order
|
- listeners
|
- variables
  |
  - behavior defined variables
  - custom variables
|
- functions
  |
  - component lifecycle functions
  - behavior defined functions
  - observer methods
  - listener methods
  - functions fired by other components' events
  - custom functions
```
