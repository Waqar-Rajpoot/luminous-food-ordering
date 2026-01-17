import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
    senderId: { 
        type: String, 
        required: true,
    },
    senderRole: { 
        type: String, 
        enum: ['user', 'manager'], 
        required: true 
    },
    text: { 
        type: String, 
        required: true,
        maxlength: 2000
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
}, { _id: false });

const SupportThreadSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true, 
    },
    messages: [MessageSchema],
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

export default mongoose.models.SupportThread || 
    mongoose.model('SupportThread', SupportThreadSchema);
