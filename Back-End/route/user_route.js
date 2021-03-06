const express = require('express'); //third party
const router = express.Router();
const bcrypt = require('bcryptjs');
const {check, validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');
const UserRegistration = require('../model/user_model');
const { route } = require('./admin_route');
const auth = require('../middleware/auth');

// Add User
router.post('/user/add',
//validation
[   
    
    check('email', "Invalid Email Address ").isEmail(),
    check('name', "You must enter name").not().isEmpty(),
    check('address', "You must enter Address").not().isEmpty()
],
function(req,res){
    console.log("HERE")
    const  errors = validationResult(req)
    console.log(errors.array())
    if(!errors.isEmpty()){
        res.status(400).json(errors.array())
    }
    // if (!errors.isEmail()) {
    //     res.status(400).json(errors.array())
        
    // }
     else {
        
        const name = req.body.name
        const phone = req.body.phone
        const gender = req.body.gender
        const dob = req.body.dob
        const address = req.body.address
        const email = req.body.email
        const password = req.body.password

        bcrypt.hash(password,10, function(err, hash){
            console.log(hash)
            const me = new UserRegistration({
                
                name : name, 
                dob : dob, 
                phone : phone, 
                gender: gender,  
                address:address,  
                email:email, 
                password:hash
            });
           
            me.save()
            .then(function(result){
                // success insert
                console.log("here")
                res.status(200).json({success : true, a : "Registered success"});

            })
            .catch(function(err){
                res.status(201).json({  success : false, message : err})
            });
            console.log("Sucessfully Registered");
        })

    
        
    }
})

//function for Login Function
router.get('/checklogin', function(req,res) {
    res.send(req.user)
    // UserRegistration.find().then(function(data){
    //     res.send(data)
    
    // })
})

router.post('/user/login', function(req,res){
    const email = req.body.email
    const password = req.body.password
    console.log(req.body.email)
    UserRegistration.findOne({email : email}).then(function(userData){
        
        if(userData==null){
            return res.status(403).json({message : "Invalid User!!"})
        }
        bcrypt.compare(password,userData.password, function(err, result){
            if(result==false){
                return res.status(201).json({success:false,message : "Invalid User!!"})          
              }
            //   res.send("authenticated!!!")
            const token = jwt.sign({userId :userData._id},'secretkey');
            res.status(200).json({
                success: true,
                message: "login success",
                token : token
            })
            console.log("HERE")
 
        })
        
    })
    .catch()
    

})

//get one user by _id
router.get('/user/display/:id', function(req, res){
    const id = req.params.id
    UserRegistration.findOne({_id : id})
    .then(function(data){
        res.status(200).json(data);
        console.log(data)
    })

    .catch(function(e){
        res.status(500).json({message:e})
    })
})
 
//display
router.get('/user/display', function(req,res){
   
    UserRegistration.find().then(function(data){
        res.send(data)
    
    })
})





module.exports = router;