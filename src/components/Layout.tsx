import { Outlet } from 'react-router-dom';
import { Navbar, Footer } from './Navigation';
import { AccessibilityWidget } from './AccessibilityWidget';
import { EmergencyAlertBanner } from './EmergencyAlertBanner';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function Layout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans text-gray-900">
      <EmergencyAlertBanner />
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <AccessibilityWidget />
      <Footer />
    </div>
  );
}

