import dotenv from 'dotenv';
dotenv.config();

import app from './app';

const PORT = parseInt(process.env.PORT || '5000', 10);

app.listen(PORT, () => {
    console.log(`Server berjalan di port ${PORT}`);
});
