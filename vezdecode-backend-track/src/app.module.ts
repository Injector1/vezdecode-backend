import { Module } from '@nestjs/common';
import { ImagesModule } from './features/images/images.module';
import { PhashModule } from './features/phash/phash.module';
import { PrismaModule } from './orm/prisma/prisma.module';

@Module({
  imports: [ImagesModule, PrismaModule, PhashModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
