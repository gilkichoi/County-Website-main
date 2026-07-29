/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Departments } from './pages/Departments';
import { DepartmentDetail } from './pages/DepartmentDetail';
import { Tourism } from './pages/Tourism';
import { Documents } from './pages/Documents';
import { Careers } from './pages/Careers';
import { News } from './pages/News';
import { Contact } from './pages/Contact';
import { AdminDashboard } from './pages/AdminDashboard';
import { DataProvider } from './context/DataContext';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';

export default function App() {
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    document.addEventListener('contextmenu', handleContextMenu);
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  return (
    <ThemeProvider>
      <LanguageProvider>
        <DataProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="about" element={<About />} />
                <Route path="departments" element={<Departments />} />
                <Route path="departments/:id" element={<DepartmentDetail />} />
                <Route path="tourism" element={<Tourism />} />
                <Route path="documents" element={<Documents />} />
                <Route path="careers" element={<Careers />} />
                <Route path="news" element={<News />} />
                <Route path="contact" element={<Contact />} />
                <Route path="admin" element={<AdminDashboard />} />
              </Route>
            </Routes>
          </Router>
        </DataProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
