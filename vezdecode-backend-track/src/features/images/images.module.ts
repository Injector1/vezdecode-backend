import { Module } from '@nestjs/common';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';
import { MulterModule } from '@nestjs/platform-express';
import { PrismaModule } from 'src/orm/prisma/prisma.module';

@Module({
  imports: [
    MulterModule.register({
      dest: process.env.MULTER_DEST,
    }),
    PrismaModule,
  ],
  providers: [ImagesService],
  controllers: [ImagesController],
})
export class ImagesModule {}
