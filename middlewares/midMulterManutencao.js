const multer = require('multer');
const path = require('path');

// Configuração para o armazenamento do arquivo no disco
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '../uploads/manutencao'); // pasta onde as imagens serão armazenadas
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + 'manutencao' + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // gerando um nome único
  }
});

// Filtro para aceitar apenas imagens
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Arquivo não é uma imagem válida!'), false);
  }
};

// Configuração do upload
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 15 } // limite de 5MB
});
