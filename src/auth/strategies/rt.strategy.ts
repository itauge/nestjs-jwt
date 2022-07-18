import {PassportStrategy} from "@nestjs/passport";
import {ExtractJwt, Strategy} from 'passport-jwt';
import {Request} from 'express';
import {Injectable} from "@nestjs/common";

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh'){

    //參考nestjs jwt passport auth
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: 'rt-secret',
            //different to at.strategy.ts
            passReqToCallback: true
        });
    }

    validate(req: Request, payload: any) {
        const refreshToken = req.get('authorization').replace('Bearer','').trim();
        return {
         ...payload,
            refreshToken,
        }
    }

}