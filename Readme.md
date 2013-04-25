# Drop

  Drag and drop upload component providing each
  drop as a single event for easy filtering and custom
  precedence.

## Installation

    $ component install component/drop

## Features

  - normalizes all items and files into a single `e.items` array
  - auto-populates `.string` for string related items
  - walks directories (webkit only)

## Example

```js
var drop = require('drop')
var el = document.querySelector('#drop')

drop(el, function(e){
  var items = e.items
  items.forEach(function(item){
    console.log(item)
  })
})
```

# License

  MIT

