
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
  this.events.bind('dragenter');
  this.events.bind('dragleave');
  this.events.bind('dragover');

  // HTML5 "dragenter" and "dragleave" events kinda suck... since they get fired
  // even for child nodes within the target droppable element, we need to do some
  // additional bookkeeping to only add/remove the "over" class on the real target
  this.first = false;
  this.second = false;
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
  if (this.first) {
    this.second = true;
  } else {
    this.first = true;
    this.classes.add('over');
  }
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
  if (this.second) {
    this.second = false;
  } else if (this.first) {
    this.first = false;
  }
  if (!this.first && !this.second) {
    this.classes.remove('over');
  }
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
