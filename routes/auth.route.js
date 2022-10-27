const authcontroller =require('../controllers/auth.controller')


module.exports =(app) =>{

    app.post("/crm/api/v1/auth/signup",authcontroller.signup)
    
    app.post("/crm/api/v1/auth/signin",authcontroller.signin)

}