import { Image } from '.prisma/client';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { readFile } from 'fs';
import sizeOf from 'image-size';
import { join } from 'path';
import * as sharp from 'sharp';
import { PrismaService } from 'src/orm/prisma/prisma.service';
import { promisify } from 'util';

@Injectable()
export class ImagesService {
  width: number;
  height: number;
  constructor(private prismaService: PrismaService) {
    this.height = 0;
    this.width = 0;
  }

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

  async scaleImage(path: string, scale: number): Promise<string> {
    this.getImageSize(path);
    const readFileAsync = promisify(readFile);
    const fileName = `SCALED_${Math.random()
      .toString(36)
      .replace(/[^a-z]+/g, '')
      .substr(0, 5)}`;

    await sharp(join(process.cwd(), path))
      .resize(this.width * scale, this.height * scale)
      .toFile('./scaled/' + fileName + '.jpg');

    return fileName + '.jpg';
  }

  getImageSize(path: string): void {
    const size = sizeOf(path);
    this.width = size.width;
    this.height = size.height;
  }
}
