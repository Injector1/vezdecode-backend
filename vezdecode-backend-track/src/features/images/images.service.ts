import { Image } from '.prisma/client';
import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/orm/prisma/prisma.service';

@Injectable()
export class ImagesService {
  constructor(private prismaService: PrismaService) {}

  async saveImage(pathToImageLocation: string): Promise<Pick<Image, 'id'>> {
    return this.prismaService.image.create({
      data: { path: pathToImageLocation },
      select: { id: true },
    });
  }

  async getImage(imageId: number): Promise<Pick<Image, 'path'> | null> {
    return this.prismaService.image
      .findUnique({
        where: { id: imageId },
        select: { id: false, path: true },
      })
      .then((res) => {
        if (res) return res;
        throw new BadRequestException('No image with such ID');
      });
  }
}
