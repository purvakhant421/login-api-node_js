const bcrypt = require("bcrypt");
const moment = require("moment");
const jwt = require("jsonwebtoken");
const jwtSecrectKey = "cdccsvavsvfssbtybnjnu";
const { userService } = require("../service");
const { auth } = require("../middleware/auth");

// const validation = {
//   body: joi.object.keys({
//     email: joi.string(),
//     password: joi.string(),
//   }),
// };

const register = async (req, res) => {
  // validation;
  const { email, password, role } = req.body;

  //const hashPassword = await bcrypt.hash(password, 8);

  let option = {
    email,
    role,
    password,
    exp: moment().add(1, "days").unix(),
  };

  const token = await jwt.sign(option, jwtSecrectKey);

  const filter = {
    email,
    role,
    password,
  };

  const data = await userService.createUser(filter);

  res.status(200).json({ data });
};

const login = async (req, res) => {
  try {
    // validation;
    const { email, password } = req.body;

    const findUser = await userService.findUserByEmail({ email });

    if (!findUser) throw Error("User not found");
    if(password != findUser.password) throw new Error("Password Incorrect")
    //const successPassword = await bcrypt.compare(password, findUser.password);
    //if (!successPassword) throw Error("Incorrect password");

    let option = {
      email,
      role: findUser.role,
      password,
      exp: moment().add(1, "days").unix(),
    };

    let token;
    if (findUser) {
      token = await jwt.sign(option, jwtSecrectKey);
    }

    let data;
    if (token) {
      data = await userService.findUserAndUpdate(findUser._id, token);
    }

    res.status(200).json({ data });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const getAllUser = async (req, res) => {
  try {
    console.log(req.headers.token,'');
    await auth(req.headers.token, ['admin']);

    const data = await userService.getAllUser({ role: "admin" });
    res.status(200).json({ data });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

module.exports = {
  register,
  login,
  getAllUser,
};
