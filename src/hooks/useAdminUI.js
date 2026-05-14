import { useContext } from 'react';
import { AdminUIContext } from '../context/AdminUIContext';

export function useAdminUI() {
  const context = useContext(AdminUIContext);
  if (!context) {
    throw new Error('useAdminUI must be used within an AdminUIProvider');
  }
  return context;
}
