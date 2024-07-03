import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WaterfallService } from './commons/waterfall/waterfall.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, WaterfallService],
})
export class AppModule {}
