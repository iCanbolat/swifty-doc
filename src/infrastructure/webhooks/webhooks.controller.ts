import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { EmitWebhookEventDto } from './dto/emit-webhook-event.dto';
import { EmitWebhookEventResponseDto } from './dto/emit-webhook-event-response.dto';
import { GetWebhookEndpointsQueryDto } from './dto/get-webhook-endpoints-query.dto';
import { ListWebhookDeliveriesQueryDto } from './dto/list-webhook-deliveries-query.dto';
import { ReplayWebhookDeliveryDto } from './dto/replay-webhook-delivery.dto';
import { RegisterWebhookEndpointDto } from './dto/register-webhook-endpoint.dto';
import {
  WebhookDeliveryListResponseDto,
  WebhookDeliveryResponseDto,
} from './dto/webhook-delivery-response.dto';
import {
  WebhookEndpointListResponseDto,
  WebhookEndpointResponseDto,
} from './dto/webhook-endpoint-response.dto';
import { WebhookService } from './webhook.service';

@ApiTags('Webhooks')
@Controller('v1/webhooks')
export class WebhooksController {
  constructor(private readonly webhookService: WebhookService) {}

  @ApiOperation({ summary: 'List registered webhook endpoints.' })
  @ApiOkResponse({ type: WebhookEndpointListResponseDto })
  @ApiBadRequestResponse({ description: 'DTO validation failed.' })
  @Get('endpoints')
  async listEndpoints(@Query() query: GetWebhookEndpointsQueryDto) {
    const endpoints = await this.webhookService.listEndpoints(
      query.organizationId,
    );

    return {
      data: endpoints.map((endpoint) =>
        this.webhookService.sanitizeEndpoint(endpoint),
      ),
    };
  }

  @ApiOperation({
    summary: 'Register a webhook endpoint and its event subscriptions.',
  })
  @ApiCreatedResponse({ type: WebhookEndpointResponseDto })
  @ApiBadRequestResponse({ description: 'DTO validation failed.' })
  @Post('endpoints')
  async registerEndpoint(@Body() body: RegisterWebhookEndpointDto) {
    const endpoint = await this.webhookService.registerEndpoint({
      organizationId: body.organizationId,
      url: body.url,
      secret: body.secret,
      subscribedEvents: body.subscribedEvents ?? [],
    });

    return {
      data: this.webhookService.sanitizeEndpoint(endpoint),
    };
  }

  @ApiOperation({
    summary: 'Emit a typed webhook event to matching endpoints.',
  })
  @ApiCreatedResponse({ type: EmitWebhookEventResponseDto })
  @ApiBadRequestResponse({ description: 'DTO validation failed.' })
  @Post('events')
  async emitEvent(@Body() body: EmitWebhookEventDto) {
    const result = await this.webhookService.emitEvent(
      body.eventType,
      body.payload ?? {},
      body.organizationId,
    );

    return {
      data: result,
    };
  }
}

@ApiTags('Webhooks')
@Controller('v1/webhook-deliveries')
export class WebhookDeliveriesController {
  constructor(private readonly webhookService: WebhookService) {}

  @ApiOperation({
    summary: 'List recent webhook delivery attempts for an organization.',
  })
  @ApiOkResponse({ type: WebhookDeliveryListResponseDto })
  @ApiBadRequestResponse({ description: 'DTO validation failed.' })
  @Get()
  async listDeliveries(@Query() query: ListWebhookDeliveriesQueryDto) {
    const deliveries = await this.webhookService.listDeliveries({
      organizationId: query.organizationId,
      endpointId: query.endpointId,
      status: query.status,
    });

    return {
      data: deliveries.map((delivery) =>
        this.webhookService.serializeDelivery(delivery),
      ),
    };
  }

  @ApiOperation({
    summary: 'Replay a failed or historical webhook delivery attempt.',
  })
  @ApiCreatedResponse({ type: WebhookDeliveryResponseDto })
  @ApiBadRequestResponse({ description: 'DTO validation failed.' })
  @ApiNotFoundResponse({ description: 'Webhook delivery not found.' })
  @Post(':id/replay')
  async replayDelivery(
    @Param('id') deliveryId: string,
    @Body() body: ReplayWebhookDeliveryDto,
  ) {
    const delivery = await this.webhookService.replayDelivery(deliveryId, {
      organizationId: body.organizationId,
      actorUserId: body.actorUserId,
    });

    return {
      data: this.webhookService.serializeDelivery(delivery),
    };
  }
}
