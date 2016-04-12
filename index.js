var $ = require('jquery');
var mustache = require('mustache');
var getMotionEventName = require('./utility/getMotionEventName');
var $document = $(document);

/**
 * accepts a message and displays appropriatly, stacks
 * them on top of one another, then fades away after a period of time
 * @param {object} options
 */
var FeedbackQueue = function(options) {
  var defaults = {
    singleLife: 5000, // how long will it last?
    templateContainer: '<div class="feedback-queue js-feedback-queue"><div class="feedback-queue-position js-feedback-queue-position"></div></div>', // mustache
    templateSingle: '<div class="feedback-queue-single js-feedback-queue-single is-{{type}}"><span class="feedback-queue-single-cross">&times;</span>{{message}}</div>', // mustache
    message: '', // anything goes string
    type: '' // success, fail, neutral or anything?
  };
  this.options = $.extend(defaults, options);

  // fast message
  this.createMessage(this.options);
};

/**
 * builds html required for standard message
 * only message needed
 * @param  {object} config type, message
 * @return {object}        jquery
 */
FeedbackQueue.prototype.createMessage = function(config) {

  // render container if not already
  if (!$document.find('.js-feedback-queue').length) {
    $document.find('body').prepend(mustache.render(this.options.templateContainer));
  };

  // validate
  if (typeof config === 'undefined') {
    return console.warn('FeedbackQueue.createMessage', 'config must be passed');
  };
  if (!config.hasOwnProperty('message')) {
    return console.warn('FeedbackQueue.createMessage', 'config must have \'message\' property');
  };

  // default type
  if (!config.hasOwnProperty('type')) {
    config.type = 'neutral';
  };
  if (!config.message) {
    return;
  };

  // resources
  var newElement;
  var data = this;

  // render
  newElement = $(mustache.render(data.options.templateSingle, config));
  $('.js-feedback-queue-position').prepend(newElement);

  // timeout for removal
  setTimeout(function() {
    newElement.addClass('is-removed');
    data.removeAfterAnimation(data, newElement);
  }, data.options.singleLife);

  // click message to remove
  newElement.on('click.feedback-stream', function() {
    newElement.addClass('is-removed');
    data.removeAfterAnimation(data, newElement);
  });
};

/**
 * remove the queue item when its time up!
 */
FeedbackQueue.prototype.removeAfterAnimation = function(data, trigger) {
  trigger.on(getMotionEventName('animation'), function() {
    trigger.remove();
  });
};

module.exports = FeedbackQueue;
