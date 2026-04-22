import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ApplicationsService } from './applications.service';
import { CreateOAuthApplicationDto } from './dto/create-oauth-application.dto';
import { GetOAuthApplicationQueryDto } from './dto/get-oauth-application-query.dto';
import { ListOAuthApplicationsQueryDto } from './dto/list-oauth-applications-query.dto';
import { OAuthApplicationCredentialResponseDto } from './dto/oauth-application-credential-response.dto';
import {
  OAuthApplicationListResponseDto,
  OAuthApplicationResponseDto,
} from './dto/oauth-application-response.dto';
import { RotateOAuthApplicationSecretDto } from './dto/rotate-oauth-application-secret.dto';
import { UpdateOAuthApplicationDto } from './dto/update-oauth-application.dto';

@ApiTags('Applications')
@Controller('v1/applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @ApiOperation({
    summary: 'List registered OAuth applications for an organization.',
  })
  @ApiOkResponse({ type: OAuthApplicationListResponseDto })
  @ApiBadRequestResponse({ description: 'DTO validation failed.' })
  @Get()
  async listApplications(@Query() query: ListOAuthApplicationsQueryDto) {
    const applications = await this.applicationsService.listApplications(
      query.organizationId,
    );

    return {
      data: applications.map((application) =>
        this.applicationsService.sanitizeApplication(application),
      ),
    };
  }

  @ApiOperation({
    summary: 'Create a self-serve OAuth application registration.',
  })
  @ApiCreatedResponse({ type: OAuthApplicationCredentialResponseDto })
  @ApiBadRequestResponse({ description: 'DTO validation failed.' })
  @Post()
  async createApplication(@Body() body: CreateOAuthApplicationDto) {
    const result = await this.applicationsService.createApplication({
      organizationId: body.organizationId,
      actorUserId: body.actorUserId,
      name: body.name,
      description: body.description,
      redirectUris: body.redirectUris,
      allowedScopes: body.allowedScopes,
      applicationType: body.applicationType,
    });

    return {
      data: {
        application: this.applicationsService.sanitizeApplication(
          result.application,
        ),
        clientSecret: result.clientSecret,
      },
    };
  }

  @ApiOperation({ summary: 'Get OAuth application details.' })
  @ApiOkResponse({ type: OAuthApplicationResponseDto })
  @ApiBadRequestResponse({ description: 'DTO validation failed.' })
  @ApiNotFoundResponse({ description: 'OAuth application not found.' })
  @Get(':id')
  async getApplication(
    @Param('id') applicationId: string,
    @Query() query: GetOAuthApplicationQueryDto,
  ) {
    const application = await this.applicationsService.getApplication(
      applicationId,
      query.organizationId,
    );

    return {
      data: this.applicationsService.sanitizeApplication(application),
    };
  }

  @ApiOperation({
    summary: 'Update OAuth application metadata, scopes, and status.',
  })
  @ApiOkResponse({ type: OAuthApplicationResponseDto })
  @ApiBadRequestResponse({ description: 'DTO validation failed.' })
  @ApiNotFoundResponse({ description: 'OAuth application not found.' })
  @Patch(':id')
  async updateApplication(
    @Param('id') applicationId: string,
    @Body() body: UpdateOAuthApplicationDto,
  ) {
    const application = await this.applicationsService.updateApplication(
      applicationId,
      {
        organizationId: body.organizationId,
        actorUserId: body.actorUserId,
        name: body.name,
        description: body.description,
        redirectUris: body.redirectUris,
        allowedScopes: body.allowedScopes,
        applicationType: body.applicationType,
        status: body.status,
      },
    );

    return {
      data: this.applicationsService.sanitizeApplication(application),
    };
  }

  @ApiOperation({
    summary: 'Rotate the client secret for a confidential OAuth application.',
  })
  @ApiOkResponse({ type: OAuthApplicationCredentialResponseDto })
  @ApiBadRequestResponse({ description: 'DTO validation failed.' })
  @ApiNotFoundResponse({ description: 'OAuth application not found.' })
  @Post(':id/rotate-secret')
  async rotateApplicationSecret(
    @Param('id') applicationId: string,
    @Body() body: RotateOAuthApplicationSecretDto,
  ) {
    const result = await this.applicationsService.rotateApplicationSecret(
      applicationId,
      {
        organizationId: body.organizationId,
        actorUserId: body.actorUserId,
      },
    );

    return {
      data: {
        application: this.applicationsService.sanitizeApplication(
          result.application,
        ),
        clientSecret: result.clientSecret,
      },
    };
  }
}
