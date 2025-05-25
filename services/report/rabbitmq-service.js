const amqplib = require('amqplib');

class RabbitMQService {
    static instance;
    connection;
    channel;

    static async getInstance() {
        if (!this.instance) {
            this.instance = new RabbitMQService();
            await this.instance.connect();
        }
        return this.instance;
    }

    async connect() {
        this.connection = await amqplib.connect(process.env.RABBITMQ_URL || 'amqp://q-rabbitmq');
        this.channel = await this.connection.createChannel();
    }

    async consume(queue, callback) {
        await this.channel.assertQueue(queue, { durable: true });
        this.channel.consume(queue, (msg) => {
            callback(msg);
            this.channel.ack(msg);
        });
    }
}

module.exports = RabbitMQService;