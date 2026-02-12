import jwt from "jsonwebtoken";
import { config } from "../configs/env.js";
import Admin from "../models/Admin.model.js";
import Receptionist from "../models/Receptionist.model.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authorization token missing",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, config.JWT_SECRET);

    let user = null;

    if (decoded.role === "admin") {
      user = await Admin.findById(decoded.id);
    } else if (decoded.role === "receptionist") {
      user = await Receptionist.findById(decoded.id);
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    req.user = user;
    req.userRole = decoded.role;
    next();
  } catch (error) {
    next(error);
  }
};
