import express from "express" ;
import routes from "./routes/index.mjs"
import cookieParser from "cookie-parser"
import session from "express-session";
import { mockUser } from "./utils/constants.mjs";
import passport from "passport";
import "./strategies/local-strategies.mjs"
import mongoose from "mongoose";
import MongoStore from "connect-mongo";

const app = express();
mongoose.connect("mongodb://localhost/express_tutorial")
    .then(()=> console.log("Connected to Database"))
    .catch((err) => console.log(`Error: ${err}`));

app.use(express.json());
app.use(cookieParser('helloworld'));
app.use(session({
    // Secret key used to sign the session ID cookie
    secret:'anson the dev',
    // Prevents uninitialized sessions from being saved to the store
    saveUninitialized: false,
    // Prevents the session from being resaved if it hasn't been modified
    resave: false,
    cookie: {
        maxAge: 60000 * 60,
    },
    ///session store
    store: MongoStore.create({
        client : mongoose.connection.getClient(),
    }),
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(routes);


const PORT = process.env.PORT || 3000;

app.listen(PORT, () =>{
    console.log(`Running on Port  ${PORT}`);
});

app.get("/", (req, res) => {
    console.log(req.session);
    console.log(req.session.id);
    req.session.visited = true;
    res.cookie('hello', 'world', {maxAge: 10000, signed: true});
    res.status(201).send({msg :"Hello World"});
});

///#passport lesson
app.post("/api/auth", passport.authenticate("local"), (req, res) => {
    return res.sendStatus(200);
});

app.get("/api/auth/status", (req, res) => {
    console.log(`Inside auth/status endpiot`);
    console.log(req.user);
    console.log(`req.session`);
    console.log(req.session);
    return req.user
    ? res.send(req.user)
    : res.sendStatus(401);
});

///#seesion lesson
// app.post("/api/auth", (req, res) => {
//     const { 
//         body :{username , password}
//     } = req;

//     const findUser = mockUser.find((user) => user.username === username);
//     if(!findUser || findUser.password !== password)
//         return res.status(401).send({msg: "BAD CREDENTIALS"});

//     req.session.user = findUser;
//     return res.status(200).send(findUser);
// });

// app.get("/api/auth/status", (req, res) => {
//     req.sessionStore.get(req.sessionID, (err, session) =>{
//         if(err){
//             console.log(err);
//             throw err;
//         }
//         console.log("session = ",session);
//     })
//     return req.session.user
//     ? res.status(200).send(req.session.user)
//     : res.status(401).send({msg: "Not Authenticated"});
// });

app.post("/api/cart", (req, res) => {
    if(!req.session.user) return res.sendStatus(401);
    const { body: item } = req;
    const { cart } = req.session;
    if(cart)
    {
        cart.push(item);
    }
    else{
        req.session.cart = [item];
    }
    console.log("item = ",item);
    return res.status(200).send(item);
});

app.get("/api/cart", (req, res) => {
    if(!req.session.user) return res.sendStatus(401);
    return res.send(req.session.cart?? []);
});