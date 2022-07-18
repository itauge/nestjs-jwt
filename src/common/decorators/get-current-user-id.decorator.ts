import {createParamDecorator, ExecutionContext} from "@nestjs/common";

//createParamDecorator = 自定義裝飾器
export const GetCurrentUserId = createParamDecorator(
    (data: undefined,context: ExecutionContext) :number => {
        const request = context.switchToHttp().getRequest();
        return request.user['sub'];
    })