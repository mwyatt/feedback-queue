var mustache = require('mustache');
var extend = require('extend');

var getMotionEventName = require('./getMotionEventName');
var container;
var body = document.querySelector('body');
var containerTemplate = require('./container.mustache');
var singleTemplate = require('./single.mustache');

/**
 * accepts a message and displays appropriatly, stacks
 * them on top of one another, then fades away after a period of time
 * @param {object} options
 */
var FeedbackQueue = function(options) {

};

function getContainer() {
  if (!container) {
    container = document.querySelector('.js-feedback-queue');
  }
  return container;
}

FeedbackQueue.prototype.create = function(options) {
  var optionsTemplate = {
    message: '', // anything goes string
    type: '', // success, fail, neutral or anything?
    life: 5000 // how long will it last?
  };
  extend(optionsTemplate, options);
  this.options = optionsTemplate;

  var theContainer = getContainer();

  // render container if not already
  if (!theContainer) {
    body.insertAdjacentHTML('afterbegin', mustache.render(this.options.templateContainer));
  };

  if (!options.hasOwnProperty('message')) {
    return console.warn('FeedbackQueue.createMessage', 'options must have \'message\' property');
  };

  // default type
  if (!options.hasOwnProperty('type')) {
    options.type = 'neutral';
  };
  if (!options.message) {
    return;
  };

  // resources
  var newElement;
  var data = this;

  // render
  newElement = $(mustache.render(data.options.templateSingle, options));
  $('.js-feedback-queue-position').prepend(newElement);

  // timeout for removal
  setTimeout(function() {
    newElement.addClass('is-removed');
    data.removeAfterAnimation(data, newElement);
  }, data.options.life);

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
