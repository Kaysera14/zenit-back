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
const {
  getModels,
  getSingleModel,
  filter,
  newModel,
  updateModel,
  deleteModel,
} = require('./controllers/models/index.js');

// Rutas usuarios
app.post('/api/register', register); // Registro de usuario
app.post('/api/validate/:registrationCode', validate); // Validación de usuario en base a correo y código
app.post('/api/login', login); // Login del usuario en base a correo

// Rutas modelos
app.get('/api/models', getModels); // Ver todos los modelos ordenados por novedad
app.get('/api/models/:slug', getSingleModel); // Ver modelo individual
app.get('/api/filter', filter); // Filtrar por profesional, personal o estilos
app.post('/api/models', authUser, newModel); // Subir nuevo modelo
app.put('/api/models/:slug', authUser, updateModel); // Editar modelo
app.delete('/api/models/:slug', authUser, deleteModel); // Borrar modelo

// Middleware para mostrar logs
app.use(morgan('dev'));

app.use((req, res) => {
  res.status(404).send({ status: 'error', message: 'Not found' });
});

app.listen(port, () =>
  console.log(`El servidor se está ejecutando en: http://localhost:${port}`)
);
