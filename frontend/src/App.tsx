import { Home } from 'lucide-react';
import { Route, Routes } from 'react-router-dom';

import { AppSidebar } from '@/components/Sidebar/index';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

import { Header } from './components/Header';
import { CalendarPage } from './pages/CalendarPage';
import { DashboardPage } from './pages/DashboardPage';
import { NotesPage } from './pages/NotesPage';

import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';

function App() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <div>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/dashboard' element={<DashboardPage />} />
            <Route path='/notes' element={<NotesPage />} />
            <Route path='/calendar' element={<CalendarPage />} />
            <Route path='/profile' element={<ProfilePage />} />
            <Route path='/settings' element={<SettingsPage />} />
          </Routes>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default App;
