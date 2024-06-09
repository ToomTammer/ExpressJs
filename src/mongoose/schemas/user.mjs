import mongoose from "mongoose";

const UserScemas = new mongoose.Schema({
    username : {
        type : mongoose.Schema.Types.String,
        require : true,
        unique : true,
    },
    displayName: mongoose.Schema.Types.String,
    password : {
        type : mongoose.Schema.Types.String,
        require : true,
    },
});

export const User = mongoose.model("User", UserScemas);
