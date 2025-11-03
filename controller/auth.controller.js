import mongoose from "mongoose";
import Auth from "../model/auth.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_EXPIRES_IN } from "../config/env.js";

export const signUp = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { username, email, password, phone, role } = req.body;

    //  user already exists    check if user already exists by email or phone
    const existingUser = await Auth.findOne({
      $or: [{ email }, { phone }]
    });
    if (existingUser) {
      await session.abortTransaction();
      session.endSession();
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = await Auth.create([{ email, password: hashedPassword, phone, username, role }], { session });

    const token = jwt.sign(
      { userId: newUser[0]._id },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        token,
        user: newUser[0],
      },
    });
  }
  catch (error) {
    next(error)
  }
}

export const signIn = async (req, res, next) => {
  try {
    // identifier  -can be username or email   - in postman give identifierand password if the identifier is email or username
    const { identifier, password } = req.body;
    if (!identifier || !password) {
       return res.status(400).json({
        success: false,
        message: "Please provide username/email and password",
      });
    }
    // Find user by email or username
    const user = await Auth.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    })
    // if the user is not existing
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const ispasswordvalid = await bcrypt.compare(password, user.password);
    // if the password is not validate
    if (!ispasswordvalid) {
      const error = new Error("invalid password");
      error.statusCode = 401;
      throw error;
    }
    // if the password is validate generate new token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    res.status(200).json({
      success: true,
      message: "user singned in successfully",
      data: {
        token,
        user,
      }
    })
  }
  catch (error) {
    next(error);
  }
}

export const signOut = async (req, res, next) => {
  res.status(200).json({
    success:true,
    message:"user signed out successfully"
  })

}