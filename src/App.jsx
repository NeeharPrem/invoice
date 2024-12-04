import { Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import CreateInvo from './pages/CreateInvo';
import InvoicePage from './pages/InvoicePage.jsx';
import useInternetStatus from './components/useInternetStatus.jsx';
import { openDB } from 'idb';
import { toast} from 'react-toastify';

async function fetchIndexedDBData() {
  try {
    const db = await openDB('BillData', 2);
    const data = await db.getAll('Bills');
    return data;
  } catch (error) {
    console.error('Error getting indexDb data:', error);
    return [];
  }
}

async function backupDataToMongoDB(data) {
  if (!data || data.length === 0) {
    console.log('No data to backup');
    return;
  }

  if (window.electronAPI) {
    try {
      await window.electronAPI.backupData(data);
      toast.success(`Successfully backed up ${ data.length } records`)
    } catch (error) {
      console.error('Backup to MongoDB failed:', error);
    }
  } else {
    console.error('Electron API not available');
  }
}

function App() {
  const isOnline = useInternetStatus();
  const [lastBackupTime, setLastBackupTime] = useState(null);

  useEffect(() => {
    async function performBackup() {
      if (isOnline) {
        const currentTime = Date.now();
        const timeSinceLastBackup = lastBackupTime
          ? currentTime - lastBackupTime
          : Infinity;
        if (!lastBackupTime || timeSinceLastBackup > 15 * 60 * 1000) {
          try {
            const data = await fetchIndexedDBData();
            if (data.length > 0) {
              await backupDataToMongoDB(data);
              setLastBackupTime(currentTime);
            }
          } catch (error) {
            console.error('Backup process failed:', error);
            toast.error('Backup Failed')
          }
        }
      }
    }

    performBackup();
  }, [isOnline]);

  return (
    <>
      <Routes>
        <Route path="/" element={<CreateInvo />} />
        <Route path="/invoice" element={<InvoicePage />} />
      </Routes>
    </>
  );
}

export default App;