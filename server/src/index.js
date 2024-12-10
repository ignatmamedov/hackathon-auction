import express from 'express';
import dotenv from 'dotenv';
import auth from './routes/auth.js';
import bids from "./routes/bids.js";
import categories from './routes/categories.js';
import lots from "./routes/lots.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({
  verify: (req, res, buf, encoding) => {
    try {
      JSON.parse(buf);
    } catch (error) {
      res.status(400).json({ error: 'Invalid JSON format' });
    }
  }
}));

app.use('/auth', auth);
app.use('/categories', categories);
app.use('/bids', bids);
app.use('/lots', lots);

app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
