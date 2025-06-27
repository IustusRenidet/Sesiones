const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/Sesiones';

// Conexión a MongoDB
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', async () => {
  console.log('Connected to MongoDB');
});

// Esquema de usuario
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});
const User = mongoose.model('User', userSchema);

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: 'mi-clave-secreta',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: MONGO_URI }),
    cookie: { maxAge: 1000 * 60 * 60 },
  })
);

// Ruta principal - redirige según el estado de sesión
app.get('/', (req, res) => {
  if (req.session.user) {
    return res.redirect('/store');
  }
  res.redirect('/login');
});

// Página de login
app.get('/login', (req, res) => {
  if (req.session.user) {
    return res.redirect('/store');
  }
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Procesar login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  try {
    const user = await User.findOne({ username, password }).exec();
    
    if (user) {
      req.session.user = user.username;
      return res.redirect('/store');
    } else {
      return res.redirect('/login?error=credenciales');
    }
  } catch (error) {
    console.error('Error during login:', error);
    return res.redirect('/login?error=servidor');
  }
});

// Página de la tienda (requiere sesión)
app.get('/store', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  res.sendFile(path.join(__dirname, 'public', 'store.html'));
});

// Logout
app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
    }
    res.redirect('/');
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
});