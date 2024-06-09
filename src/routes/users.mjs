import { Router } from "express";
import { query , validationResult, checkSchema, matchedData} from "express-validator";
import { mockUser } from "../utils/constants.mjs";
import { createUserValidationSchema } from "../utils/validationSchema.mjs";
import { resolveIndexByUserId } from "../utils/middlewares.mjs";
import session from "express-session";
import { User } from "../mongoose/schemas/user.mjs";
import { hashPassword } from "../utils/helpers.mjs";

const router = Router();

router.get(
    "/api/users", 
query('filter')
.isString()
.notEmpty()
.withMessage("Must not be empty")
.isLength({ min: 3, max: 10})
.withMessage("Must be at least 3-10 characters"), 
(req, res) => {
    console.log(req.session.id);
    req.sessionStore.get(req.session.id, (err, sessionData) =>{
        if(err){
            console.log(err);
            throw err;
        }
        console.log("Inside Session Store Get");
        console.log("sessionData",sessionData);
    })
    const result = validationResult(req);
    console.log(result);
    const {
        query:{filter, value},
    } = req;

    if(filter && value) 
        return res.send(
            mockUser.filter((user) => user[filter].includes(value))
        );

    return res.send(mockUser);
});

router.post(
    "/api/users", 
    checkSchema(createUserValidationSchema),
    async (req, res) => {

    const result = validationResult(req);
    if(!result.isEmpty()) return res.sendStatus(400).send(result.array());

    const data = matchedData(req);
    console.log(data);
    data.password = hashPassword(data.password);
    console.log(data);
    const newUser = new User(data);
    try {
        const savedUser =  await newUser.save();
        return res.status(201).sendStatus(savedUser);
    } 
    catch (errorMessage) {
        return res.sendStatus(400);
    }
    
});

// router.post(
//     "/api/users", 
//     checkSchema(createUserValidationSchema),
//     (req, res) => {
//     const result = validationResult(req);
//     console.log(result);
    
//     if(!result.isEmpty())
//         res.status(400).send({ errors: result.array() });

//     const data = matchedData(req);
//     const newUser = {id : mockUser[mockUser.length - 1].id + 1, ...data };
//     mockUser.push(newUser);
//     return res.send(newUser);   
// });

router.get(
    "/api/users/:id", resolveIndexByUserId, (req, res) =>{
        const {findUserIndex} = req;
        const user = mockUser[findUserIndex];
        if(!user) return res.status(404).send({msg : "Not Found User."});
        return res.send(user);
    }
);

router.put("/api/users/:id", resolveIndexByUserId, (req, res) =>{
    const { 
        body, 
        // params : {id} 
        findUserIndex
    } = req;

    mockUser[findUserIndex] = { id: mockUser[findUserIndex].id, ...body };

    return res.sendStatus(200);
});

///patch : update only certain field on object
router.patch("/api/users/:id", resolveIndexByUserId, (req, res) =>
{
    const { 
        body, 
        findUserIndex
    } = req;

    mockUser[findUserIndex] = { ...mockUser[findUserIndex], ...body };

    return res.sendStatus(200);

});


router.delete("/api/users/:id", resolveIndexByUserId, (req, res) =>
{
    const { 
        findUserIndex
    } = req;

    mockUser.splice(findUserIndex);

    return res.sendStatus(200);

});

export default router;