# POLYMER-CHAT STYLE GUIDE

This is a compilation of rules and style guides that i used while developing Polymer components.

## Table of Contents

  1. [Properties](#properties)
  1. [Functions](#functions)
  1. [Observers](#observers)
  1. [Events](#events)
  1. ["this" Context](#this)
  1. [Code Layout](#layout)
  1. [TODOs](#todos)
  1. [Resources](#resources)
  1. [Conclusion](#conclusion)
  1. [Contribute](#contribute)



<a name="properties"></a>
## Properties

All properties defined inside a Polymer component consisting of more than one word are always written using *lowerCamelCase*

```javascript
// for example setting a user´s name
const userName = "Polymer"
```
When defining properties inside a component, every variable should be initializad with a default value:

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

All functions defined inside a component whose name consiss of more than one word are always written using *lowerCamelCase*.

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

In order make Obverser callback functions as distinguishable as possible, the prefix `_` and different suffixes will be used according to their use. In most cases `xxx` will be the target variable whitch will update.

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
    '_myUsersChanged(users.*)'
  ],
  _myUsersChanged: function(newValue, oldValue) {
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
    '_usersAddedOrRemoved(users.splices)'
  ],
  _myUsersCusersAddedOrRemovedhanged: function(changeRecord) {
    ...
  }

});
```


<a name="events"></a>
## Events
Thanks to the double way data-binding and the event listener and the event firing system, handling events is a very powerfull way to communicate between componnents.

### Listeners
When defining event listeners, there is no need of a speciffic preffix, but again, it should be as representative as possible. Considering this, the preffix `handle` is very appropiate to this use.

#### Example
```html
<dom-module id="x-custom">
  <template>
    <button on-tap="handleTap">Kick Me</button>
  </template>
  <script>
    Polymer({
      is: 'x-custom',
      listeners: {
        'click': 'handleClick',
      },
      handleTap: function() {
        alert('tapped!');
      },
      handleClick: function() {
        alert('clicked!');
      }
    });
  </script>
</dom-module>
```

### Fire events
As said above, it is very usefull to comunicate of notify other components by firing custom events. The event´s name should be as short as possible and always taking into account that the parent´s method who will handle your event will be called under property `on-eventname`.

#### Example

```html
 <!-- parent component -->
<dom-module id="x-custom">
  <template>
    ...
  </template>

  <script>
    Polymer({

      is: 'x-custom',
        ...
      loadMenssages: function() {
        ...
        this.fire('items-loaded', {items: this.chatItems});
      }

    });

  </script>

</dom-module>

<!-- child  component -->
<dom-module id="x-custom">
  <template>
    ...
    <parent-component on-items-loaded="handleItemsLoaded">

    </parent-component>
  </template>

  <script>
    Polymer({

      is: 'x-custom',
        ...
      handleItemsLoaded: function(items) {
        ...
      },


    });

  </script>

</dom-module>

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
  - observer functions
  - listener functions
  - computed variables functions
  - functions fired by other components' events
  - custom functions
```

<a name="tods"></a>
## TODOs

+ comments
+ html markup design
+ reveive feedback

<a name="resources"></a>
## Resources
This "guidelines" are mostly influenced by the following resources:

+ [Polymer library documentation](https://www.polymer-project.org/1.0/docs/devguide/feature-overview)
+ [Polymer <style-guide>](https://polymerelements.github.io/style-guide/#properties)
+ [Polymer <style-guide>](https://polymerelements.github.io/style-guide/#properties)
+ [Web Components Best Practices](http://webcomponents.org/articles/web-components-best-practices/)
+ [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
+ [Clean Code: A Handbook of Agile Software Craftsmanship ](http://blog.cleancoder.com/)


<a name="conclusion"></a>
## Conclusion
The following words are pure personal opinion.

I am definetly not an experienced programmer, i recently changed my stack to web developement. Don't worry i have allready noticed that JavaScript is going to rule the world (maybe it allready does) very soon. Even in my short experience, since i am an aspiring engineer, i have always wanted to code in an ordered and legible way, and there is so many things out there that "try" to help in this matter (framenworks, style guides, architectures...) that it is difficult to choose one suited for your project, this is why i decided to write this "guide" about the library that i am currently learning, Polymer.

The main conclusion i can tell to anyone reading this is that probably Polymer will be (maybe, already is) the future library leading web development, but big projects with big components can be a huge mess and need to be "clean coded". In this purpose i would strongly recommend any programmer to read the book Clean Code: A Handbook of Agile Software Craftsmanship , on the otheer hand, if you are contributing in the JavaScriptglobal domination, the Airbnb JavaScript Style Guide can be very helpfull.


<a name="contribute"></a>
## Contribute

None of this guidelines is definitive, they have been written while developing and i am sure that there are a lot of cases missing.

Please, feel free to contribute, any feedback will be appreciated :)
