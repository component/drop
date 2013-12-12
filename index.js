
/**
 * Module dependencies.
 */

var normalize = require('normalized-upload');
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
 * Dragover handler.
 */

Drop.prototype.ondragover = function(e){
  e.preventDefault();
  this.classes.add('over');
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
  normalize(e, this.callback);
};

