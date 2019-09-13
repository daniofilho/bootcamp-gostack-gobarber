/*
  Multer permite que o Node trabalhe com upload de arquivos
  https://github.com/expressjs/multer
*/
import multer from 'multer';
import crypto from 'crypto';
import { extname, resolve } from 'path';

export default {
  //onde vai guardar os arquivos
  storage: multer.diskStorage({
    destination: resolve( __dirname, '..', '..', 'tmp', 'uploads'), // => ../../tmp/uploads
    //trata o nome da imagem
    filename: (req, file, cb) => {
      crypto.randomBytes(16, (err, res) => { // Gerando 16 bytes de conteúdo aleatório
        if(err) return cb(err);

        return cb(null, res.toString('hex') + extname(file.originalname) ); // converte esses bytes em uma string hexadecimal
      });
    }
  }),
};
