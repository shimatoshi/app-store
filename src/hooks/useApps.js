import { useState, useEffect } from 'react';
import { getApps } from '../lib/supabase';

import { CATEGORIES } from '../constants';

export const useApps = () => {
  const [allApps, setAllApps] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadApps = async () => {
    setLoading(true);
    try {
      const apps = await getApps();
      setAllApps(apps);
    } catch (err) {
      console.error('Failed to load apps:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApps();
  }, []);

  const getFilteredApps = (activeTab, searchQuery) => {
    let filtered = allApps;
    if (activeTab === 'pwa') filtered = allApps.filter(a => a.category === CATEGORIES.PWA);
    if (activeTab === 'packages') filtered = allApps.filter(a => a.category === CATEGORIES.TERMUX);
    
    if (searchQuery) {
      filtered = filtered.filter(app => 
        app.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        app.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return filtered;
  };

  return { allApps, loading, loadApps, getFilteredApps };
};
