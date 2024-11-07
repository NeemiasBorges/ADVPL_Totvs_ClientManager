const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: 'neemiasb.dev@gmail.com', 
    pass: '' 
  }
});

app.post('/send-email', (req, res) => {
  const { to, subject, body } = req.body;

  const mailOptions = {
    from: 'ifsp.neemiasb@gmail.com', 
    to: 'neemiasb.dev@gmail.com', 
    subject: subject,
    html: body
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).send('Erro ao enviar o e-mail');
    } else {
      console.log('E-mail enviado: ' + info.response);
      res.status(200).send('E-mail enviado com sucesso');
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
