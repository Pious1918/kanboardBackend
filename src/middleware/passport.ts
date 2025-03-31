import passport from "passport"
import { Strategy as JwtStrategy, ExtractJwt, StrategyOptions } from 'passport-jwt';
import userModel from "../models/userModel";




console.log("secreet",process.env.JWT_SECRET as string)

const options : StrategyOptions ={
    jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET as string
}

console.log("optionas arer", options)

passport.use( new JwtStrategy(options , async(jwt_payload , done)=>{
    console.log("jwt payload @ passport" , jwt_payload)

    // jwt payload @ passport {
    //     userId: '67e8d484f215d2fc42de2e3c',
    //     name: 'n S pious',
    //     email: 'nspious1999@gmail.com',
    //     iat: 1743328631
    //   }


    try {
        const user = await userModel.findOne({_id:jwt_payload.userId})

        if(user){
            return done(null , user)
        }
        
        console.log("no token")
        return done(null ,false)


    } catch (error) {
        
    }
}))


export default passport