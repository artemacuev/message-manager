// Step 1: Create Connection
const amqp = require("amqplib/callback_api");
const chalk = require("chalk");
const db = require("../db");
const ExtensionModel = require("../models/extension-model");

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
    const {
        dmac,
        spt,
        request_url,
        file_path,
        end_,
        msg_,
        type_,
        device_version,
    } = message;
    db.sync().then(function() {
        var extensionModel = ExtensionModel.build({
            dmac: dmac,
            sPT: spt,
            request_URL: request_url,
            file_path: file_path,
            end_: end_,
            msg_: msg_,
            type_: type_,
            Device_version: device_version,
        });
        extensionModel.save();
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
        const QUEUE = "extension";
        channel.assertQueue(QUEUE);
        // Step 4: Receive Messages
        channel.consume(
            QUEUE,
            (msg) => {
                console.log(chalk.white.bgYellow.bold("Extension received:----------"));
                const message = JSON.parse(msg.content.toString());
                createMessage(message);
                console.log(chalk.white.bgYellow.bold("---------------------------"));
                console.dir(message);
                console.log(chalk.white.bgYellow.bold("---------------------------"));
            }, {
                noAck: true,
            }
        );
    });
});