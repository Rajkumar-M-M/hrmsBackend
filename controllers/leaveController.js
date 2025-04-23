import Leave from '../models/Leave.js'
import Employee from '../models/Employee.js'

const addLeave = async (req, res) => {
    try{
        const {userId, leaveType, startDate, toDate, reason} = req.body
        const employee = await Employee.findOne({userId})

        // new addedd
        if (!employee) {
            return res.status(404).json({
                success: false,
                error: "Employee not found"
            });
        }

        const newLeave = new Leave({
           employeeId: employee._id, leaveType, startDate, toDate, reason
        })
        await newLeave.save()
        return res.status(200).json({
            success: true
        })
    }
    catch(error){
        console.log(error.message)
        return res.status(500).json({
            success: false,
            error:"Leave add server error"
        })
    }
}

const getLeave = async (req, res) => {
    try{
        const {id, role} = req.params;
        let leaves
        if(role === "admin"){
            leaves = await Leave.find({employeeId: id})
        }else{
            const employee = await Employee.findOne({userId: id})
            leaves = await Leave.find({employeeId: employee._id})
        }
       
        return res.status(200).json({
            success:true, 
            leaves
        })
    }
    catch(error){
        console.log(error.message)
        return res.status(500).json({
            success: false,
            error:"Leave add server error"
        })
    }
}

const getLeaves = async (req,res) => {
    try{
        const leaves =  await Leave.find().populate({
            path:"employeeId",
            populate:[
                {   
                    path: 'department',
                    select: 'dep_name'
                },
                {
                    path: 'userId',
                    select: 'name'
                }
            ]    
        })
        return res.status(200).json({
            success:true, 
            leaves
        })
    }
    catch(error){
        console.log(error.message)
        return res.status(500).json({
            success: false,
            error:"Leave fetch server error"
        })
    }
}

const getLeaveDetail = async (req, res) => {
    try{
        const {id}  = req.params;
        const leave = await Leave.findById({_id: id}).populate({
            path: 'employeeId',
            populate: [
                {
                    path: 'department',
                    select: 'dep_name'
                },
                {
                    path: 'userId',
                    select: 'name profileImage'
                }
            ]
        })
        return res.status(200).json({
            success:true,
            leave
        })
    } catch(error){
        console.log(error.message)
        return res.status(500).json({
            success: false,
            error: "leave detail server error"
        })
    }

}

const updateLeave = async (req, res) => {
    try{
        const {id} = req.params;
        const leave = await Leave.findByIdAndUpdate({_id: id}, {status: req.body.status})
        if(!leave){
            return res.status(404).json({
                success: false,
                error: "leave not founded"
            })
        }return res.status(200).json({
            success: true,
        })

    }catch(error){
        console.log(error.message)
        return res.status(500).json({
            success: false,
            error: "leave update server error"
        })
    }
}

const getLeaveBalanceDetails = async (req, res) => {
    const { leaveType, year } = req.query;

    try {
        // Query the database using leaveType and year
        const leaveDetails = await LeaveModel.find({ leaveType, year });

        // Check if leaveDetails is an empty array
        if (!leaveDetails.length) {
            return res.status(404).json({ message: 'No leave details found for the specified criteria.' });
        }

        // Respond with the found leave details
        res.status(200).json(leaveDetails);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};









export {addLeave, getLeave, getLeaves, getLeaveDetail,updateLeave, getLeaveBalanceDetails}