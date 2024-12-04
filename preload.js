const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel),
    onPaymentMethod: (callback) => {
        ipcRenderer.on('payment-method', (event, method) => callback(method));
    },
    onSearchFocus: (callback) => {
        ipcRenderer.on('focus-search', () => callback());
    }
});
window.addEventListener('DOMContentLoaded', () => {
});