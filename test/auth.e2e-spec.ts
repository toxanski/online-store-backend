import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AuthDto } from '../src/auth/dto/auth.dto';
import { disconnect } from 'mongoose';

describe('AuthController e2e', () => {
	let app: INestApplication;
	const loginDto: AuthDto = {
		login: "abc@mail.ru",
		password: "12345"
	};
	let token: string;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();

	});

	it('auth login success', async () => {
		return request(app.getHttpServer())
			.post('/auth/login')
			.send(loginDto)
			.expect(200)
			.then(({ body }: request.Response) => {
				expect(body.access_token).toBeDefined();
			})
	});

	it('auth login fail password', async () => {
		return request(app.getHttpServer())
			.post('/auth/login')
			.send({...loginDto, password: 'wrong_password'})
			.expect(401, {
				statusCode: 401,
				message: 'Неверный пароль',
				error: 'Unauthorized'
			});
	});

	it('auth login fail login', async () => {
		return request(app.getHttpServer())
			.post('/auth/login')
			.send({...loginDto, login: 'abc-wrong-login@mail.ru'})
			.expect(401, {
				statusCode: 401,
				message: 'Пользователь c таким email не найден',
				error: 'Unauthorized'
			});
	});

	afterAll(() => {
		disconnect();
	});
});