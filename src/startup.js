import express from 'express';

export default function startServer() {
  const app = express();
  const port = 3011;

  app.get('/', (req, res) => {
    res.send('Hello World!');
  });

  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
}
