const jwt = require("jsonwebtoken");
require("dotenv").config();
const { Clients } = require("../models");
const authenticate = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    const token = header && header.split(" ")[1];
    console.log(token);
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decode = jwt.verify(token, '8Zz5tw0Ionm3XPZZfN0NOml3z9FMfmpgXwovR9fp6ryDIoGRM8EPHAB6iHsc0fb');//process.env.JWT_SECRET
    console.log(decode.id);
    const user = await Clients.findOne({ where: { id: decode.id } });
    console.log('authenticate', user);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.currentUser = user;
    next();
  } catch(err) {
    return res.status(401).json({ message: err.message });
  }
  
};

const authenticateSocket = async (socket, token, next) => {
  try {
    if (!token) {
      return;
    }
    const decode = jwt.verify(token, '8Zz5tw0Ionm3XPZZfN0NOml3z9FMfmpgXwovR9fp6ryDIoGRM8EPHAB6iHsc0fb');//process.env.JWT_SECRET
    console.log(decode.id);
    const user = await Clients.findOne({ where: { id: decode.id } });
    //console.log('authenticateSocket', user);
    if (!user) {
      return;
    }
    socket.request.currentUser = user;
    next();
  } catch(err) {
    return;
  }
  
};

module.exports = {
  authenticate: authenticate,
  authenticateSocket: authenticateSocket 
};
