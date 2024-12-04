import { app, BrowserWindow, globalShortcut } from 'electron';
import path from 'path';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import log from 'electron-log';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isDev = process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

log.transports.file.level = 'debug';
log.transports.console.level = 'debug';
log.info('Application Starting...');
log.info(`Running in ${isDev ? 'development' : 'production'} mode`);

const gotTheLock = app.requestSingleInstanceLock();

function registerShortcuts(mainWindow) {
    globalShortcut.register('F1', () => {
        log.info('payment mode - cash');
        mainWindow.webContents.send('payment-method', 'cash');
    });

    globalShortcut.register('F2', () => {
        log.info('paymnent mode - card');
        mainWindow.webContents.send('payment-method', 'card');
    });

    globalShortcut.register('F3', () => {
        log.info('payment mode - upi');
        mainWindow.webContents.send('payment-method', 'upi');
    });

    globalShortcut.register('F12', () => {
        log.info('split payment');
        mainWindow.webContents.send('payment-method', 'split');
    });

    globalShortcut.register('F10', () => {
        log.info('Focusing on search input');
        mainWindow.webContents.send('focus-search');
    });
}

function unregisterShortcuts() {
    globalShortcut.unregisterAll();
}

if (!gotTheLock) {
    app.quit();
} else {
    let mainWindow;

    async function waitForViteServer(mainWindow, retries = 30, delay = 1000) {
        for (let i = 0; i < retries; i++) {
            try {
                await mainWindow.loadURL('http://localhost:3000');
                // mainWindow.setMenuBarVisibility(false);
                log.info('Connected to Vite server');
                return;
            } catch (err) {
                log.info('Failed to connect');
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
        throw new Error('Failed to connect to Vite dev server after multiple attempts');
    }

    function loadProductionBuild(mainWindow) {
        log.info('Loading production build...');
        mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html')).catch(err => {
            log.error('Failed to load app:', err);
            app.quit();
        });
    }

    function createWindow() {
        log.info('Creating main window...');
        const preloadPath = path.join(__dirname, 'preload.js');
        log.info(`Preload path: ${preloadPath}`);

        mainWindow = new BrowserWindow({
            width: 800,
            height: 600,
            webPreferences: {
                nodeIntegration: false,
                contextIsolation: true,
                preload: preloadPath,
                sandbox: true,
                webSecurity: !isDev,
                devTools: true
            },
        });
        log.info('Main window created');

        if (isDev) {
            log.info('Connecting to dev server');
            waitForViteServer(mainWindow)
                .then(() => {
                    log.info('Connected, opening DevTools');
                    mainWindow.webContents.openDevTools();
                    if (process.env.REACT_DEVTOOLS_PATH) {
                        BrowserWindow.addDevToolsExtension(process.env.REACT_DEVTOOLS_PATH);
                    }
                })
                .catch(err => {
                    log.error('Failed to load dev server:', err);
                    loadProductionBuild(mainWindow);
                });
        } else {
            loadProductionBuild(mainWindow);
        }

        mainWindow.webContents.on('did-finish-load', () => {
            log.info('Main window finished loading');
        });

        mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
            log.error('Page failed to load:', errorCode, errorDescription);
        });

        mainWindow.on('close', (e) => {
            if (isDev) {
                log.info('Preventing window close in development mode');
                e.preventDefault();
                mainWindow.hide();
            }
        });
    }
    app.on('second-instance', (event, commandLine, workingDirectory) => {
        if (mainWindow) {
            if (mainWindow.isMinimized()) {
                mainWindow.restore();
            }
            mainWindow.focus();
        }
    });

    app.whenReady().then(() => {
        log.info('App is ready, creating window...');
        createWindow()
        registerShortcuts(mainWindow)
    });

    app.on('activate', () => {
        log.info('App activated');
        if (BrowserWindow.getAllWindows().length === 0) {
            log.info('Creating main window');
            createWindow();
        }
    });

    app.on('window-all-closed', () => {
        log.info('Main window closed');
        if (process.platform !== 'darwin') {
            log.info('App closed');
            app.quit();
        }
    });

    app.on('will-quit', () => {
        unregisterShortcuts();
    });

    process.on('uncaughtException', (error) => {
        log.error('Uncaught Exception:', error);
        app.quit();
    });

    app.allowRendererProcessReuse = true;
}