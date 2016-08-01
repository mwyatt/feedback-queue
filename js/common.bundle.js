var feedbackQueueFactory = require('./feedbackQueue');
var feedbackQueue = new feedbackQueueFactory();
feedbackQueue.create({message: 'Good Day Sir!', type: 'foo'});
