import { BadRequestException } from '@nestjs/common';

export const imageFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|JPG|JPEG)$/)) {
    return callback(
      new BadRequestException('Only image JPG or JPEG files are allowed!'),
      false,
    );
  }
  callback(null, true);
};
