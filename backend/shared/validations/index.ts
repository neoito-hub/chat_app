import vine from '@vinejs/vine';
import schemas from './validationSchemas.ts';

const validateBody = async (data: any, schema: string): Promise<void> => {
  await vine.validate({ schema: schemas[schema], data });
}

export default validateBody;