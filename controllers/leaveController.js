import Leave from "../models/Leave.js";
import Employee from "../models/Employee.js";
import { io, userSocketMap } from "../index.js";

const addLeave = async (req, res) => {
  try {
    const { userId, leaveType, startDate, toDate, reason } = req.body;
    const employee = await Employee.findOne({ userId }).populate('userId', 'name');

    // new addedd
    if (!employee) {
      return res.status(404).json({
        success: false,
        error: "Employee not found",
      });
    }

    const newLeave = new Leave({
      employeeId: employee._id,
      leaveType,
      startDate,
      toDate,
      reason,
    });
    await newLeave.save();

    console.log("Populated Employee:", employee);
    // 🔔 Emit ONLY to the 'admins' room
    io.to("admins").emit("new_leave_request", {
      employee: employee.userId.name, // or full name if populated
      leaveType,
      startDate,
      toDate,
      reason,
      status: "Pending",
    });
    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      error: "Leave add server error",
    });
  }
};

const getLeave = async (req, res) => {
  try {
    const { id, role } = req.params;
    let leaves;
    if (role === "admin") {
      leaves = await Leave.find({ employeeId: id });
    } else {
      const employee = await Employee.findOne({ userId: id });
      leaves = await Leave.find({ employeeId: employee._id });
    }

    return res.status(200).json({
      success: true,
      leaves,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      error: "Leave add server error",
    });
  }
};

const getLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find().populate({
      path: "employeeId",
      populate: [
        {
          path: "department",
          select: "dep_name",
        },
        {
          path: "userId",
          select: "name",
        },
      ],
    });
    return res.status(200).json({
      success: true,
      leaves,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      error: "Leave fetch server error",
    });
  }
};

const getLeaveDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const leave = await Leave.findById({ _id: id }).populate({
      path: "employeeId",
      populate: [
        {
          path: "department",
          select: "dep_name",
        },
        {
          path: "userId",
          select: "name profileImage",
        },
      ],
    });
    return res.status(200).json({
      success: true,
      leave,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      error: "leave detail server error",
    });
  }
};

const updateLeave = async (req, res) => {
    try {
      const { id } = req.params;
  
      // STEP 1: Find the leave and populate employee details
      const leave = await Leave.findById(id).populate({
        path: "employeeId",
        populate: { path: "userId", select: "name" },
      });
  
      if (!leave) {
        return res.status(404).json({
          success: false,
          error: "Leave not found",
        });
      }
  
      // STEP 2: Update the leave status
      leave.status = req.body.status;
      await leave.save();
  
      // STEP 3: Get employee's socket ID
      const employeeUserId = leave.employeeId.userId._id.toString();
      const socketId = userSocketMap[employeeUserId];
  
      // STEP 4: Notify the employee if connected
      if (socketId) {
        io.to(socketId).emit("leave_status_updated", {
          name: leave.employeeId.userId.name,
          leaveType: leave.leaveType,
          status: leave.status,
          startDate: leave.startDate,
          toDate: leave.toDate,
        });
      }
  
      return res.status(200).json({
        success: true,
        message: "Leave status updated",
      });
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({
        success: false,
        error: "Leave update server error",
      });
    }
  };

const getLeaveBalanceDetails = async (req, res) => {
  const { leaveType, year } = req.query;

  try {
    // Query the database using leaveType and year
    const leaveDetails = await Leave.find({ leaveType, year });

    // Check if leaveDetails is an empty array
    if (!leaveDetails.length) {
      return res
        .status(404)
        .json({
          message: "No leave details found for the specified criteria.",
        });
    }

    // Respond with the found leave details
    res.status(200).json(leaveDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export {
  addLeave,
  getLeave,
  getLeaves,
  getLeaveDetail,
  updateLeave,
  getLeaveBalanceDetails,
};
