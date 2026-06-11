const express = require('express');
const mqtt = require('mqtt');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

const mqttClient = mqtt.connect(
    'mqtt://broker.hivemq.com:1883'
);

mqttClient.on('connect', () => {

    console.log('MQTT Connected');

mqttClient.subscribe(
    'yoga/demo/#'
);

});

mqttClient.on(
    'message',
    (topic, message) => {

        console.log(
            'MQTT RECEIVED:',
            topic,
            message.toString()
        );

        io.emit('mqtt-data', {
            topic: topic,
            value: message.toString()
        });

    }
);

server.listen(3000, () => {

    console.log(
        'Web Server Running'
    );

});