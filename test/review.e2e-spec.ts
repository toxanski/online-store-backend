import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { CreateReviewDto } from '../src/review/dto/create-review.dto';
import { Types, disconnect } from 'mongoose';
import { REVIEW_NOT_FOUND } from '../src/review/review.constants';

const productId = new Types.ObjectId().toHexString();
const testDto: CreateReviewDto = {
	name: 'Тест e2e',
	title: 'продукт',
	description: 'описание продукта',
	rating: 5,
	productId
};

describe('AppController (e2e)', () => {
	let app: INestApplication;
	// после создания, должно возвращаться _id
	let createdId: string;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	});

	it('/review/create (POST)',async () => {
		return request(app.getHttpServer())
			.post('/review/create')
			.send(testDto)
			.expect(201)
			.then(({ body }: request.Response ) => {
				createdId = body._id;
				expect(createdId).toBeDefined();
			});
	});

	it('/review/byProduct/:productId -> SUCCESS', async () => {
		return request(app.getHttpServer())
			.get(`/review/byProduct/${productId}`)
			.expect(200)
			.then(({ body }: request.Response) => {
				expect(body.length).toBe(1);
			});
	});

	it('/review/byProduct/:productId -> FAIL', async () => {
		return request(app.getHttpServer())
			.get(`/review/byProduct/${new Types.ObjectId().toHexString()}`)
			.expect(200)
			.then(({ body }: request.Response) => {
				expect(body.length).toBe(0);
			});
	});

	it('/review/delete (DELETE) -> SUCCESS', async () => {
		return request(app.getHttpServer())
			.delete('/review/' + createdId)
			.expect(200);
	});

	it('/review/delete (DELETE) -> FAIL', async () => {
		return request(app.getHttpServer())
			.delete(`/review/${new Types.ObjectId().toHexString()}`)
			.expect(404, {
				statusCode: 404,
				message: REVIEW_NOT_FOUND
			});
	});

	afterAll(() => {
		disconnect();
	});
});
