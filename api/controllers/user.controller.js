import Listing from "../models/listing.models.js";
import User from "../models/user.models.js";
import errorHandler from "../utils/error.js";
import bcrypt from "bcryptjs";

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return errorHandler(404, "User not found");

    const { password, ...rest } = user._doc;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

//=======update user api=======//
export const updateUser = async (req, res, next) => {
  const { email, username } = req.body;
  if (req.user.id !== req.params.id)
    return next(throwError(401, "User Invalid"));
  if (req.user.email !== email) { 
    const checkEmail = await User.findOne({ email });
    if (checkEmail) return next(errorHandler(500, "Invalid Information"));
  }
  try {
    if (req.body.password) {
      req.body.password = bcrypt.hashSync(req.body.password, 10);
    }
    const updateUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          password: req.body.password,
          email: req.body.email,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );
    const { password, ...rest } = updateUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(errorHandler(error));
  }
};

//=====Handle User Delete=====//
export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "User Invalid"));
  try {
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie("access_token");
    res.status(200).json("User Deleted Successfully!");
  } catch (error) {
    next(error);
  }
};

//=====Get User Created Post=====//
export const userPosts = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "You can see only your posts"));
  try {
    const posts = await Listing.find({ userRef: req.params.id });
    res.status(200).json(posts);
  } catch (error) {
    next(errorHandler(404, error.message));
  }
};
