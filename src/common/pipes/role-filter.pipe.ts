import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { roles } from '../../lib/access';

const VALID_ROLES = Object.keys(roles);

@Injectable()
export class RoleFilterPipe implements PipeTransform {
  transform(value: string | undefined): string | undefined {
    if (value === undefined || value === '') return undefined;

    if (!VALID_ROLES.includes(value)) {
      throw new BadRequestException(
        `role must be one of: ${VALID_ROLES.join(', ')}`,
      );
    }

    return value;
  }
}
