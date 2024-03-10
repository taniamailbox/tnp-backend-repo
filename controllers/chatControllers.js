const manager = require("../train-model");
const { Chats, Clients } = require("../models");

class chatControllers {
  static async createChat(req, res) {
    try {
      const { question } = req.body;
      const { id } = req.currentUser;
      await manager.train();
      manager.save();
      let respone = await manager.process("en", question);
      await Chats.create({
        question: question,
        answer: respone.answer,
        client_id: id,
      });
      const chats = await Chats.findAll({
        where: { client_id: id },
        include: [
          {
            model: Clients,
            attributes: ["name", "email"],
          },
        ],
      });
      return res.status(201).json({
        status: 'success',
        message: 'Fetched Chat response!',
        data: chats
      });
      
    } catch(err) {
      return res.status(500).json({message: err.message});
    }
    
  }

  static async ChatHistory(req, res) {
    try {
      const { id } = req.currentUser;
      const chats = await Chats.findAll({
        where: { client_id: id },
        include: [
          {
            model: Clients,
            attributes: ["name", "email"],
          },
        ],
      });
      return res.status(201).json({
        status: 'success',
        message: 'Fetched Chat history!',
        data: chats
      });
    } catch(err) {
      return res.status(500).json({message: err.message});
    }
    
  }
}
exports.chatControllers = chatControllers;
