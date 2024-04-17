require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const fileUpload = require('express-fileupload');

const app = express();
const { port } = require('./config.js');

app.use(cors());

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');

  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

// Middleware autentificación de usuarios
const { authUser } = require('./middlewares/auth.js');

// Middleware para JSON
app.use(express.json());

// Middleware para subida de archivos
app.use(fileUpload());

// Middleware para cargar imagenes
app.use('/uploads/models', express.static('./uploads/models'));

// Controllers usuarios
const { register, validate, login } = require('./controllers/users/index.js');

// Controllers modelos

// Rutas usuarios
app.post('/api/register', register); // Registro de usuario
app.post('/api/validate/:registrationCode', validate); // Validación de usuario en base a correo y código
app.post('/api/login', login); // Login del usuario en base a correo

// Rutas modelos

// Middleware para mostrar logs
app.use(morgan('dev'));

app.use((req, res) => {
  res.status(404).send({ status: 'error', message: 'Not found' });
});

app.listen(port, () =>
  console.log(`El servidor se está ejecutando en: http://localhost:${port}`)
);
