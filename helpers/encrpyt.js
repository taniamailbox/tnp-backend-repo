const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const { JWT_SECRET = " " } = process.env;
class encrypt {
  static async encryptPassword(password) {
    return bcrypt.hashSync(password, 10);
  }
  static async comparePassword(password, hash) {
    return bcrypt.compareSync(password, hash);
  }

  static generateToken(payload) {
    return jwt.sign(payload, '8Zz5tw0Ionm3XPZZfN0NOml3z9FMfmpgXwovR9fp6ryDIoGRM8EPHAB6iHsc0fb', {
      //expiresIn: "1d",
    });
  }
}
exports.encrypt = encrypt;
