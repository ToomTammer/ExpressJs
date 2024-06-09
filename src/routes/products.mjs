import { Router } from "express";

const router = Router();  

router.get("/api/products", (req, res) =>{
    console.log(req.headers.cookie);
    console.log(req.cookies);
    console.log(req.signedCookies);
    console.log(req.signedCookies.hello);
    if(req.signedCookies.hello && req.signedCookies.hello ==='world')
    {
        return res.send([
            {id:1, name:"Tiny", price: 1000},
            {id:2, name:"Tiny", price: 1000},
            {id:3, name:"Tiny", price: 1000}
        ]);
    }

    return res.status(403).send([
        {msg:"Sorry, You need the corect cookie"}
    ]);
    
});


export default router;