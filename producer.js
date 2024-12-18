import express from "express";
import amqp from "amqplib";


const app = express();
const PORT = 3000;

app.use(express.json());

const sendToQueue = async (message) => {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();
  const queue = "user_notifications";

  await channel.assertQueue(queue);
  channel.sendToQueue(queue, Buffer.from(message));

  console.log("Sent to queue", message);

  setTimeout(() => {
    channel.close();
    connection.close();
  }, 500);
};

app.post("/register", (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).send("Name and email are required");
  }

  const message = JSON.stringify({
    user: { name, email },
    action: "User Registered",
  });

  sendToQueue(message);

  res.status(201).send("User Registered, noitification sent!");
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});