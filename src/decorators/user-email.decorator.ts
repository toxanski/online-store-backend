import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// получить email пользователя на защищенном роуте
const UserEmail = createParamDecorator((data: unknown, context: ExecutionContext) => {
	// получил req с запроса
	const request = context.switchToHttp().getRequest();
	return request.user;
});

export { UserEmail };