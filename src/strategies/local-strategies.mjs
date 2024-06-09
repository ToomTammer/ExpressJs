import passport from "passport";
import { Strategy } from "passport-local";
import { mockUser } from "../utils/constants.mjs";
import { User } from "../mongoose/schemas/user.mjs";
import { comparePassword } from "../utils/helpers.mjs";

passport.serializeUser((user, done)=> {
    console.log(`Inside Serialize User`);
    console.log(user);
    done(null, user.id)  //save to seesion --> req.session.passport.user = (id: '...')
});

passport.deserializeUser(async (id, done) =>{
    console.log(`Inside Deserialize User`);
    console.log(`Deserialize User ID : ${id}`);
    try{
        const findUser = await User.findById(id);
            if(!findUser) throw new Error('User not found');
        done(null, findUser); //user object attaches to the request as req.user
    }
    catch (err){
        done(err, null);
    }
    
});

///Verify func
export default passport.use(
    new Strategy(async (username, password, done) => {
        console.log(`Username : ${username}`);
        console.log(`Password : ${password}`);
        try
        {
            const findUser = await User.findOne({username});
            if(!findUser) throw new Error('User not found');
            if(!comparePassword(password, findUser.password))
                throw new Error('Invalid Credentials');

            done(null, findUser);
        }
        catch(err)
        {
           done(err, null);
        }

    })
);