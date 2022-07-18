import {Body, Controller, HttpStatus, Post, Req, UseGuards} from '@nestjs/common';
import {AuthService} from "./auth.service";
import {AuthDto} from "./dto";
import {Tokens} from "./types";
import {AuthGuard} from "@nestjs/passport";
import {Request} from "express";
import {AtGuard, RtGuard} from "../common/guards";
import {GetCurrentUser} from "../common/decorators";
import {GetCurrentUserId} from "../common/decorators/get-current-user-id.decorator";

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {
    }

    @Post('/local/signup')
    signupLocal(@Body() dto: AuthDto): Promise<Tokens> {
        return this.authService.signupLocal(dto);
    }

    @Post('/local/signin')
    signinLocal(@Body() dto: AuthDto): Promise<Tokens> {
        return this.authService.signinLocal(dto);
    }


    @UseGuards(AtGuard) //AuthGuard('jwt')
    @Post('/logout')
    logout(@GetCurrentUserId() userId: number) {
        return this.authService.logout(userId);
    }

    @UseGuards(RtGuard) //AuthGuard('jwt-refresh')
    @Post('/refresh')
    refreshTokens(@Req() req: Request) {
        const user = req.user;
        return this.authService.refreshTokens(user['sub'],user['refreshToken']);
    }



}
