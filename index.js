const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');

const LOGIN = process.env.LOGIN || 'dieuvina';
const PORT = process.env.PORT || 4321;

const app = express();

app.disable('x-powered-by');
app.use(bodyParser.urlencoded({ extended: false }));

app.use((request, response, next) => {
  response.set('Access-Control-Allow-Origin', 'https://kodaktor.ru');
  response.set('Access-Control-Allow-Credentials', 'true');
  response.set('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  response.set('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.options('*', (request, response) => {
  response.sendStatus(204);
});

app.get('/', (request, response) => {
  response.type('text/plain').send('Use /login/ and POST /insert/');
});

app.head('/', (request, response) => {
  response.sendStatus(200);
});

app.get('/login/', (request, response) => {
  response.type('text/plain').send(LOGIN);
});

app.post('/insert/', async (request, response) => {
  const { login, password, URL } = request.body;

  if (!login || !password || !URL) {
    return response.status(400).json({ error: 'login, password and URL are required' });
  }

  const client = new MongoClient(URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  try {
    await client.connect();
    const db = client.db();
    const result = await db.collection('users').insertOne({
      login: String(login),
      password: String(password)
    });

    return response.json({
      inserted: true,
      insertedId: result.insertedId
    });
  } catch (error) {
    return response.status(500).json({ error: error.message });
  } finally {
    await client.close();
  }
});

app.use((request, response) => {
  response.status(400).type('text/plain').send('Bad request');
});

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
