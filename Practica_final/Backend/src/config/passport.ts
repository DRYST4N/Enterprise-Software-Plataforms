import { Strategy, ExtractJwt, StrategyOptions } from "passport-jwt";
import passport from "passport";
import { UsuarioService } from "../src/services/usuario.service";
import dotenv from 'dotenv';

dotenv.config();

const options: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET || 'mi_clave_super_larga',
};

passport.use(
    new Strategy(options, async (payload, done) =>{
        try{
            const user = await UsuarioService.findByEmail(payload.correo);
            if (user) return done(null, user);
            return done(null, false);
        }catch(error){
            return done(error, false);
        }
    })
);

export default passport;

