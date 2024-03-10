const express = require("express");
const { authenticate } = require("../middleware/authentication");
const { chatControllers } = require("../controllers/chatControllers");

const Router = express.Router();

Router.get("/", authenticate, chatControllers.ChatHistory);

Router.post("/", authenticate, chatControllers.createChat);

exports.chatRouter = Router;
