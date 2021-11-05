import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { PhashService } from './phash.service';
import { promisify } from 'util';
import sizeOf from 'image-size';
import { readFile } from 'fs';

@Controller('phash')
export class PhashController {
  constructor(private phashService: PhashService) {}

  @Get('/distance')
  async getDistance(@Res() res: Response) {
    const readFileAsync = promisify(readFile);

    const image1 = await readFileAsync('/home/injector/Pictures/compare3.jpg');

    const image2 = await readFileAsync('/home/injector/Pictures/compare2.jpg');

    return Promise.all([
      this.phashService.phash(image1),
      this.phashService.phash(image2),
    ])
      .then(([hash1, hash2]) => {
        if (this.phashService.distance(hash1, hash2) < 10) {
          const size1 = sizeOf(image1);
          const size2 = sizeOf(image2);

          if (size1.height == size2.height && size1.width == size2.width) {
            return true;
          } else if (
            (size1.height < size2.height && size1.width == size2.width) ||
            (size1.height > size2.height && size1.width == size2.width)
          ) {
            return false;
          } else if (
            (size1.height == size2.height && size1.width > size2.width) ||
            (size1.height == size2.height && size1.width < size2.width)
          ) {
            return false;
          } else if (size1.height / size1.width == size2.height / size2.width) {
            return true;
          }
        } else {
          return false;
        }
      })
      .then((r) => res.send(r));
  }
}
