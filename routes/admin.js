const { Router } = require("express");
const {adminMiddleware, generateToken} = require("../middleware/admin");
const { Admin, Course } = require("../db");
const router = Router();

// Admin Routes
router.post('/signup', (req, res) => {
    // Implement admin signup logic
    Admin.create(req.body);
    res.status(200).json({message : "Admin created successfully"});
});

router.post('/signin',generateToken, (req, res) => {
    // Implement admin signup logic
    const token = req.headers.token;
    res.status(200).json({token : token});
});

router.post('/courses', adminMiddleware, (req, res) => {
    // Implement course creation logic
    Course.create(req.body)
    .then((course)=>{
        Admin.findOneAndUpdate({username : req.headers.decoded.username},{'$push' :{addedCourses : course}})
        .then(()=>{
            res.status(200).json({
                message : "Course created successfully!",
                courseId : course._id
            })
        })
    })
});

router.get('/courses', adminMiddleware, (req, res) => {
    // Implement fetching all courses logic
    Course.find({}).then((list)=>{
        res.status(200).json({courses : list});
    })
    
});

module.exports = router;