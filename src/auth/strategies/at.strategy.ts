import {PassportStrategy} from "@nestjs/passport";
import {ExtractJwt, Strategy} from 'passport-jwt'
import {Injectable} from "@nestjs/common";

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt'){

    //參考nestjs jwt passport auth
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: 'at-secret'
        });
    }

    validate(payload: any) {
        return payload;
    }

}