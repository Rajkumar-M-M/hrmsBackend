import mongoose from "mongoose";
import { Schema } from "mongoose";

const leaveSchema = new Schema({
    employeeId: { type: Schema.Types.ObjectId, ref: "Employee", required: true },
   
    leaveType: { 
        type: String, 
        enum: ["Sick Leave","Bereavement Leave", "Privilege Leave", "Loss of Pay"], // Added Privilege Leave
        required: true 
    },
    startDate: { type: Date, required: true },
    toDate: { 
        type: Date, 
        required: true,
        validate: {
            validator: function(value) {
                return value >= this.startDate;
            },
            message: 'toDate must be greater than or equal to startDate'
        }
    },
    reason: { type: String, required: true },
    status: {
        type: String,
        enum: ["Pending", "Approved", "Rejected"],
        default: "Pending",
    },
    appliedAt: { type: Date, default: Date.now }
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

const Leave = mongoose.model("Leave", leaveSchema);
export default Leave;
