import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { Types } from 'mongoose';
import { ID_VALIDATION_ERROR } from './id-validation.consts';

@Injectable()
class IdValidationPipe implements PipeTransform {
	transform(value: string, metadata: ArgumentMetadata): string {
		if (metadata.type !== 'param') {
			return value;
		} else if (!Types.ObjectId.isValid(value)) {
			throw new BadRequestException(ID_VALIDATION_ERROR);
		}
		return value;
	}
}

export { IdValidationPipe };