import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config";
import User from "../models/user.model.js";
import errorHandler from "../utils/error.js";


export const signup = async (req, res, next) => {
  const { userName, email, password } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({userName: userName, email: email, password: hashedPassword});
  try {
    await newUser.save();
    res.status(201).json({"message": "New User Created!"});
  } catch(error) {
    next(error);
  } 
}      




export const signin = async (req, res, next) => {
  const {email, password} = req.body;
  try { 
    const validUser = await User.findOne({email: email});
    if (!validUser) return next(errorHandler(404, "User not found!"));
    const isvalidPassword = bcryptjs.compareSync(password, validUser.password);
    if (!isvalidPassword) return next(errorHandler(401, "Unauthorized"));
    const token = jwt.sign(validUser._id.toString(), process.env.JWT_SECRET_KEY);
    const {password: pass, ...user} = validUser._doc;
    res.cookie("access_token", token, {httpOnly: true})
       .status(200)
       .json(user);
  } catch(error) {
    next(error);  
  }
}




export const google = async (req, res, next) => {
  try {
    const user = await User.findOne({email: req.body.email});
    if (user) {
      const token = jwt.sign(user._id.toString(), process.env.JWT_SECRET_KEY);
      const { password: pass, ...rest} = user._doc;
      res.cookie("access_token", token, {httpOnly: true})
         .status(200)
         .json(rest);
    } else {
      const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new User({userName: req.body.name, email: req.body.email, password: hashedPassword, avatar: req.body.photoURL});
      await newUser.save();
      const token = jwt.sign(newUser._id.toString(), process.env.JWT_SECRET_KEY);
      const { password: pass, ...user } = newUser._doc;
      res.cookie("access_token", token, {httpOnly: true})
         .status(201)
         .json(user);
    }
  } catch (error) {
    next(error);
  }
}



export const signOut = async (req, res, next) => {
  try {
    res.status(200).clearCookie("access_token").json({
      message: "User has been logged out!"
    });
  } catch (error) { 
    next(error);
  }
}