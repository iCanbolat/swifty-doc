import { Module } from '@nestjs/common';
import { PortalController } from './portal.controller';
import { RequestWorkflowService } from './request-workflow.service';
import { RequestsController } from './requests.controller';
import { SubmissionsController } from './submissions.controller';

@Module({
  controllers: [RequestsController, PortalController, SubmissionsController],
  providers: [RequestWorkflowService],
})
export class RequestsModule {}
