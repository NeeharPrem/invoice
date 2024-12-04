const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel),
    onPaymentMethod: (callback) => {
        ipcRenderer.on('payment-method', (event, method) => callback(method));
    },
    onSearchFocus: (callback) => {
        ipcRenderer.on('focus-search', () => callback());
    },
    onPDFSaved: (callback) => {
        ipcRenderer.on('pdf-saved', (event, result) => callback(result));
    },
    backupData: (data) => ipcRenderer.send('backup-data', data),
    savePDF: (pdfBlob) => ipcRenderer.send('save-pdf', pdfBlob)
});

window.addEventListener('DOMContentLoaded', () => {
});