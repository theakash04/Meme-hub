import { server } from './app';

import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
