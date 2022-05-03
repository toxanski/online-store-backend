import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserModel } from '../user-model';
import { Injectable } from '@nestjs/common';


@Injectable()
class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(private readonly configService: ConfigService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: true,
			secretOrKey: configService.get('JWT_SECRET')
		});
	}


	// email, потому как в payload'е лежит только он
	validate({ email }): Pick<UserModel, 'email'> {
		// просто email, так как валидация пройдет на этапе,
		// когда email попадет в стратегию
		return email;
	}
}

export { JwtStrategy }