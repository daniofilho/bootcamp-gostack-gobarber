import 'dotenv/config';

import Queue from './lib/Queue';

// Isso faz com que a fila rode em um node separado
Queue.processQueue();
