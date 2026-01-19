const { createClient } = require('redis');

const redisClient = createClient({
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
    }
});

redisClient.on('error', err => console.log('❌ Redis Client Error', err));

redisClient.on('connect', () => console.log('⌚ Redis Client Connecting...'));

redisClient.on('ready', () => console.log('✅ Redis Client Ready'));

(async () => {
    try {
        await redisClient.connect();
    } catch (err) {
        console.error('❌ Redis Connection Failed', err);
    }
})();

/**
 * Delete keys matching a pattern
 * @param {string} pattern - Redis key pattern (e.g., 'cache:/api/menu*')
 */
redisClient.delByPattern = async (pattern) => {
    if (!redisClient.isOpen) return;

    try {
        let cursor = 0;
        do {
            const reply = await redisClient.scan(cursor, {
                MATCH: pattern,
                COUNT: 100
            });
            cursor = reply.cursor;
            const keys = reply.keys;

            if (keys.length > 0) {
                await redisClient.del(keys);
            }
        } while (cursor !== 0);
    } catch (err) {
        console.error(`❌ Redis delByPattern Error (${pattern}):`, err);
    }
};

module.exports = redisClient;