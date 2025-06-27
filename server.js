const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/Sesiones';

// Conexion a MongoDB
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

// Redirige siempre a la página de login
app.get('/', (req, res) => {
  if (req.session.user) {
    return res.redirect('/store');
  }
  res.redirect('/login');
});

// Página de la tienda (requiere sesión)
app.get('/store', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  res.sendFile(path.join(__dirname, 'public', 'store.html'));
});

// Formulario de inicio de sesión
app.get('/login', (req, res) => {
  if (req.session.user) {
    return res.redirect('/store');
  }
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, password }).exec();
  if (user) {
    req.session.user = user.username;
    return res.redirect('/store');
  }
  return res.redirect('/login?error=credenciales');
});


app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

app.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
