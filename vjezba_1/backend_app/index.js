const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Omogućavanje CORS-a kako bi frontend mogao slati zahtjeve
app.use(cors());
app.use(express.json());

// Bazna ruta
app.get('/', (req, res) => {
  res.send('REST API poslužitelj radi uspješno!');
});

// Endpoint 1: Vraćanje osnovnih informacija
app.get('/api/poruka', (req, res) => {
  res.json({
    status: 'success',
    poruka: 'Pozdrav s Render backend servisa!',
    kolegij: 'Raspodijeljeni sustavi',
    vjezba: 1
  });
});

// Endpoint 2: Primjer jelovnika (prema opisu iz vježbe)
app.get('/api/jelovnik', (req, res) => {
  res.json([
    { id: 1, naziv: 'Pohani odrezak s rižom', cijena: '5.50 EUR' },
    { id: 2, naziv: 'Vegetarijanska tjestenina', cijena: '4.80 EUR' },
    { id: 3, naziv: 'Sezonska salata', cijena: '2.00 EUR' }
  ]);
});

app.listen(PORT, () => {
  console.log(`Server pokrenut na portu ${PORT}`);
});