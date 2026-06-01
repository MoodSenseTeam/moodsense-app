import app from './app';
import { getConfig } from '@/shared/config';

const { port: PORT } = getConfig();

app.listen(PORT, () => {
    console.log(`Server berjalan di port ${PORT}`);
});
