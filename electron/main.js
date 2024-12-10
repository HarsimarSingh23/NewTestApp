import { app, BrowserWindow } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  // In development, load from the Vite dev server
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    // Fix for production build path
    const indexPath = app.isPackaged 
      ? path.join(process.resourcesPath, 'dist', 'index.html')
      : path.join(__dirname, '../dist/index.html');
    
    console.log('App is packaged:', app.isPackaged);
    console.log('Resources path:', process.resourcesPath);
    console.log('Attempting to load file from:', indexPath);

    // Add error handling
    mainWindow.loadFile(indexPath).catch(err => {
      console.error('Failed to load index.html:', err);
      console.log('Current directory:', __dirname);
    });

    // Open DevTools in production for debugging
    mainWindow.webContents.openDevTools();
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});