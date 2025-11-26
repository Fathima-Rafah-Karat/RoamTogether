import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";
import Auth from "../model/auth.model.js";

const authorize = (requiredRole = "Traveler") => {
  return async (req, res, next) => {
    try {
      let token;

      if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
      }

      if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
      }

      const decoded = jwt.verify(token, JWT_SECRET);

      const user = await Auth.findById(decoded.userId);
      if (!user) {
        return res.status(401).json({ message: "Unauthorized: User not found" });
      }

      if (requiredRole && user.role !== requiredRole) {
        return res.status(403).json({ message: "Forbidden: Access denied" });
      }

      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({ message: "Unauthorized", error: error.message });
    }
  };
};

export default authorize;
