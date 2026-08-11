import app from './app.js';
import { connectDB } from './config/db.js';

const port = process.env.PORT || 5000;

// sambungkan ke database DULU, baru nyalakan server
await connectDB();

app.listen(port, () => {
  /* eslint-disable no-console */
  console.log(`Listening: http://localhost:${port}`);
  /* eslint-enable no-console */
});
