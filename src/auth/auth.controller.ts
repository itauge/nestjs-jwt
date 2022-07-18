import {Body, Controller, HttpStatus, Post, Req, UseGuards} from '@nestjs/common';
import {AuthService} from "./auth.service";
import {AuthDto} from "./dto";
import {Tokens} from "./types";
import {AuthGuard} from "@nestjs/passport";
import {Request} from "express";

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

    @UseGuards(AuthGuard('jwt'))
    @Post('/logout')
    logout(@Req() req: Request) {
        const user = req.user;
        return this.authService.logout(user['sub']);
    }

    @UseGuards(AuthGuard('jwt-refresh'))
    @Post('/refresh')
    refreshTokens(@Req() req: Request) {
        const user = req.user;
        return this.authService.refreshTokens(user['sub'],user['refreshToken']);
    }



}
