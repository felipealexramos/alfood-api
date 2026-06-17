import { randomUUID } from 'crypto';
import { extname } from 'path';
import { BadRequestException } from '@nestjs/common';
import { diskStorage } from 'multer';

const ALLOWED_MIME = /^image\/(jpe?g|png|webp|gif)$/;

/** Multer options for dish image uploads, stored under ./uploads. */
export const pratoImageUpload = {
  storage: diskStorage({
    destination: './uploads',
    filename: (_req, file, callback) => {
      const unique = randomUUID();
      callback(null, `${unique}${extname(file.originalname)}`);
    },
  }),
  fileFilter: (
    _req: unknown,
    file: { mimetype: string },
    callback: (error: Error | null, accept: boolean) => void,
  ) => {
    if (!ALLOWED_MIME.test(file.mimetype)) {
      return callback(
        new BadRequestException('Arquivo de imagem inválido.'),
        false,
      );
    }
    callback(null, true);
  },
  limits: { fileSize: 5 * 1024 * 1024 },
};
