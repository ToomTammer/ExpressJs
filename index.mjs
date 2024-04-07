import express from "express" ;

const app = express();

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.status(201).send({msg :"Hello World"});
});

app.get("/api/users", (req, res) => {
    res.send([
        {id:1, user:"Tiny", displayName: "Time"},
        {id:2, user:"Tiny", displayName: "Time"},
        {id:3, user:"Tiny", displayName: "Time"}
    ]);
});

app.get("/api/products", (req, res) =>{
    res.send([
        {id:1, name:"Tiny", price: 1000},
        {id:2, name:"Tiny", price: 1000},
        {id:3, name:"Tiny", price: 1000}
    ]);
});


app.listen(PORT, () =>{
    console.log(`Running om Port  ${PORT}`);
});

//localhost:3000

//localhost:3000/users

//localhost:3000/product

