import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateApplicationDto } from './create-application.dto';
import { IsDefined, IsEnum } from 'class-validator';
import { ApplicationStatus } from '../enums/application-status.enum';

export class UpdateStatusApplicationDto extends PartialType(
  CreateApplicationDto,
) {
  @ApiProperty({
    description: 'Application status',
    enum: ApplicationStatus,
    required: true,
  })
  @IsDefined()
  @IsEnum(ApplicationStatus)
  status: ApplicationStatus;
}
