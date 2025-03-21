const Reservation = require("../models/Reservation");
const Hotel = require("../models/Hotel");

//@desc Get all reservations
//@route GET /api/v1/reservations
//@access Private
exports.getReservations = async (req, res, next) => {
  let query;
  //General users can see only their reservations!
  if (req.user.role !== "admin") {
    query = Reservation.find({ user: req.user.id }).populate({
      path: "hotel",
      select: "name province tel",
    });
  } else {
    //If you are an admin, you can see all!
    if (req.params.hotelId) {
      console.log(req.params.hotelId);
      query = Reservation.find({ hotel: req.params.hotelId }).populate({
        path: "hotel",
        select: "name province tel",
      });
    } else {
      query = Reservation.find().populate({
        path: "hotel",
        select: "name province tel",
      });
    }
  }
  try {
    const reservations = await query;
    res.status(200).json({
      success: true,
      count: reservations.length,
      data: reservations,
    });
  } catch (err) {
    console.log(err.stack);
    return res.status(500).json({
      success: false,
      message: "Cannot find Reservation",
    });
  }
};

//@desc GET single reservation
//@route GET /api/v1/reservations/:id
//@access Public
exports.getReservation = async(req,res,next)=>{
  try{
    const reservation = await Reservation.findById(req.params.id).populate({
      path: 'hotel',
      select: 'name description tel'
    });

    if(!reservation){
      return res.status(404).json({success:false, message:`No reservation with the id of ${req.params.id}`});
    }

    res.status(200).json({
      success: true,
      data: reservation
    });
  }catch(error){
    console.log(error);
    return res.status(500).json({success:false, message:"Cannot find Reservation"});
  }
}

//================Ruj do this
//@desc Add reservation
//@route POST /api/v1/hotels/:hospitalId/reservations/
//@access Private
exports.addAppointment = async(req,res,next)=>{
  try{
    req.body.hospital = req.params.hospitalId;
    const hospital = await Hospital.findById(req.params.hospitalId);
    if(!hospital){
      return res.status(404).json({success:false, message:`No hospital with the id of ${req.params.hospitalId}`});
    }
    req.body.user = req.user.id;
    const existedAppointments = await Appointment.find({user:req.user.id});
    if(existedAppointments.length>=3 && req.user.role!=='admin'){
      return res.status(400).json({success:false, message:`The user with ID ${req.user.id} has already made 3 appointments`});
    }
    const appointment = await Appointment.create(req.body);
    res.status(200).json({success:true, data: appointment});
  }catch(err){
    console.log(err.stack);
    return res.status(500).json({success:false, message:'Cannot create appointment'});
  }
}

//@desc Update appointment
//@route Put /api/v1/appointments/:id
//@access Private
exports.updateAppointment = async (req,res,next)=>{
  try{
    let appointment = await Appointment.findById(req.params.id);
    if(!appointment){
      return res.status(404).json({success:false, message:`No appointment with the id of ${req.params.id}`});
    }
    if(appointment.user.toString()!==req.user.id&&req.user.role!=='admin'){
      return res.status(401).json({success:false, message:`User ${req.user.id} is not authorized to update this appointment`});
    }
    appointment = await Appointment.findByIdAndUpdate(req.params.id,req.body,{
      new:true,
      runValidators:true
    });

    res.status(200).json({
      success:true,
      data: appointment
    });
  }catch(error){
    console.log(error.stack);
    return res.status(500).json({success:false, message:"Cannot update Appointment"});
  }
}

//@desc Delete appointment
//@route DELETE /api/v1/appointments/:id
//@access Private
exports.deleteAppointment = async(req,res,next)=>{
  try{
    const appointment = await Appointment.findById(req.params.id);
    if(!appointment){
      return res.status(404).json({success:false, message:`No appointment with the id of ${req.params.id}`});
    }
    if(appointment.user.toString()!==req.user.id&&req.user.role!=='admin'){
      return res.status(401).json({success:false, message:`User ${req.user.id} is not authorized to delete this bootcamp`});
    }
    await appointment.deleteOne();
    res.status(200).json({
      success:true,
      data:{}
    })
  }catch(error){
    console.log(error.stack);
    return res.status(500).json({success:false, message:"Cannot delete Appointment"});
  }
}