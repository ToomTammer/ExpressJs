import { mockUser } from "../utils/constants.mjs";

export const resolveIndexByUserId = (req, res, next) =>{
    const {
        params : {id} 
    } = req;

    const parsedId = parseInt(id);
    if(isNaN(parsedId)) 
        return res.sendStatus(400);

    const findUserIndex = mockUser.findIndex(
        user => user.id === parsedId
    );

    if(findUserIndex === -1) 
        return res.sendStatus(404);
    
    req.findUserIndex = findUserIndex;
    next();

};