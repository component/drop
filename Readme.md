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

  The `e.items` array contains `File` objects for file uploads,
  and regular objects for string related drops.

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

### File

  Dropping files results in `File` objects with the following properties. When
  file(s) are uploaded via dropping a directory the `.entry` property is populated
  which allows you to reference `item.entry.fullPath`.

  - `kind` "file"
  - `lastModifiedDate`
  - `name` filename
  - `size` file size
  - `type` mime type
  - `entry` `FileEntry` object

### Item

  Dropping strings or urls results in objects with the following properties:

  - `kind` "string"
  - `type` mime type
  - `string` value

# License

  MIT

