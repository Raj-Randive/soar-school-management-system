const redis = require("redis");
const config = require("../config/index.config.js");

// Create a Redis client
const redisClient = redis.createClient({
  socket: {
    host: config.REDIS_HOST,
    port: config.REDIS_PORT,       
  },
  password: process.env.REDIS_PASSWORD || null,
});

// Event listeners for Redis client
redisClient.on("connect", () => {
  console.log("Connected to Redis");
});

redisClient.on("ready", () => {
  console.log("Redis client is ready");
});

redisClient.on("error", (err) => {
  console.error("Redis error:", err);
});

redisClient.on("end", () => {
  console.log("Redis connection closed");
});

// Initialize the Redis connection
(async () => {
  try {
    await redisClient.connect();
  } catch (err) {
    console.error("Error connecting to Redis:", err);
  }
})();

// Export the Redis client
module.exports = redisClient;
