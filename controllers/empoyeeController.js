import multer from "multer"
import Employee from "../models/Employee.js"
import User from "../models/User.js"
import bcrypt from "bcrypt"
import path from "path"



const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/uploads")
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({storage: storage})

const addEmployee = async (req, res) => {
    try {
        console.log(req.body);
        
    const {
        name,
        lastname,
        personalEmail,
        address,
        professionalEmail : email,
        city,
        state,
        zipcode,
        employeeId,
        employeetype,
        dob,
        gender,
        maritalStatus,
        designation,
        department,
        password,
        role,
        officelocation,
        accessEmail,
    } = req.body;

    const user = await User.findOne({email})
    if(user){
        return res.status(400).json({
            success: false,
            error: "user already registered in emp"
        })
    }

  
    const hashPassword = await  bcrypt.hash(password, 10)

    const newUser = new User({
        name,
        email,
        password: hashPassword,
        role,
        profileImage: req.file ? req.file.filename : ""

    })

    const savedUser = await newUser.save()

    const newEmployee = new Employee({
        userId: savedUser._id,
        employeeId,
        dob,
        gender,
        maritalStatus,
        designation,
        department,
        location: address,
    })

    await newEmployee.save()
    return res.status(200).json({
        success: true,
        message: "employee created"

    })
    }catch(error){
        console.log(error.message)
        return res.status(500).json({
            success: false,
            error: "server error in adding employee"
        })
    }
}

const getEmployees = async (req, res) => {
    try{
        const employees = await Employee.find().populate('userId', {password: 0}).populate('department')
        return res.status(200).json({
            success:true, 
            employees
        })
    }
    catch(error){
        return res.status(500).json({
            success: false,
            error: "get employees server error"
        })
    }
}

const getEmployee = async (req, res) => {
    const {id} =  req.params;
    try{
        let employee;
        employee = await Employee.findById({_id: id}).populate('userId', {password: 0}).populate('department');
        if(!employee) {
            employee = await Employee.findOne({userId: id}).populate("userId", {password: 0}).populate("department");
        }
        return res.status(200).json({
            success:true, 
            employee
        })
    }
    catch(error){
        return res.status(500).json({
            success: false,
            error: "get employees server error"
        })
    }
}

const updateEmployee = async(req, res) => {
    try{
        const {id} = req.params;
        const {
             name,
             maritalStatus,
             designation,
             department,
             location
        } = req.body;

        const employee = await Employee.findById({_id:id})
        if(!employee){
            return res.status(404).json({
                success: false,
                error: "Employee Not found"
            })
        }
        const user = await User.findById({_id: employee.userId})
        if(!user){
            return res.status(404).json({
                success: false,
                error: "user Not found"
            })
        }

        const updateUser = await User.findByIdAndUpdate({_id: employee.userId}, {name})
        const updateEmployee = await Employee.findByIdAndUpdate({_id:id}, {
            maritalStatus,
            designation,
            location,
            department
        })

        if(!updateEmployee || !updateUser){
            return res.status(404).json({
                success: false,
                error: "document Not found"
            })
        }
        res.status(200).json({
            success:true,
            message:"Employee Updated"
        })

    }catch(error){
        return res.status(500).json({
            success: false,
            error: "update employees server error"
        })
    }
}

export {addEmployee, upload, getEmployees, getEmployee, updateEmployee}