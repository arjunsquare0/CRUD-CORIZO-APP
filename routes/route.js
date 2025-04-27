const express=require('express');
const { title } = require('process');
const router=express.Router();
const User=require('../models/user.js');
const multer=require('multer');
const user = require('../models/user.js');
const fs = require('fs');

// image upload
var storage=multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'./uploads');
    },
    filename: function(req,file,cb){
        cb(null,Date.now()+file.originalname);
    }
});

// middleware
var upload=multer({
    storage: storage
}).single('image');

// insert an user into database route
router.post('/add', upload, async (req, res) => {
    try {
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            image: req.file.filename
        });

        await user.save(); // no callback anymore!

        req.session.message = {
            type: 'success',
            message: 'User added successfully'
        };

        res.redirect('/');
    } catch (err) {
        res.json({ message: err.message, type: 'danger' });
    }
});

// get all users routes
// route.js
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.render('index', {
            title: 'Home Page',
            users: users
        }); // or res.json(data)
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});


router.get('/add',(req,res)=>{
    res.render('add_users',{title: "Add Users"});
});

// edit an user route
router.get('/edit/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findById(id);
        if (!user) {
            return res.redirect('/');
        }
        res.render('edit_users', { 
            title: 'Edit User',
            user: user
        });
        
    } catch (err) {
        console.error(err);
        res.redirect('/');
    }
});

// Update user route
router.post('/update/:id', upload, async (req, res) => {
    const id = req.params.id;
    let new_image = '';

    if (req.file) {
        new_image = req.file.filename;

        // Delete old image
        try {
            fs.unlinkSync('./uploads/' + req.body.old_image);
        } catch (err) {
            console.log('Failed to delete old image:', err);
        }
    } else {
        new_image = req.body.old_image;
    }

    try {
        await User.findByIdAndUpdate(id, {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            image: new_image
        });

        req.session.message = {
            type: 'success',
            message: 'User updated successfully!'
        };
        res.redirect('/');
    } catch (err) {
        res.json({ message: err.message, type: 'danger' });
    }
});

router.get('/delete/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const user = await User.findByIdAndDelete(id);

        if (user && user.image) {
            try {
                fs.unlinkSync('./uploads/' + user.image);
            } catch (err) {
                console.log('Error deleting image file:', err);
            }
        }

        req.session.message = {
            type: 'success',
            message: 'User deleted successfully!'
        };
        res.redirect('/');
    } catch (err) {
        res.json({ message: err.message });
    }
});



module.exports=router;