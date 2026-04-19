import { Strategy, ExtractJwt, StrategyOptions } from "passport-jwt";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";


const  adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const options: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET || 'mi_calve_super_secreta'
};

export const JWTStrategy = new Strategy(options, async (payload, done) =>{
    try{
        const user = await prisma.user.findUnique({
            where:{
                id:payload.sub
            },
            select:{id: true, email: true, role: true}
        });
        if (user) return done(null, user);
        return done(null, false);
    }catch(error){
        console.error(error)
        return done(error, false)
    }
});