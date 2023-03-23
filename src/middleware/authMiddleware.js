import jwt from "jsonwebtoken";
import User from "../models/User.js";

const checkAuth = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      const { authorization } = req.headers;
      token = authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const { id } = decoded;

      req.user = await User.findById(id).select("-password -token -confirmed");
      return next();
    } catch (error) {
      const err = new Error("Invalid token");
      return res.status(403).json({ msg: err.message });
    }
  }

  if (!token) {
    const err = new Error("Token does not exist");
    res.status(403).json({ msg: err.message });
  }

  next();
};

export default checkAuth;
