import { Injectable } from '@nestjs/common';
import * as sharp from 'sharp';
import { promisify } from 'util';
import sizeOf from 'image-size';
import { readFile } from 'fs';

@Injectable()
export class PhashService {
  private initSQRT(inputData: any): Array<any> {
    const result = new Array(inputData);
    for (let i = 1; i < inputData; i++) {
      result[i] = 1;
    }
    result[0] = 1 / Math.sqrt(2.0);
    return result;
  }

  private initCOS(inputData: any): Array<any> {
    const result = new Array(inputData);
    for (let i = 0; i < inputData; i++) {
      result[i] = new Array(inputData);
      for (let n = 0; n < inputData; n++) {
        result[i][n] = Math.cos(
          ((2 * i + 1) / (2.0 * inputData)) * n * Math.PI,
        );
      }
    }
    return result;
  }

  private applyDCT(f, size: number): Array<any> {
    const cos = this.initCOS(32);
    const sqrt = this.initSQRT(32);
    const result = new Array(size);
    for (let u = 0; u < size; u++) {
      result[u] = new Array(size);
      for (let v = 0; v < size; v++) {
        let sum = 0;
        for (let i = 0; i < size; i++) {
          for (let j = 0; j < size; j++) {
            sum += cos[i][u] * cos[j][v] * f[i][j];
          }
        }
        sum *= (sqrt[u] * sqrt[v]) / 4;
        result[u][v] = sum;
      }
    }
    return result;
  }

  distance(firstWord: string, secondWord: string): number {
    let count = 0;
    for (let i = 0; i < firstWord.length; i++) {
      if (firstWord[i] !== secondWord[i]) {
        count++;
      }
    }
    return count;
  }

  async phash(image: Buffer): Promise<string> {
    const data = await sharp(image)
      .greyscale()
      .resize(32, 32, { fit: 'fill' })
      .rotate()
      .raw()
      .toBuffer();
    // copy signal
    const s = new Array(32);
    for (let x = 0; x < 32; x++) {
      s[x] = new Array(32);
      for (let y = 0; y < 32; y++) {
        s[x][y] = data[32 * y + x];
      }
    }

    // apply 2D DCT II
    const dct = this.applyDCT(s, 32);

    // get AVG on high frequencies
    let totalSum = 0;
    for (let x = 0; x < 8; x++) {
      for (let y = 0; y < 8; y++) {
        totalSum += dct[x + 1][y + 1];
      }
    }

    const avg = totalSum / (8 * 8);

    // compute hash
    let fingerprint = '';

    for (let x = 0; x < 8; x++) {
      for (let y = 0; y < 8; y++) {
        fingerprint += dct[x + 1][y + 1] > avg ? '1' : '0';
      }
    }

    return fingerprint;
  }

  async checkIfAreSimilar(firstPath: string, secondPath: string) {
    const readFileAsync = promisify(readFile);

    const image1 = await readFileAsync(firstPath);

    const image2 = await readFileAsync(secondPath);

    return Promise.all([this.phash(image1), this.phash(image2)])
      .then(([hash1, hash2]) => {
        if (this.distance(hash1, hash2) < 10) {
          const size1 = sizeOf(image1);
          const size2 = sizeOf(image2);
          console.log(this.distance(hash1, hash2));

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
      .then((r) => r);
  }
}
