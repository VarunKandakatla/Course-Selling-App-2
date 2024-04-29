const { Router } = require("express");
const router = Router();
const {userMiddleware,generateToken} = require("../middleware/user");
const { User, Course } = require("../db");

// User Routes
router.post('/signup', (req, res) => {
    // Implement user signup logic
    User.create(req.body).then((user)=>{
        res.status(200).json({message : 'User created successfully'});
    })
});

router.post('/signin',generateToken, (req, res) => {
    // Implement admin signup logic
    const token = req.headers.token;
    res.status(200).json({token : token});

});

router.get('/courses',userMiddleware, async(req, res) => {
    // Implement listing all courses logic
    const list = await Course.find({});
    res.status(200).json({message : list});
});

router.post('/courses/:courseId', userMiddleware, (req, res) => {
    // Implement course purchase logic
    Course.findById(req.params.courseId)
    .then(async(course)=>{
        if(course == null)
        {
             res.status(400).json({message : 'Course not found!'});
        }
       else{
        await User.findOneAndUpdate({username : req.headers.decoded.username},{'$push' :{purchasedCourses : course}})

        res.status(200).json({message : "Course purchased Successfully"});
    
       }})
});

router.get('/purchasedCourses', userMiddleware, async(req, res) => {
    // Implement fetching purchased courses logic
    const user =await User.findOne({username : req.headers.decoded.username});
    const courses = await Course.find({_id : {'$in' : user.purchasedCourses}});
    res.status(200).json({courses : courses});
});

module.exports = router