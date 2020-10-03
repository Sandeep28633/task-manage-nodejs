const express = require('express')
const User = require('../models/User')
const router = express.Router()
const authMiddleWare = require('../middleware/auth');
const sharp = require('sharp');
//mutler file upload

const mutler = require('multer');
const auth = require('../middleware/auth');


//singup
router.post('/users', async (req, res) => {
    const user = new User(req.body)
//need to generate JWT that will be sent to user back
    try {
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).send({user,token})
    } catch (e) {
        res.status(400).send(e)
    }
})

//login router
router.post("/users/login",async(req,res)=>{
    try {
        const user = await User.findByCredentials(req.body);
        //need to generate JWT that will be sent to user back
        const token =  await user.generateAuthToken();
        res.send({user,token});
    } catch (error) {
        res.status(400).send();
    }
})

//logout

router.post("/users/logout",authMiddleWare,async(req,res)=>{
    try {
        const token = req.token;
                // on logout remove that token from tokens array in user profile
        req.user.tokens = req.user.tokens.filter(item=>item.token!=token);
        await req.user.save(); 
        res.send();
    } catch (error) {
        res.status(500).send();
    }
});


//logout all

router.post("/users/logoutall",authMiddleWare,async(req,res)=>{
    try {
        req.user.tokens = [];
        await req.user.save(); 
        res.send();
    } catch (error) {
        res.status(500).send();
    }
});

router.get('/users/me',authMiddleWare, async (req, res) => {
    try {
        res.send(req.user); 
    } catch (e) {
        res.status(500).send()
    } 
})

router.patch('/users/me', authMiddleWare ,async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        //in this case middleware will be passed by query, so we cant hash our psw, so need to change this approach
       // const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        updates.forEach(update=>req.user[update] = req.body[update]);
        await req.user.save();
        res.send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/users/me', authMiddleWare,async (req, res) => {
    try {
        await req.user.remove();
        res.send(req.user)
    } catch (e) {
        res.status(500).send()
    }
})

//if we remove dist name from here. then mutler pass the file to route
const upload = mutler(
    {
        limits:{
            fileSize:1000000
        },
        fileFilter(req,file,cb){
            if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
                return cb(new Error('Please upload a image'))
            }
            //if file uploads
            cb(undefined,true);
        }
    }
    
    );

    // upload image
router.post('/users/me/avatar',auth,upload.single('upload'),async(req,res)=>{
    //buffer contain binary data of image
    const buffer =  await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send();
},(error,req,res,next)=>{
    res.status(400).send({error:error.message})
});


//delete avatar

router.delete('/users/me/avatar',auth,async(req,res)=>{
    try {
         req.user.avatar = undefined;
         await req.user.save();
         res.send(200);
    } catch (error) {
        res.status(500).send();
    }
});

//get user avatra
router.get('/users/:id/avatar',async(req,res)=>{
    try {
        const user = await User.findById(req.params.id);
        if(!user || !user.avatar){
            throw new Error('')
        }
        res.set('Content-type','image/png');
        res.send(user.avatar);
    } catch (error) {
        res.status(404).send()
    }
});
module.exports = router