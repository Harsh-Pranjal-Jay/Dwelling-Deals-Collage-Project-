import Listing from '../models/listing.models.js';
import User from '../models/user.models.js';
import errorHandler from '../utils/error.js'

export const getUsers = async (req, res, next) => {
    try{
        const users = await User.find({ email: { $ne: process.env.ADMIN_USER_NAME } });

        return res.status(200).json(users);
    }
    catch(error){
        next(error);
    }
};

export const getListingsDetails = async (req, res, next) => {
    try{
        const listings = await Listing.find();

        return res.status(200).json(listings);
    }
    catch(error){
        next(error);
    }
}

export const updatePost = async (req, res, next) => {
    console.log("Called");
    try {
      const updatedPost = await Listing.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );
    console.log("UpdatedPost");
    console.log(updatedPost);
      res.status(200).json(updatedPost);
    } catch (error) {
      next(error);
    }
  };

export const deleteListing = async (req, res, next) => {
    const listing = await Listing.findById(req.params.id);

    if(!listing){
        return next(errorHandler(404, 'Listing Not Found'));
    }

    try{
        await Listing.findByIdAndDelete(req.params.id);
        res.status(200).json('Listing has been deleted');
    }
    catch(error){
        next(error);
    }
}

export const deleteUser = async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if(!user){
        return next(errorHandler(404, 'User Not Found'));
    }

    try{
        await Listing.deleteMany({ userRef: req.params.id });
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json('User and associated listing has been deleted');
    }
    catch(error){
        next(error);
    }
}


export const getUserInfo = async (req, res, next) => {
    const userId = req.params.id;

    try{
        const user = await User.find({ _id: userId });
        return res.status(200).json(user);
    }
    catch(error){
        next(error);
    }
}

export const getListingInfo = async (req, res, next) => {
    const listingId = req.params.id;

    try{
        const listing = await Listing.find({ _id: listingId });
        return res.status(200).json(listing);
    }
    catch(error){
        next(error);
    }
}