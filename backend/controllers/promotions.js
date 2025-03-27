const Reservation = require("../models/Reservation");
const Hotel = require("../models/Hotel");
const Promotion = require("../models/Promotion")

//@desc Get all promotion
//@route GET /api/v1/promotion
//@access Private
exports.getPromotions = async (req, res, next) => {
  let query;

    //admin and user you can see all
    if (req.params.hotelId) {
        console.log(req.params.hotelId);
        query = Promotion.find({ hotel: req.params.hotelId }).populate({
            path: "hotel",
            select: "name province tel",
        });
    } else {
        query = Promotion.find().populate({
            path: "hotel",
            select: "name province tel",
        });
    }

  try {
    const promotions = await query;
    res.status(200).json({
      success: true,
      count: promotions.length,
      data: promotions,
    });
  } catch (err) {
    console.log(err.stack);
    return res.status(500).json({
      success: false,
      message: "Cannot find promotion",
    });
  }
};

//@desc GET single promotion
//@route GET /api/v1/promotion/:id
//@access Public
exports.getPromotion = async(req,res,next)=>{
  try{
    const promotion = await Promotion.findById(req.params.id).populate({
      path: 'hotel',
      select: 'name description tel'
    });

    if(!promotion){
      return res.status(404).json({success:false, message:`No promotion with the id of ${req.params.id}`});
    }

    res.status(200).json({
      success: true,
      data: promotion
    });
  }catch(error){
    console.log(error);
    return res.status(500).json({success:false, message:"Cannot find Promotion"});
  }
}

//@desc Add promotion
//@route POST /api/v1/hotels/:hotelId/promotions/
//@access Private
exports.addPromotion = async(req,res,next)=>{
  try{

    if(req.user.role!=='admin'){ // if user try to add promotion then cancel
        return res.status(401).json({success:false, message:`User ${req.user.id} is not authorized to add the promotion`});
    }

    req.body.hotel = req.params.hotelId;
    const hotel = await Hotel.findById(req.params.hotelId);
    if(!hotel){
      return res.status(404).json({success:false, message:`No hotel with the id of ${req.params.hotelId}`});
    }
    req.body.user = req.user.id;

    // TO CHECK DATE

    const promotion = await Promotion.create(req.body);
    
    res.status(200).json({success:true, data: promotion});
  }catch(err){
    console.log(err.stack);
    return res.status(500).json({success:false, message:'Cannot create promotion'});
  }
}

//@desc Update reservation
//@route Put /api/v1/reservations/:id
//@access Private
exports.updatePromotion = async (req,res,next)=>{
  try{
    if(req.user.role!=='admin'){ // if user try to add promotion then cancel
        return res.status(401).json({success:false, message:`User ${req.user.id} is not authorized to update this promotion`});
    }

    let promotion = await Promotion.findById(req.params.id);
    if(!promotion){
      return res.status(404).json({success:false, message:`No promotion with the id of ${req.params.id}`});
    }

    promotion = await Promotion.findByIdAndUpdate(req.params.id,req.body,{
      new:true,
      runValidators:true
    });

    res.status(200).json({
      success:true,
      data: promotion
    });
  }catch(error){
    console.log(error.stack);
    return res.status(500).json({success:false, message:"Cannot update promotion"});
  }
}

//@desc Delete reservation
//@route DELETE /api/v1/reservations/:id
//@access Private
exports.deletePromotion = async(req,res,next)=>{
  try{
    const promotion = await Promotion.findById(req.params.id);
    if(!promotion){
      return res.status(404).json({success:false, message:`No promotion with the id of ${req.params.id}`});
    }
    if(req.user.role!=='admin'){
      return res.status(401).json({success:false, message:`User ${req.user.id} is not authorized to delete this promotion`});
    }
    await promotion.deleteOne();
    res.status(200).json({
      success:true,
      data:{}
    })
  }catch(error){
    console.log(error.stack);
    return res.status(500).json({success:false, message:"Cannot delete promotion"});
  }
}