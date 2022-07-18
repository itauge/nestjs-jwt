import {createParamDecorator, ExecutionContext} from "@nestjs/common";

//createParamDecorator = 自定義裝飾器
export const GetCurrentUser = createParamDecorator(
    (data: string | undefined,context: ExecutionContext) => {
        const request = context.switchToHttp().getRequest();
        if(!data) return request.user;
        return request.user['data'];
    })