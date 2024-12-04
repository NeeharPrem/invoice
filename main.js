import { app, BrowserWindow, globalShortcut, ipcMain } from 'electron';
import path from 'path';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose'
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
        log.info('payment mode - card');
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
            width: 1080,
            height: 720,
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
            mainWindow.setMenuBarVisibility(false);
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

    ipcMain.on('save-pdf', async (event, base64PDF) => {
        try {
            const downloadsPath = app.getPath('downloads');

            const timestamp = new Date().toISOString().replace(/[:T]/g, '-').split('.')[0];
            const filename = `Invoice_${timestamp}.pdf`;
            const filePath = path.join(downloadsPath, filename);
            const buffer = Buffer.from(base64PDF, 'base64');
            await fs.writeFile(filePath, buffer);
            event.reply('pdf-saved', {
                success: true,
                path: filePath
            });

            log.info(`PDF saved to: ${filePath}`);
        } catch (error) {
            log.error('Failed to save PDF:', error);
            event.reply('pdf-saved', {
                success: false,
                error: error.message
            });
        }
    });

    mongoose.connect('mongodb+srv://x2cvicious123:n3rLzUNO8oyCXZBE@cluster0.iftaqh1.mongodb.net/Invoice', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    const BackupModel = mongoose.model('Backup', new mongoose.Schema({}, { strict: false }));

    const BillSchema = new mongoose.Schema({
        invoiceNumber: { type: String, required: true },
        customerName: { type: String, required: true },
        items: [
            {
                itemName: { type: String, required: true },
                quantity: { type: Number, required: true },
                price: { type: Number, required: true },
            },
        ],
        totalAmount: { type: Number, required: true },
        date: { type: Date, default: Date.now },
    });

    const BillModel = mongoose.model('Bill', BillSchema);

    ipcMain.on('backup-data', async (event, data) => {
        try {
            const existingBackups = await BackupModel.find({
                invoiceNumber: { $in: data.map(bill => bill.invoiceNumber) }
            });

            const existingInvoiceNumbers = new Set(
                existingBackups.map(backup => backup.invoiceNumber)
            );

            const newBillsToBackup = data.filter(
                bill => !existingInvoiceNumbers.has(bill.invoiceNumber)
            );

            if (newBillsToBackup.length > 0) {
                await BackupModel.insertMany(newBillsToBackup);
                console.log(`Backup successful. ${newBillsToBackup.length} new bills backed up.`);
                event.reply('backup-status', {
                    success: true,
                    totalNewBills: newBillsToBackup.length
                });
            } else {
                console.log('No new bills to backup');
                event.reply('backup-status', {
                    success: true,
                    totalNewBills: 0
                });
            }
        } catch (err) {
            console.error('Backup failed', err);
            event.reply('backup-status', {
                success: false,
                error: err.message
            });
        }
    });

    ipcMain.on('add-bill', async (event, bill) => {
        try {
            const newBill = new BillModel(bill);
            await newBill.save();
            console.log('Bill saved successfully');
        } catch (err) {
            console.error('Failed to save bill', err);
        }
    });

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
        createWindow();
        registerShortcuts(mainWindow);
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