
// Function to check if the browser is online
export const isOnline = (): boolean => {
  return navigator.onLine;
};

// Function to store data in localStorage
export const storeOfflineData = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error storing offline data:', error);
  }
};

// Function to retrieve data from localStorage
export const getOfflineData = <T>(key: string): T | null => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) as T : null;
  } catch (error) {
    console.error('Error retrieving offline data:', error);
    return null;
  }
};

// Function to register a service worker for offline capabilities
export const registerServiceWorker = async (): Promise<void> => {
  if ('serviceWorker' in navigator) {
    try {
      await navigator.serviceWorker.register('/service-worker.js');
      console.log('Service worker registered successfully');
    } catch (error) {
      console.error('Error registering service worker:', error);
    }
  }
};

// Function to sync data when online
export const syncOfflineData = async (
  key: string,
  syncFunction: (data: any) => Promise<void>
): Promise<void> => {
  if (isOnline()) {
    const offlineData = getOfflineData(key);
    if (offlineData) {
      try {
        await syncFunction(offlineData);
        localStorage.removeItem(key); // Remove after successful sync
      } catch (error) {
        console.error('Error syncing offline data:', error);
      }
    }
  }
};

// Event listeners for online/offline status
export const initOfflineListeners = (
  onlineCallback: () => void,
  offlineCallback: () => void
): () => void => {
  window.addEventListener('online', onlineCallback);
  window.addEventListener('offline', offlineCallback);
  
  return () => {
    window.removeEventListener('online', onlineCallback);
    window.removeEventListener('offline', offlineCallback);
  };
};

// Create service worker for caching app assets
export const createServiceWorker = () => {
  // This would be implemented in a separate service-worker.js file
  console.log('Service worker creation would be implemented in a separate file');
};
