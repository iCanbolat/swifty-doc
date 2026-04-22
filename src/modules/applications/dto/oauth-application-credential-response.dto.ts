import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OAuthApplicationDataDto } from './oauth-application-response.dto';

export class OAuthApplicationCredentialDataDto {
  @ApiProperty({ type: () => OAuthApplicationDataDto })
  application!: OAuthApplicationDataDto;

  @ApiPropertyOptional({
    example: 'swd_secret_8a30d2f63bf14bd28ccbb44be9815389',
    nullable: true,
  })
  clientSecret!: string | null;
}

export class OAuthApplicationCredentialResponseDto {
  @ApiProperty({ type: () => OAuthApplicationCredentialDataDto })
  data!: OAuthApplicationCredentialDataDto;
}
