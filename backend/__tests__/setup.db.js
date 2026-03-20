import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { beforeAll, afterAll, afterEach } from 'vitest';

let mongoServer;

beforeAll(async () => {
    // Spin up an ephemeral, isolated MongoDB server in Node memory
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    // Prevent cross-contamination with live databases
    if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
    }

    await mongoose.connect(uri);
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

afterEach(async () => {
    // Clear out documents after every single test iteration to ensure zero state leakage
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        await collections[key].deleteMany({});
    }
});
