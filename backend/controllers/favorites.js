const Favorite = require("../models/Favorite");
const Hotel = require("../models/Hotel");
const User = require("../models/User");

//@desc Get all favorite
//@route GET /api/v1/favorites
//@access Private
exports.getFavorites = async (req, res, next) => {
  let query;
  //General users can see only their favorites!
  if (req.user.role !== "admin") {
    query = Favorite.find({ user: req.user.id }).populate({
      path: "hotel",
      select: "name province tel",
    });
  } else {
    //If you are an admin, you can see all!
    if (req.params.hotelId) {
      console.log(req.params.hotelId);
      query = Favorite.find({ hotel: req.params.hotelId }).populate({
        path: "hotel",
        select: "name province tel",
      });
    } else {
      query = Favorite.find().populate({
        path: "hotel",
        select: "name province tel",
      });
    }
  }
  try {
    const favorite = await query;
    res.status(200).json({
      success: true,
      count: favorite.length,
      data: favorite,
    });
  } catch (err) {
    console.log(err.stack);
    return res.status(500).json({
      success: false,
      message: "Cannot find favorite",
    });
  }
};

//@desc GET single favorite
//@route GET /api/v1/favorites/:id
//@access Public
exports.getFavorite = async(req,res,next)=>{
  try{
    const favorite = await Favorite.findById(req.params.id).populate({
      path: 'hotel',
      select: 'name description tel'
    });

    if(!favorite){
      return res.status(404).json({success:false, message:`No favorite with the id of ${req.params.id}`});
    }

    res.status(200).json({
      success: true,
      data: favorite
    });
  }catch(error){
    console.log(error);
    return res.status(500).json({success:false, message:"Cannot find favorite"});
  }
}

//@desc Add favorite
//@route POST /api/v1/hotels/:hotelId/favorites/
//@access Private
exports.addFavorite = async (req, res, next) => {
  try {
    req.body.hotel = req.params.hotelId;
    const hotel = await Hotel.findById(req.params.hotelId);
    if (!hotel) {
      return res.status(404).json({ success: false, message: `No hotel with the id of ${req.params.hotelId}` });
    }

    req.body.user = req.user.id;

    // Check if the favorite already exists
    const existingFavorite = await Favorite.findOne({ hotel: req.params.hotelId, user: req.user.id });
    if (existingFavorite) {
      return res.status(400).json({ success: false, message: "Favorite already exists" });
    }

    const favorite = await Favorite.create(req.body);
    res.status(200).json({ success: true, data: favorite });
  } catch (err) {
    console.log(err.stack);
    return res.status(500).json({ success: false, message: "Cannot create favorite" });
  }
};

//@desc Delete favorite
//@route DELETE /api/v1/favorites/:id
//@access Private
exports.deleteFavorite = async(req,res,next)=>{
  try{
    const favorite = await Favorite.findById(req.params.id);
    if(!favorite){
      return res.status(404).json({success:false, message:`No favorite with the id of ${req.params.id}`});
    }
    if(favorite.user.toString()!==req.user.id && req.user.role!=='admin'){ // check owner
      return res.status(401).json({success:false, message:`User ${req.user.id} is not authorized to delete this favorite`});
    }
    await favorite.deleteOne();
    res.status(200).json({
      success:true,
      data:{}
    })
  }catch(error){
    console.log(error.stack);
    return res.status(500).json({success:false, message:"Cannot delete favorite"});
  }
}