var db = require('../config/connection')
const bcrypt = require('bcrypt')
module.exports = {
    signup: (userData) => {
        let response={}
        return new Promise(async (resolve, reject) => {
            let user=await db.get().collection('login').findOne({email:userData.email})
            if(user){
                resolve(response.status=false)
            }else{
                userData.password=await bcrypt.hash(userData.password,10)
                db.get().collection('login').insertOne(userData).then((req,res)=>{
                    resolve(response.status=true)
                })
            }
        })
    },
    login: (userData) => {
        // var p = userData.password
        return new Promise(async (resolve, reject) => {
            let loginStatus = false
            let response = {}
            let user = await db.get().collection('login').findOne({ email: userData.email })
            if (user) {
                bcrypt.compare(userData.password, user.password).then((status) => {
                    if (status) {
                        console.log('login success');
                        response.user = user
                        response.status = true
                        resolve(response)
                    } else {
                        console.log('login failed!!!!');
                        resolve({ status: false })
                    }
                })
            } else {
                console.log('login failed');
                resolve({ status: false })
            }
        })
    }
    
}


