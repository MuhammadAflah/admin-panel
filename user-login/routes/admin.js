var express = require('express');
var router = express.Router();
const adminHelpers=require('../helpers/admin-helpers')
var db=require('../config/connection');
const { route } = require('./users');

router.get('/',function(req, res, next){
    adminHelpers.getAllUsers().then((allUsers)=>{
        let adminsession=req.session.user
        if(adminsession){
            res.render('admin/view-users', {admin:true,allUsers, adminsession})
        }else{
            res.redirect('/admin/admin-login')
        }
        
    })
    
})

router.get('/add-user',(req,res)=>{
    let adminsession=req.session.user
    res.render('admin/add-user',{adduserError: req.session.adduserError, admin: true, adminsession})
    req.session.adduserError=false
    // res.render('admin/add-user')
})
router.post('/add-user', function (req, res, next) {
    adminHelpers.addUser(req.body).then((response) => {
        console.log(response);
        if (response) {
            res.redirect('/admin')

        } else {
            req.session.adduserError = "entered mail id is already exists"
            res.redirect('/admin/add-user')


        }


    })
})

router.get('/delete-user/:email', function (req, res) {
    let userMail = req.params.email
    console.log(userMail)
    adminHelpers.deleteUser(userMail).then((response) => {
        res.redirect('/admin')
    })

})

router.get('/edit-user/:email', async (req, res) => {
    let adminsession = req.session.user

    let userMail = req.params.email
    console.log(req.params.email);
    // this user is passed to edit page to set value fields
    let user = await db.get().collection('login').findOne({ email: userMail })
    console.log(user);
    //provide get method only,post method same as add-users
    res.render('admin/edit-user', { user, admin: true, adminsession })

})
router.post('/edit-user/:email',(req,res)=>{
    adminHelpers.editUser(req.body).then((response)=>{
        res.redirect('/admin')

    })
})

router.get('/admin-login',(req,res)=>{
    let admin=req.session.user
    if (admin){
        res.redirect('/admin')
    }else{
        res.render('admin/admin-login',{admin:true, adminLoginError: req.session.adminLoginError})
        req.session.adminLoginError=false
    }
})

router.post('/admin-login',(req,res)=>{
    adminHelpers.adminLogin(req.body).then((response)=>{
        if (response.status) {
            req.session.loggedIn = true
            req.session.user = response.user
            // console.log(req.session.user);
            res.redirect('/admin')
        } else {
            req.session.adminLoginError = "invalid email or password"
            res.redirect('/admin/admin-login')
        }
    })
})

router.get('/admin-signup',(req,res,next)=>{
    let adminsession=req.session.user
    res.render('admin/admin-signup', {admin:true, addadminError: req.session.addadminError, adminsession})
    req.session.addadminError=false
})
router.post('/admin-signup', (req,res,next)=>{
    console.log(req.body);
    adminHelpers.addAdmin(req.body).then((response)=>{
        if(response){
            res.redirect('/admin/admin-login')
        }else{
            req.session.addadminError="email already exist"
            res.redirect('/admin/admin-signup')
        }
    })
})

router.get('/admin-logout',(req,res)=>{
    req.session.destroy(()=>{
        res.redirect('/admin/admin-login')
    })
})

module.exports = router;