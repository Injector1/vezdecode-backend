import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { createReadStream, readFile } from 'fs';
import { existsSync } from 'fs';
import { diskStorage } from 'multer';
import { join } from 'path';
import { editFileName } from '../../helpers/editFileName';
import { imageFileFilter } from '../../helpers/imageFileFilter';
import { ImagesService } from './images.service';
import sharp from 'sharp';
import { promisify } from 'util';

@Controller('images')
export class ImagesController {
  constructor(private imagesService: ImagesService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './upload',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.imagesService.saveImage(
      process.env.MULTER_DEST + '/' + file.filename,
    );
  }

  @Get('get')
  async getFile(
    @Query('id') id: string,
    @Query('scale') scale: string,
    @Res() res,
  ) {
    if (
      !id ||
      isNaN(parseInt(id)) ||
      parseInt(id).toString().length != id.length
    )
      throw new BadRequestException('Incorrect ID');
    let pathToScaledImage = null;

    const { path } = await this.imagesService.getImage(parseInt(id));
    if (scale) {
      pathToScaledImage =
        'scaled/' +
        (await this.imagesService.scaleImage(path, parseFloat(scale)));
    } else {
      pathToScaledImage = path;
    }

    const fullPath = join(process.cwd(), pathToScaledImage);
    const file = createReadStream(fullPath);

    file.on('error', (err) => {
      console.error(err);
    });

    res.set({
      'Content-Type': 'image/jpeg',
      'Content-Disposition': `attachment; filename="${path.split('/')[2]}"`,
    });

    file.pipe(res);
  }
}
