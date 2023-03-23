import User from "../models/User.js";
import generateJWT from "../helpers/generateJWT.js";
import generateId from "../helpers/generateId.js";

export const register = async (req, res) => {
  const { body } = req;
  const { email } = body;

  const existsUser = await User.findOne({ email });

  if (existsUser) {
    const error = new Error("Already registered user");
    return res.status(400).json({ msg: error.message });
  }

  try {
    const user = new User(body);
    const userSaved = await user.save();
    res.json(userSaved);
  } catch (error) {
    console.log(error);
  }
};

export const profile = (req, res) => {
  const { user } = req;

  res.json({ profile: user });
};

export const confirm = async (req, res) => {
  const { token } = req.params;

  const confirmUser = await User.findOne({ token });

  if (!confirmUser) {
    const error = new Error("Invalid token");
    return res.status(404).json({ msg: error.message });
  }

  try {
    confirmUser.token = null;
    confirmUser.confirmed = true;

    await confirmUser.save();

    res.json({ msg: "User configured successfully" });
  } catch (error) {
    console.log(error);
  }
};

export const authenticate = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    const error = new Error("User does not exist");
    return res.status(404).json({ msg: error.message });
  }

  if (!user.confirmed) {
    const error = new Error("Your account is not confirmed");
    return res.status(403).json({ msg: error.message });
  }

  if (await user.checkPassword(password)) {
    res.json({ token: generateJWT(user._id) });
  } else {
    const error = new Error("Incorrect Password");
    return res.status(404).json({ msg: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const existsUser = await User.findOne({ email });

  if (!existsUser) {
    const error = new Error("User does not exist");
    return res.status(400).json({ msg: error.message });
  }

  try {
    existsUser.token = generateId();
    await existsUser.save();

    res.json({ msg: "We have sent an email with the instructions" });
  } catch (error) {
    console.log(error);
  }
};

export const checkToken = async (req, res) => {
  const { token } = req.params;

  const validToken = await User.findOne({ token });

  if (validToken) {
    res.json({ msg: "Token valido y el usuario existe" });
  } else {
    const error = new Error("Token no valido");
    return res.status(400).json({ msg: error.message });
  }
};

export const newPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const user = await User.findOne({ token });

  if (!user) {
    const error = new Error("hubo un Error");
    return res.status(400).json({ msg: error.message });
  }

  try {
    user.token = null;
    user.password = password;

    await user.save();

    res.json({ msg: "Password modificado correctamente" });
  } catch (error) {
    console.log(error);
  }
};
