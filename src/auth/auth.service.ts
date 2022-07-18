import {ForbiddenException, Injectable} from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";
import * as bcrypt from 'bcrypt';
import {Tokens} from "./types";
import {AuthDto} from "./dto";
import {JwtService} from "@nestjs/jwt";

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService,
                private jwtService: JwtService) {
    }

    async signupLocal(dto: AuthDto): Promise<Tokens> {
        const hash = await this.hashData(dto.password)
        const newUser = await this.prisma.user.create({
            data: {
                email: dto.email,
                hash
            }
            }
        )

        const tokens = await this.getToken(newUser.id,newUser.email)
        await this.updateRtHash(newUser.id, tokens.refresh_Token)
        return tokens;
    }

    async signinLocal(dto: AuthDto): Promise<Tokens> {
        const user = await this.prisma.user.findUnique({
            where:{
                email: dto.email,
            }
        })

        if (!user) throw new ForbiddenException("accessed deny")
        const passwordMatches = await bcrypt.compare(dto.password, user.hash)
        if (!passwordMatches) throw new ForbiddenException("accessed deny")
        const tokens = await this.getToken(user.id, user.email)
        await this.updateRtHash(user.id, tokens.refresh_Token)
        return tokens;
    }

    async logout(userId: number) {
        await this.prisma.user.updateMany({
            where: {
                id: userId,
                hashedRt: {
                    not: null
                },
            },
            data: {
                hashedRt: null
            }
        });

    }

    async refreshTokens(userId: number, rt: string) {
        const user = await this.prisma.user.findUnique({
            where:{
                id: userId
            }
        })
        if (!user) throw new ForbiddenException("accessed deny")

        const rtMatches = bcrypt.compare(rt, user.hashedRt)
        if(!rtMatches) throw new ForbiddenException("accessed deny")

        const tokens = await this.getToken(user.id, user.email)
        await this.updateRtHash(user.id, tokens.refresh_Token)
        return tokens;

    }

    async updateRtHash(userId: number, rt: string){
        const hash = await this.hashData(rt);
        await this.prisma.user.update(
            {
                where: {
                    id: userId,
                },
                data: {
                    hashedRt: hash,
                }
            }
        )
    }

    hashData(data: string){
        return bcrypt.hash(data,10)
    }

    async getToken(userId: number, email: string){
        const [at, rt] = await Promise.all([
            this.jwtService.signAsync(
                {
                    sub: userId,
                    email,
                },
                {
                    secret: 'at-secret',
                    expiresIn: 60 * 15,
                },
            ),
            this.jwtService.signAsync(
                {
                    sub: userId,
                    email,
                },
                {
                    secret: 'rt-secret',
                    expiresIn: 60 * 60 * 24 * 7
                }
            ),
        ]);

        return {
            access_Token: at,
            refresh_Token: rt
        }
    }
}
