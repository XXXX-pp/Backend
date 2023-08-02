import multer from 'multer';

const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, uniqueSuffix +'-'+file.originalname)
    },
    fileFilter: (req, file, cb)=>{
      let ext = path.extname(file.originalname);
      if(ext == '.png' && ext == '.jpg' && ext == '.jpeg' && ext == '.gif'){
        return cb(null, true);
      }
    }
})

export const upload = multer({storage:storage})
