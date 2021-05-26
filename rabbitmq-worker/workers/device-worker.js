// Step 1: Create Connection
const amqp = require("amqplib/callback_api");
const chalk = require("chalk");
const db = require("../db");
const DeviceModel = require("../models/device-model");

const cheak = async() => {
    try {
        await db.authenticate();
        console.log("Connection has been established successfully.");
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
};

cheak();

const createMessage = async(message) => {
    const { device_vendor, device_product, device_version } = message;
    //console.log(`deviceVendor: ${device_vendor}\ndeviceProduct:${device_product}\ndeviceVersion:${device_version}`);
    db.sync().then(function() {
        var deviceModel = DeviceModel.build({
            Device_vendor: device_vendor,
            Device_product: device_product,
            Device_version: device_version,
        });
        deviceModel.save();
    });
};

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
        const QUEUE = "device";
        channel.assertQueue(QUEUE);
        // Step 4: Receive Messages
        channel.consume(
            QUEUE,
            (msg) => {
                console.log(chalk.white.bgMagenta.bold("Device received:----------"));
                const message = JSON.parse(msg.content.toString());
                createMessage(message);
                console.log(chalk.white.bgMagenta.bold("---------------------------"));
                console.log(message);
                console.dir(message);
                console.log(chalk.white.bgMagenta.bold("---------------------------"));
            }, {
                noAck: true,
            }
        );
    });
});