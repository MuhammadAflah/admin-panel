var db= require('../config/connection')
var bcrypt = require('bcrypt')
const { ObjectId } = require('mongodb')

module.exports={
    addUser:(user)=>{
        let response={}
        return new Promise(async (resolve,reject)=>{
            let userdata=await db.get().collection('login').findOne({email:user.email})
            if(userdata){
                resolve(response.status=false)
            }else{
                user.password=await bcrypt.hash(user.password,10)
                db.get().collection('login').insertOne(user).then((req,res)=>{
                    resolve(response.status=true)
                })
            }
        })
    },
    getAllUsers:()=>{
        return new Promise(async(resolve,reject)=>{
            let allUsers=await db.get().collection('login').find().toArray()
            resolve(allUsers)
        })
    },

    deleteUser:(data)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection('login').deleteOne({email:data}).then((response)=>{
                console.log("delete worked");
                resolve(response)
            })
        })
    },

    editUser:(data)=>{
        console.log(data);
        return new Promise(async(resolve,reject)=>{
            data.password=await bcrypt.hash(data.password,10)
            db.get().collection('login').updateOne({email:data.email},{
                $set:{
                    name:data.name,
                    password:data.password
                }
            }).then((response)=>{
                console.log(response);
                resolve()
            })
        })
    },

    adminLogin:(data)=>{
        return new Promise(async(resolve,reject)=>{
            let loginstatus=false
            let response={}
            let admin=await db.get().collection('admin').findOne({email:data.email})
            if(admin){
                bcrypt.compare(data.password,admin.password).then((status)=>{
                    if(status){
                        console.log('success');
                        response.user=admin
                        response.status=true
                        resolve(response)
                    }else{
                        console.log('denied');
                        resolve({status:false})
                    }
                })
            }else{
                console.log('no user exists');
                resolve({status:false})
            }
        })
    },

    addAdmin:(data)=>{
        let response={}
        return new Promise(async(resolve,reject)=>{
            let admindata=await db.get().collection('admin').findOne({email:data.email})
            if(admindata){
                console.log("admin already exists");
                resolve(response.status=false)
            }else{
                data.password=await bcrypt.hash(data.password,10)
                db.get().collection('admin').insertOne(data).then((req,res)=>{
                    resolve(resolve.status=true)
                })
            }
        })
    }

}