import { Module } from '@nestjs/common';
import { ImagesModule } from './features/images/images.module';
import { PrismaModule } from './orm/prisma/prisma.module';

@Module({
  imports: [ImagesModule, PrismaModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
