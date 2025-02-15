import { BadRequestException, PipeTransform } from '@nestjs/common';
import { ZodError, ZodSchema } from 'zod';
import { fromZodError } from 'zod-validation-error';

export class ValidationPipe<T> implements PipeTransform {
  constructor(private readonly schema: ZodSchema) {}

  transform(value: unknown | T): T {
    try {
      return this.schema.parse(value);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException({
          message: 'Validation failed',
          statusCodo: 400,
          error: fromZodError(error),
        });
      }
      throw new BadRequestException('Validation failed');
    }
  }
}
