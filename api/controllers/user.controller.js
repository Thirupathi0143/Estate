import bcryptjs from "bcryptjs"
import errorHandler from "../utils/error.js";
import User from "../models/user.model.js";
import Listing from "../models/listing.model.js";

export const updateUser = async (req, res, next) => {
  if (req.verifiedUserId !== req.params.id) 
    return next(errorHandler(401, "Unauthorized"));
  
  try {
    if (req.body.password) 
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
 
    const updatedUser = await User.findByIdAndUpdate(req.params.id, {
      $set: {
        userName: req.body.userName, 
        email: req.body.email,
        password: req.body.password,
        avatar: req.body.avatar
      }
    }, {new: true});


    const {password: pass, ...user} = updatedUser._doc;
    res.status(200).json(user);

  } catch (error) {
    next(errorHandler(409, "Duplicate key"));
  }
} 



export const deleteUser = async (req, res, next) => {
  if (req.verifiedUserId !== req.params.id) 
    return next(errorHandler(401, "Unauthorized"));

  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).clearCookie("access_token").json({message: "User has been deleted!"});
  } catch (error) {
    next(error);
  }
}



export const getUserListings = async (req, res, next) => {
  if (req.verifiedUserId !== req.params.id) 
    return next(errorHandler(401, "Unauthorized"));

  try {
    const listings = await Listing.find({ userRef: req.params.id });
    res.status(200).json({
      success: true,
      listings: listings
    });
  } catch(error) {
    next(error);
  }
}



export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return errorHandler(404, "User not found");
    }
    const { password: pass, ...rest } = user._doc;
    res.status(200).json({
      success: true,
      user: rest
    });
  } catch(error) {
    next(error);
  }
}