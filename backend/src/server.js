const express = require('express');
const cors = require('cors');
const { Resend } = require('resend');

const app = express();
const resend = new Resend('re_ReSBFfhC_6v5FmRKgdbDf6BcRSxLEMukD');

// Configuración de CORS
app.use(cors({
  origin: '*', // Permite todas las origenes en desarrollo
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// Ruta de prueba para verificar que el servidor está funcionando
app.get('/', (req, res) => {
  res.json({ message: 'Servidor WOM funcionando correctamente' });
});

app.post('/api/send-activation', async (req, res) => {
  console.log('Recibida solicitud de activación:', req.body);
  
  try {
    const { email } = req.body;
    
    if (!email) {
      console.log('Error: Email no proporcionado');
      return res.status(400).json({ 
        success: false, 
        error: 'El correo electrónico es requerido' 
      });
    }

    console.log('Enviando correo a:', email);
    
    const data = await resend.emails.send({
      from: 'WOM Argentina <onboarding@resend.dev>',
      to: email,
      subject: 'Activa tu cuenta en WOM Argentina',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #0284c7;">¡Bienvenido a WOM Argentina!</h1>
          <p>Gracias por registrarte en nuestra plataforma. Para activar tu cuenta, por favor haz clic en el siguiente enlace:</p>
          <a href="https://wom.com.ar/activate?email=${email}" 
             style="display: inline-block; background-color: #0284c7; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">
            Activar mi cuenta
          </a>
          <p>Si no creaste esta cuenta, puedes ignorar este correo.</p>
          <p>Saludos,<br>El equipo de WOM Argentina</p>
        </div>
      `
    });

    console.log('Correo enviado exitosamente:', data);
    res.json({ success: true, data });
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Error al enviar el correo de activación' 
    });
  }
});

const PORT = 3002;

// Iniciar el servidor
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
  console.log('Presiona Ctrl+C para detener el servidor');
});