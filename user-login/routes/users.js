var express = require('express');
const { response } = require('../app');
var router = express.Router();
const userHelpers=require('../helpers/user-helpers');


/* GET home page. */
router.get('/', function(req, res, next) {
  let user=req.session.user
  let products=[
    {
      name:"Audi RS7",
      price:"25000000",
      description:"A perfect dual performance car with a high-performance engine. The best build quality with enough luxury to satisfy. Best car.",
      image:"https://cdn.motor1.com/images/mgl/rP0ME/s1/2020-audi-rs7-by-black-box-richter.jpg"
    },
    {
      name:"Audi R8",
      price:"9800000",
      description:"Audi R8 is so sexy and coolest car i ever saw because it's style and design is too attractive even others to attract from that. ",
      image:"https://paultan.org/image/2020/10/2021-Audi-R8-Green-Hell-Exterior-27.jpg"
    },
    {
      name:"Audi Q3",
      price:"6800000",
      description:"The new Audi Q3 is available in two variants, including Premium Plus and Technology. its design is too attractive and catchy.",
      image:"https://images.hindustantimes.com/auto/img/2022/08/11/600x338/Audi_Q3_1660195331278_1660195331641_1660195331641.jpeg"
    },
    {
      name:"Audi A6",
      price:"7000000",
      description:"A perfect dual performance car with a high-performance engine. The best build quality with enough luxury to satisfy. Best car.",
      image:"https://imgcdnblog.carmudi.com.ph/wp-content/uploads/2021/04/21234405/audi-a6-etron-front-action-1.jpg?resize=500x333"
    },
    {
      name:"Audi RS7",
      price:"25000000",
      description:"A perfect dual performance car with a high-performance engine. The best build quality with enough luxury to satisfy. Best car.",
      image:"https://cdn.motor1.com/images/mgl/rP0ME/s1/2020-audi-rs7-by-black-box-richter.jpg"
    },
    {
      name:"Audi R8",
      price:"9800000",
      description:"Audi R8 is so sexy and coolest car i ever saw because it's style and design is too attractive even others to attract from that. ",
      image:"https://paultan.org/image/2020/10/2021-Audi-R8-Green-Hell-Exterior-27.jpg"
    },
    {
      name:"Audi Q3",
      price:"6800000",
      description:"The new Audi Q3 is available in two variants, including Premium Plus and Technology. its design is too attractive and catchy.",
      image:"https://images.hindustantimes.com/auto/img/2022/08/11/600x338/Audi_Q3_1660195331278_1660195331641_1660195331641.jpeg"
    },
    {
      name:"Audi A6",
      price:"7000000",
      description:"A perfect dual performance car with a high-performance engine. The best build quality with enough luxury to satisfy. Best car.",
      image:"https://imgcdnblog.carmudi.com.ph/wp-content/uploads/2021/04/21234405/audi-a6-etron-front-action-1.jpg?resize=500x333"
    }
  ]
  if(user){
    res.render('user/index', { products,user});
  }else{
    res.redirect('/login')
  }
  
});

router.get('/signup',(req,res,next)=>{
  res.render('user/signup', {signupError:req.session.signupError})
  req.session.signupError=false
});




router.get('/login',(req,res,next)=>{
  let user=req.session.user
  if(user){
    res.redirect('/')
  }else{

    res.render('user/login',{"loginError":req.session.loginError})
    req.session.loginError=false
  }
})

router.post('/signup',(req,res)=>{
  userHelpers.signup(req.body).then((response)=>{
    console.log(response);
    if(response){
      // req.session.loggedIn = true
      // req.session.user = response.user
      res.redirect('/login')
    }else{
      req.session.signupError="email already exists!!"
      res.redirect('/signup')
    }
  })
})


router.post('/login', function (req, res, next) {
  userHelpers.login(req.body).then((response) => {
    if (response.status) {
      req.session.loggedIn = true
      req.session.user = response.user
      // console.log(req.session);
      res.redirect('/')
    } else {
      req.session.loginError="invalid email or password"
      res.redirect('/login')
    }
  })
})

router.get('/logout',(req,res)=>{
  // req.session.destroy(()=>{
    req.session.user=null;
    
  res.redirect('/login')
  // })
})
module.exports = router;
