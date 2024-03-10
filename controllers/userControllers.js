const { encrypt } = require("../helpers/encrpyt");
const { Clients } = require("../models");

class userController {
  static async createUser(req, res) {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password) {
        return res.status(400).json({ message: "Please enter all fields" });
      }
      let userExists = await Clients.findOne({where: { email } });
      if(userExists === null) {
        const hashpass = await encrypt.encryptPassword(password);
        console.log(hashpass);
        const user = await Clients.create({ name, email, password: hashpass });
        const token = encrypt.generateToken({ id: user.id });
  
        res.status(201).json({
          status: 'success',
          message: "User created successfully",
          data: {
            user: {
              name: user.name,
              email: user.email
            },
            token
          } 
        });
      } else {
        res.status(201).json({
          status: 'success',
          message: "User Already Exists!",
          data: null
        });
      }
      
    } catch (error) {
      res.status(500).json({
        status: 'failed', 
        message: error.message 
      });
    }
  }
  static async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await Clients.findOne({ where: { email } });
      let comparePassword;
      if(user !== null) {
        comparePassword = await encrypt.comparePassword(password, user?.password);
      }

      if (!user || !comparePassword) {
        return res.status(400).json({
          status: 'success', 
          message: "Invalid email or password" 
        });
      }
      const token = encrypt.generateToken({ id: user.id });
  
      return res.status(200).json({ 
        status: 'success',
        message: "login success",
        data: {
          user: {
            name: user.name,
            email: user.email
          },
          token
        } 
         
      });
    } catch(err) {
      return res.status(500).json({
        status: 'failed', 
        message: err.message 
      });
    }
  }
}

exports.userController = userController;
