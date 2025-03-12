const { Queue } = require('bullmq');
const redis = require('./redisClient');

const emailQueue = new Queue('emailQueue', { connection: redis });

module.exports = emailQueue;