import express from "express" ;

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

const mockUser = [
    {id:1, username:"tiny", displayName: "Tiny"},
    {id:2, username:"peter", displayName: "Peter"},
    {id:3, username:"miny", displayName: "Miny"},
    {id:4, username:"tan", displayName: "Tan"},
    {id:5, username:"giy", displayName: "Giy"},
    {id:6, username:"home", displayName: "Home"},
    {id:7, username:"naisu", displayName: "Naisu"},
    {id:8, username:"ulo", displayName: "Ulo"},
];

app.listen(PORT, () =>{
    console.log(`Running on Port  ${PORT}`);
});

app.get("/", (req, res) => {
    res.status(201).send({msg :"Hello World"});
});

app.get("/api/users", (req, res) => {
    const {
        query:{filter, value},
    } = req;

    if(filter && value) 
        return res.send(
            mockUser.filter((user) => user[filter].includes(value))
        );

    return res.send(mockUser);
});

app.post("/api/users", (req, res) => {
    const { body } = req;
    const newUser = {id : mockUser[mockUser.length - 1].id + 1, ...body };
    mockUser.push(newUser);
    return res.send(newUser);
});

app.get("/api/users/:id", (req, res) =>{
    const parsedId = parseInt(req.params.id);
    if(isNaN(parsedId)) 
        return res.status(404).send({msg : "Bad Request. Invalid ID"});

    let user = mockUser.find (o => o.id == parsedId);
    if(!user) return res.status(404).send({msg : "Not Found User."});
    return res.send(user);
});


app.get("/api/products", (req, res) =>{
    res.send([
        {id:1, name:"Tiny", price: 1000},
        {id:2, name:"Tiny", price: 1000},
        {id:3, name:"Tiny", price: 1000}
    ]);
});






//localhost:3000

//localhost:3000/users

//localhost:3000/product

