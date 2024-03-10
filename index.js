const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { sequelize } = require("./models");
const { userRouter } = require("./routes/userRoutes");
const { chatRouter } = require("./routes/chatRouter");
const { chatControllers } = require("./controllers/chatControllers");
const { authenticateSocket } = require("./middleware/authentication");
const { request } = require("request");
dotenv.config();
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server, {
  cors: {origin : 'http://localhost:4200'}
});
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/auth", userRouter);
app.use("/chat", chatRouter); 

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  authenticateSocket(socket, token, next);
  //next();
});

io.on('connection', socket => {
  console.log('A user connected');
  socket.on('message', async message => {
    // Process and send response using OpenAI
    //const chatbotResponse = "Hello! I'm your chatbot.";
    //socket.emit('response', response);
  });
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});


app.use("*", (req, res) => {
  res.status(404).json({ message: "Not found" });
});

class dbConnect {
  static async connect() {
    try {
      await sequelize.authenticate();
      console.log("Connection has been established successfully.");
    } catch (error) {
      console.error("Unable to connect to the database:", error);
    }
  }
}

server.listen(port, async () => {
  await dbConnect.connect();
  console.log(`app listening at http://localhost:${port}`);
});
