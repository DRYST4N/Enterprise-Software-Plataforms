import multer from 'multer';

const storage = multer.diskStorage({
    destination: 'public/uploads/festivales/',
    filename: (_req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

export const uploadFestivalImage = multer({ storage }).single('imagen');
