# POLYMER-CHAT STYLE GUIDE

This is a compilation of rules and style rules that i used while developing this project.

This guidelines are mostly influenced by the following resources:

+ [Polymer library documentation](https://www.polymer-project.org/1.0/docs/devguide/feature-overview)
+ [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
+ [Clean Code: A Handbook of Agile Software Craftsmanship ](http://blog.cleancoder.com/)

## Table of Contents

  1. [Properties](#properties)
  1. [Functions](#references)
  1. [Observers](#objects)



<a name="properties"></a>
## Properties
All properties defined inside a Polymer component consisting of more than one word are always written using *lowerCamelCase*
```
// for example setting a user´s name
const userName = "Polymer"
```
By defining properties inside a  component, every variable should be initializad with a default value:
```
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

When defining custom/helper functions, the definition should be as representative as possible, regardless of the name´s length.

```
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
In order make Obverser callback functions as distinguishable as possible, i will be using `_` prefix and fifferent suffixes accorto the their use. In most cases `xxx` will be the target variable whith will update.

### Simple and complex Observers
Use of expression `_xxxChanged`

#### Example (simple)
```
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
```
Polymer({

  is: 'x-custom',

  properties: {
    myUsers: {
      type: Array
    }
  },
  observers: [
    'myUsersChanged(users.*)'
  ]
  myUsersChanged: function(newValue, oldValue) {
    ...
  }

});
```
### Multiple properties
You can use `_updatexxx`
#### Example
```
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
You can use `_xxxAdedOrRemoved`
#### Example
```
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
