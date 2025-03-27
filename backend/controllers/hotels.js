const Reservation = require('../models/Reservation');
const Hotel = require('../models/Hotel');

//@desc Get all hotels
//@route GET /api/v1/hotels
//@access Public
exports.getHotels = async(req,res,next)=>{
    let query;
    //Copy req.query
    const reqQuery={...req.query};
    //Fields to exclude
    const removeFields=['select', 'sort', 'page', 'limit'];
    //Loop over to delete select and sort from the query
    removeFields.forEach(param=>delete reqQuery[param]);
    console.log(reqQuery);

    //Create query string
    let queryStr=JSON.stringify(reqQuery); 
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match=>`$${match}`);

    query = Hotel.find(JSON.parse(queryStr)).populate('reservations').populate('promotions');

    //Select Fields
    if(req.query.select){
        const fields = req.query.select.split(',').join(' ');
        query=query.select(fields);
    }

    //Sort
    if(req.query.sort){
        const sortBy=req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    }else{
        query = query.sort('-createdAt');
    }

    //Pagination
    const page = parseInt(req.query.page, 10)||1;
    const limit = parseInt(req.query.limit,10)||25;
    const startIndex = (page-1)*limit;
    const endIndex = page*limit;

    try{
        const total = await Hotel.countDocuments();
        query = query.skip(startIndex).limit(limit);
        //Execute query
        const hotels = await query;

        //Pagination result
        const pagination={};
        if(endIndex<total){
            pagination.next={
                page:page+1,
                limit
            }
        }

        if(startIndex>0){
            pagination.prev={
                page:page-1,
                limit
            }
        }

        res.status(200).json({success:true, count:hotels.length, data:hotels});
    }catch(err){
        res.status(400).json({success:false});
    }
    
}

//@desc Get single hotel
//@route GET /api/v1/hotels/:id
//@access Public
exports.getHotel = async (req,res,next)=>{
    try{
        const hotel = await Hotel.findById(req.params.id);
        if(!hotel){
            return res.status(400).json({success:false});
        }
        res.status(200).json({success:true, data:hotel});
    }catch(err){
        return res.status(400).json({success:false});
    }
}

//@desc Create a hotel
//@route POST /api/v1/hotels
//@access Private
exports.createHotel = async (req,res,next)=>{
    //console.log(req.body);
    try{
        const hotel = await Hotel.create(req.body);
        if(!hotel) return res.status(400).json({success:false, err});
        res.status(201).json({success:true, data:hotel});
    }catch(err){
        return res.status(400).json({success:false, err});
    }
}

//@desc Update single hotel
//@route PUT /api/v1/hotels/:id
//@access Private
exports.updateHotel = async (req,res,next)=>{
    try{
        const hotel= await Hotel.findByIdAndUpdate(req.params.id, req.body,{
            new:true,
            runValidators:true
        });
        if(!hotel){
            return res.status(400).json({success:false});
        }
        res.status(200).json({success:true, data:hotel});
    }catch(err){
        return res.status(400).json({success:false});
    }
}

//@desc Delete single hotel
//@route DELETE /api/v1/hotels/:id
//@access Private
exports.deleteHotel = async (req,res,next)=>{
    try{
        const hotel= await Hotel.findById(req.params.id);
        if(!hotel){
            return res.status(404).json({success:false, message:`Hotel not found with id of ${req.params.id}`});
        }
        await Reservation.deleteMany({hotel: req.params.id});
        await Hotel.deleteOne({_id: req.params.id})
        res.status(200).json({success:true, data:{}});
    }catch(err){
        return res.status(400).json({success:false});
    }
}

