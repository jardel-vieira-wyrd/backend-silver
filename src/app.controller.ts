import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Get('health')
  async getHealthStatus(): Promise<string> {
    return this.appService.getHealthStatus();
  }
}
