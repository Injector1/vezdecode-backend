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
import { createReadStream } from 'fs';
import { diskStorage } from 'multer';
import { join } from 'path';
import { editFileName } from '../../helpers/editFileName';
import { imageFileFilter } from '../../helpers/imageFileFilter';
import { ImagesService } from './images.service';

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
  async getFile(@Query('id') id: string, @Res() res) {
    if (
      !id ||
      isNaN(parseInt(id)) ||
      parseInt(id).toString().length != id.length
    )
      throw new BadRequestException('Incorrect ID');
    const { path } = await this.imagesService.getImage(parseInt(id));
    const file = createReadStream(join(process.cwd(), path));
    res.set({
      'Content-Type': 'image/jpeg',
      'Content-Disposition': `attachment; filename="${path.split('/')[2]}"`,
    });
    file.pipe(res);
  }
}
