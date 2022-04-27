import {ConfigService} from '@nestjs/config';
import {TypegooseModuleOptions} from 'nestjs-typegoose';

export const getMongoConfig = async (configService: ConfigService): Promise<TypegooseModuleOptions> => {
	return {
		uri: getMongoUri(configService),
		...getMongoOptions()
	};
};

const getMongoUri = (configService: ConfigService) => {

};