var feedbackQueueFactory = require('./feedbackQueue');
var feedbackQueue = new feedbackQueueFactory();
feedbackQueue.createMessage({message: 'Foo Bar', type: 'foo'});
feedbackQueue.createMessage({message: 'Bar Foo', type: 'bar'});
