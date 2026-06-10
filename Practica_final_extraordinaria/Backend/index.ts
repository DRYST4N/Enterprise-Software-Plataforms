import app from './src/api';
import Dependencies from './src/config/dependencies';

const gracefulShutdown = async (exitCode: number = 0): Promise<void> => {
  try {
    await app.stop();
  } catch (error: unknown) {
    console.error('[!] Error during shutdown:', error);
  } finally {
    process.exit(exitCode);
  }
};

(async (): Promise<void> => {
    try {
        console.info('[+] Initializing dependencies...');
        
        // Asume que dependencies obtiene su tipo automáticamente de la función init()
        const dependencies = await Dependencies.init(); 
        
        console.info('[+] Starting application interfaces...');
        await app.start(dependencies);

    } catch (error: unknown) {
        console.error('[!] Error during startup:', error);
        await gracefulShutdown(1);
    }
})();



process.on('uncaughtException', async (err: Error) => {
    console.error('[!] Uncaught Exception:', err);
    await gracefulShutdown(1);
});

process.on('SIGTERM', async (): Promise<void> => {
    await gracefulShutdown();
});