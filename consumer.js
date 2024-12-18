import amqp from "amqplib";

const consumeFromQueue = async () => {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();
  const queue = "user_notifications";

  await channel.assertQueue(queue);
  console.log("Waiting for messages in queue", queue);

  channel.consume(queue, (msg) => {
    if (msg !== null) {
      const message = JSON.parse(msg.content.toString());
      console.log("Received message:", message);

      console.log(`Sending notification to: ${message.user.email}`);
      console.log("Notification sent!");

      channel.ack(msg);
    }
  });
};

consumeFromQueue();
