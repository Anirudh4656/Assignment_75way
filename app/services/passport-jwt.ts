import jwt from "jsonwebtoken";
import { User, type IUser } from '../schemas/User';
import bcrypt from "bcrypt";
import { Strategy, ExtractJwt } from "passport-jwt";
import passport from "passport";
import { Strategy as LocalStrategy} from 'passport-local';

const isValidPassword=async function(value:string,password:string){
    const compare=await bcrypt.compare(value,password);
    return compare;
}
export const initPassport=():void =>{
    //user login
  passport.use(
    "jwt",
    new Strategy(
        {
            secretOrKey:"dghfghghjghjghjghj",
            jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken()
        },
        async(token:any,done:any)=>{
            try{
                done(null,token.user);
            }catch(error){
                done(error);
            }
        }
    )
  )
        passport.use(
            "login", 
            new LocalStrategy({
                usernameField:'email',
                passwordField:'password',
             
            },
        async(email,password,done)=>{
            try{
                const user:IUser |null =await User.findOne({email});
                console.log(`I AM IN USER ${user}`);
                if(!user){
                    return done(null,false,{message:'no user'})
                }
                if(user.isBlocked){
                    return done(null,false,{message:'denied'})
                }
                const validate=await isValidPassword(password,user.password)
               
                if (!validate) {
                    return done(null, false, { message: 'Invalid credentials' });
                  }
                  const {password:_p,...result}=user;
                  done(null,result,{message:"login Successfully"})
                //   if (user.blocked) {
                //     done(createError(401, "User is blocked, Contact to admin"), false);
                //     return;
                //   }
             
                
            }catch(error){
                return done(error);
            }
        }
        
        )
        )}
    
    // passport.serializeUser((user: IUser, done) => {
    //     done(null, user.id);
    //   });
      
//       passport.deserializeUser(async (id, done) => {
//         try {
//           const user = await User.findById(id);
//           done(null, user);
//         } catch (error) {
//           done(error, null);
//         }
//       });
//     )
// }
// (user: Omit<IUser, "password">

export const createUserTokens=(user:{id:string,email:string})=>{
    const jwtSecret=process.env.JWT_SECRET ?? '';
    console.log(user);
    const token =jwt.sign(user,"dghfghghjghjghjghj");
    return {accessToken:token,refreshToken:""}
}
export const decodeToken = (token: string) => {
    const jwtSecret = process.env.JWT_SECRET ?? "";
    const decode = jwt.decode(token);
    return decode as IUser;
  };
  