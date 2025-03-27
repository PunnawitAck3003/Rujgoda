const mongoose = require('mongoose');

const PromotionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true,
        maxlength: [100, 'Title can not be more than 100 characters']
    },
    discountType: {
        type: String,
        enum: ['percentage', 'fixed'], // ส่วนลดเป็น % หรือเป็นจำนวนเงิน
        required: true
    },
    discountValue: {
        type: Number,
        required: true
    },
    startDate: {
        type: Date,
        required: [true, 'Please add a start date']
    },
    endDate: {
        type: Date,
        required: [true, 'Please add an end date']
    },
    hotel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hotel',
        required: true
    },
    minBookingPrice: {
        type: Number,
        default: 0 // ยอดจองขั้นต่ำเพื่อใช้โปรโมชัน
    },
    maxDiscount: {
        type: Number,
        default: null // จำกัดส่วนลดสูงสุด (เฉพาะถ้าเป็น %)
    },
    isActive: {
        type: Boolean,
        default: true // ใช้เช็คว่าโปรโมชันนี้ยังใช้งานได้หรือไม่
    }
});
module.exports = mongoose.model('Promotion', PromotionSchema);