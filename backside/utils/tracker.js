const logAction = require('./logger');

const track = (controllerFunc)=>{
    return async(req, res, next)=>{
        try{
            const actionName = controllerFunc.name;
            if(req.user && req.user.id){
                await logAction(req.user.id, actionName);
            }
            await controllerFunc(req, res, next);
        }catch(err){
            next(err);
        }
    }
}

module.exports= track;