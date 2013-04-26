
/**
 * Module dependencies.
 */

var classes = require('classes');
var events = require('events');

/**
 * Expose `Drop`.
 */

module.exports = Drop;

/**
 * Initialize a drop point
 * on the given `el` and callback `fn(e)`.
 *
 * @param {Element} el
 * @param {Function} fn
 * @api public
 */

function Drop(el, fn) {
  if (!(this instanceof Drop)) return new Drop(el, fn);
  this.el = el;
  this.callback = fn;
  this.classes = classes(el);
  this.events = events(el, this);
  this.events.bind('drop');
  this.events.bind('dragenter');
  this.events.bind('dragleave');
  this.events.bind('dragover');
}

/**
 * Unbind event handlers.
 *
 * @api public
 */

Drop.prototype.unbind = function(){
  this.events.unbind();
};

/**
 * Dragenter handler.
 */

Drop.prototype.ondragenter = function(e){
  this.classes.add('over');
};

/**
 * Dragover handler.
 */

Drop.prototype.ondragover = function(e){
  e.preventDefault();
};

/**
 * Dragleave handler.
 */

Drop.prototype.ondragleave = function(e){
  this.classes.remove('over');
};

/**
 * Drop handler.
 */

Drop.prototype.ondrop = function(e){
  e.stopPropagation();
  e.preventDefault();
  this.classes.remove('over');
  this.prepare(e, this.callback);
};

/**
 * Prepare the event for callback.
 *
 * @param {Event} e
 * @param {Function} fn
 * @api private
 */

Drop.prototype.prepare = function(e, fn){
  e.items = [];
  var items = e.dataTransfer.items;
  this.items(e, items, function(){ fn(e) });
};

/**
 * Process `items`.
 *
 * @param {Event} e
 * @param {Array} items
 * @param {Function} fn
 * @return {Type}
 * @api private
 */

Drop.prototype.items = function(e, items, fn){
  var pending = items.length;

  for (var i = 0; i < items.length; i++) {
    var item = items[i];

    // directories
    if ('file' == item.kind && item.webkitGetAsEntry) {
      var entry = item.webkitGetAsEntry();
      if (entry.isDirectory) {
        this.walk(e, entry, function(){
          --pending || fn(e);
        });
        continue;
      }
    }

    // files
    if ('file' == item.kind) {
      var file = item.getAsFile();
      file.kind = 'file';
      e.items.push(file);
      --pending || fn(e);
      continue;
    }

    // others
    (function(){
      var type = item.type;
      var kind = item.kind;
      item.getAsString(function(str){
        e.items.push({
          kind: kind,
          type: type,
          string: str
        });

        --pending || fn(e);
      })
    })()
  }
};

/**
 * Walk `entry`.
 *
 * @param {Event} e
 * @param {FileEntry} entry
 * @param {Function} fn
 * @api private
 */

Drop.prototype.walk = function(e, entry, fn){
  var self = this;

  if (entry.isFile) {
    return entry.file(function(file){
      file.entry = entry;
      file.kind = 'file';
      e.items.push(file);
      fn();
    })
  }

  if (entry.isDirectory) {
    var dir = entry.createReader()
    dir.readEntries(function(entries){
      entries = filterHidden(entries);
      var pending = entries.length;

      for (var i = 0; i < entries.length; i++) {
        self.walk(e, entries[i], function(){
          --pending || fn();
        })
      }
    })
  }
}

/**
 * Filter hidden entries.
 *
 * @param {Array} entries
 * @return {Array}
 * @api private
 */

function filterHidden(entries) {
  var arr = [];

  for (var i = 0; i < entries.length; i++) {
    if ('.' == entries[i].name[0]) continue;
    arr.push(entries[i]);
  }

  return arr;
}
