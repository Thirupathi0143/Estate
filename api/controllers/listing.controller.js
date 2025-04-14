import Listing from "../models/listing.model.js"
import errorHandler from "../utils/error.js";

export const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    return res.status(201).json({
      success: true,
      listing: listing
    });
  } catch (error) {
    next(error);
  }
}



export const deleteListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, "Listing not found"));
    }

    if (req.verifiedUserId !== listing.userRef) {
      return next(errorHandler(401, "Unauthorized"));
    }

    await Listing.findByIdAndDelete(req.params.id);
    res.status(204).json({});
  } catch (error) {
    next(error);
  }
}



export const updateListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    return next(errorHandler(404, "Listing not found"));  
  }

  if (req.verifiedUserId !== listing.userRef) {
    return next(errorHandler(401, "Unauthorized"));
  }

  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      {new: true}
    );
    res.status(200).json({
      status: true,
      listing: updatedListing
    });
  } catch(error) {
    next(error);
  }
}




export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, "Listing not found"));  
    }

    res.status(200).json({
      status: true,
      listing: listing
    });
  } catch(error) {
    next(error);
  }
}



export const getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;
    const searchTerm = req.query.searchTerm || "";
    const sort = req.query.sort || "createdAt";
    const order = req.query.order && req.query.order.toLowerCase() === 'asc' ? 'asc' : 'desc'; // Validate order parameter

    let offer = req.query.offer;
    let furnished = req.query.furnished;
    let parking = req.query.parking;
    let type = req.query.type;

    if (offer === undefined || offer === "false") {
      offer = { $in: [false, true] };
    }

    if (furnished === undefined || furnished === "false") {
      furnished = { $in: [false, true] };
    }

    if (parking === undefined || parking === "false") {
      parking = { $in: [false, true] };
    }

    if (type === undefined || type === "all") {
      type = { $in: ["sale", "rent"] };
    }

    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: "i" },
      offer, furnished, parking, type
    })
    .sort({ [sort]: order })
    .limit(limit)
    .skip(startIndex);

    return res.status(200).json({
      success: true,
      listings: listings
    });
  } catch(error) {
    next(error);
  }
}
