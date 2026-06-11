const mqtt = require('mqtt');

const client = mqtt.connect('mqtt://broker.hivemq.com:1883');

client.on('connect', () => {

    console.log('Connected to HiveMQ');

    setInterval(() => {

        const voltage =
    (379 + Math.random() * 4).toFixed(1);

const current =
    (110 + Math.random() * 20).toFixed(1);

const power =
    (42 + Math.random() * 8).toFixed(1);

client.publish(
    'yoga/demo/voltage',
    voltage
);

client.publish(
    'yoga/demo/current',
    current
);

client.publish(
    'yoga/demo/power',
    power
);
        console.log(
            'Voltage Sent:',
            voltage
        );

    }, 1000);

});