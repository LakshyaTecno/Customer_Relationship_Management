const express =require('express');
const app=express();
const serverConfig= require('./configs/server.config')

console.log(serverConfig)
app.listen(serverConfig.PORT,()=>{
    console.log("Started the server on the PORT number :",serverConfig.PORT)
})