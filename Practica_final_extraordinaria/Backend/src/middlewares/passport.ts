import { Strategy as JwtStrategy, ExtractJwt} from 'passport-jwt';
import type { StrategyOptions } from 'passport-jwt';
import passport from 'passport';
import prisma from '../config/db.js';
import { ca } from 'zod/locales';

const opts: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_Secret || 'JWT_SECRET="clave_secreta_para_firmar_tus_propios_tokens"'
};

passport.use(
    new JwtStrategy(opts, async(jwtPayload, done) => {
        try{
            const user = await prisma.user.findUnique({
                where: {id: jwtPayload.id},
                include: {cliente: true, agencia: true},
            });

            if (user){
                return done(null, user);
            }
            return done(null, false);
        }catch(error){
            return done(error, false);
        }
    })
);

export default passport;