// Step 1: Create Connection
const amqp = require("amqplib/callback_api");
const chalk = require("chalk");
const db = require("../db");
const MessageModel = require("../models/message-model");

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
    const { version_, signature_, severity, extensionId, deviceId, time } =
    message;

    db.sync().then(function() {
        var messageModel = MessageModel.build({
            version_: version_,
            signature_: signature_,
            severity: severity,
            extensionId: extensionId,
            deviceId: deviceId,
            time: time,
        });
        messageModel.save();
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
        const QUEUE = "message";
        channel.assertQueue(QUEUE);
        // Step 4: Receive Messages
        channel.consume(
            QUEUE,
            (msg) => {
                console.log(chalk.white.bgBlue.bold("Message received:----------"));
                const message = JSON.parse(msg.content.toString());
                createMessage(message);
                console.log(chalk.white.bgBlue.bold("---------------------------"));
                console.dir(message);
                console.log(chalk.white.bgBlue.bold("---------------------------"));
            }, {
                noAck: true,
            }
        );
    });
});