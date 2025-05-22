const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { sequelize } = require('./models');
const config = require('./config/config');

// Importación de rutas
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const campaignRoutes = require('./routes/campaign.routes');
const paymentRoutes = require('./routes/payment.routes');

// Inicialización de la app
const app = express();
const PORT = config.port;

// Middlewares
app.use(cors({
  origin: config.frontendUrl,
  credentials: true
}));
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/payments', paymentRoutes);

// Ruta para verificar el estado del servidor
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'API funcionando correctamente',
    environment: config.nodeEnv,
    timestamp: new Date()
  });
});

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Ruta ${req.originalUrl} no encontrada`
  });
});

// Manejo global de errores
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Error interno del servidor'
  });
});

// Conexión a la base de datos y arranque del servidor
const startServer = async () => {
  try {
    // Sincronizar los modelos con la base de datos
    // En producción, usar { force: false } para no recrear tablas
    await sequelize.sync({ alter: config.nodeEnv === 'development' });
    console.log('Conexión a la base de datos establecida');
    
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error);
    process.exit(1);
  }
};

startServer(); 