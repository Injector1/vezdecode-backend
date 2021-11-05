import { Module } from '@nestjs/common';
import { PhashService } from './phash.service';
import { PhashController } from './phash.controller';

@Module({
  providers: [PhashService],
  controllers: [PhashController],
})
export class PhashModule {}
