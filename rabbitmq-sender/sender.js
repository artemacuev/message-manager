const amqp = require("amqplib/callback_api");
const moment = require("moment");
const Chance = require("chance");
var randomMac = require("random-mac");

var chance = new Chance();

connectionString = [
    "amqps://rgpnycue:GltlrgXnLSDiIHBb0HfxTjjBO3_iuLrZ@rat.rmq2.cloudamqp.com/rgpnycue",
    "amqp://172.17.0.1",
    "amqp://localhost:9419",
];
// Step 1: Create Connection
amqp.connect("amqp://localhost", (connError, connection) => {
    if (connError) {
        throw connError;
    }
    // Step 2: Create Channel
    connection.createChannel((channelError, channel) => {
        if (channelError) {
            throw channelError;
        }
        // Step 3: Assert Queue

        for (let i = 0; i < 122; i++) {
            // Cyrcle for sending message to queue witch delay in 1 sec
            setTimeout(() => {
                let QUEUE = "message";
                channel.assertQueue(QUEUE);
                const messageQueue = {
                    // Step 4: Creating object for dispatch
                    id: i,
                    version_: `${chance.integer({ min: 0, max: 20 })}.${chance.integer({
            min: 0,
            max: 20,
          })}.${chance.integer({ min: 0, max: 20 })}`,
                    signature_: chance.hash({ length: 9 }),
                    severity: chance.integer({ min: 0, max: 10 }),
                    extensionId: chance.integer({ min: 0, max: 10 }),
                    deviceId: chance.integer({ min: 0, max: 10 }),
                    time: moment().format("YYYY MM HH:mm:ss"),
                };
                channel.sendToQueue(QUEUE, Buffer.from(JSON.stringify(messageQueue))); // Step 5: Send message to queue
                console.dir(messageQueue);

                QUEUE = "device";
                channel.assertQueue(QUEUE);
                const deviceQueue = {
                    // Step 4: Creating object for dispatch
                    id: i,
                    device_vendor: chance.word(),
                    device_product: chance.word(),
                    device_version: `${chance.integer({
            min: 0,
            max: 20,
          })}.${chance.integer({
            min: 0,
            max: 20,
          })}.${chance.integer({ min: 0, max: 20 })}`,
                };
                channel.sendToQueue(QUEUE, Buffer.from(JSON.stringify(deviceQueue))); // Step 5: Send message to queue
                console.dir(deviceQueue);

                QUEUE = "extension";
                channel.assertQueue(QUEUE);
                const extensionQueue = {
                    // Step 4: Creating object for dispatch
                    id: i,
                    dmac: `${randomMac()}`,
                    spt: `${chance.integer({ min: 0, max: 2000000 })}`,
                    request_url: `${chance.url({ domain: "www.socialradar.com" })}`,
                    file_path: `${chance.url({ path: "images" })}`,
                    end_: `${chance.date()}`,
                    msg_: `${chance.sentence()}`,
                    type_: `${chance.word({ length: 5 })}`,
                    device_version: `${chance.integer({
            min: 0,
            max: 0,
          })}.${chance.integer({
            min: 0,
            max: 20,
          })}.${chance.integer({ min: 0, max: 20 })}`,
                };
                channel.sendToQueue(QUEUE, Buffer.from(JSON.stringify(extensionQueue))); // Step 5: Send message to queue
                console.dir(extensionQueue);
            }, i * 1000 - i * i);
        }
    });
});