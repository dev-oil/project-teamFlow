import { Home } from 'lucide-react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { AppSidebar } from '@/components/Sidebar/index';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

import { Header } from './components/Header';
import { Toaster } from './components/ui/sonner';
import { useAuth } from './hooks/useAuth';
import { useAuthInitializer } from './hooks/useAuthInitializer';
import { AuthLayout } from './pages/Auth/AuthLayout';
import { ForgotPasswordPage } from './pages/Auth/ForgotPasswordPage';
import { LoginPage } from './pages/Auth/LoginPage';
import { RegisterPage } from './pages/Auth/RegisterPage';
import { ResetPasswordPage } from './pages/Auth/ResetPasswordPage';
import { VerifyEmailPage } from './pages/Auth/VerifyEmailPage';

import { CalendarPage } from './pages/CalendarPage';
import { DashboardPage } from './pages/DashboardPage';
import { NotesPage } from './pages/Notes/NotesPage';
import { ProfilePage } from './pages/ProfilePage';
import { InviteEmailPage } from './pages/Settings/InviteEmailPage';
import { SettingsPage } from './pages/SettingsPage';
import { EditNotePage } from './pages/Notes/EditNotePage';
import { CreateNotePage } from './pages/Notes/CreateNotePage';

function App() {
  const { isLoggedIn, isInitiailized } = useAuth();
  useAuthInitializer();
  if (!isInitiailized) return null;
  if (!isLoggedIn) {
    return (
      <>
        <Routes>
          <Route path='/' element={<AuthLayout />}>
            <Route index element={<Navigate to='/login' replace />} />
            <Route path='login' element={<LoginPage />} />
            <Route path='register' element={<RegisterPage />} />
            <Route path='forgot-password' element={<ForgotPasswordPage />} />
            <Route path='*' element={<Navigate to='/login' replace />} />
          </Route>
          <Route path='/verify' element={<VerifyEmailPage />} />
          <Route path='/reset-password' element={<ResetPasswordPage />} />
          <Route path="/invite" element={<InviteEmailPage />} />
        </Routes>
        <Toaster richColors />
      </>
    );
  }

  return (
    <SidebarProvider className='overflow-hidden'>
      <AppSidebar />
      <SidebarInset className='overflow-hidden'>
        <Header />
        <div>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/dashboard' element={<DashboardPage />} />
            <Route path='/notes' element={<NotesPage />} />
            <Route path='/notes/edit/:noteId' element={<EditNotePage />} />
            <Route path='/notes/create' element={<CreateNotePage />} />
            <Route path='/calendar' element={<CalendarPage />} />
            <Route path='/profile' element={<ProfilePage />} />
            <Route path='/settings' element={<SettingsPage />} />
          </Routes>
        </div>
      </SidebarInset>
      <Toaster richColors />
    </SidebarProvider>
  );
}

export default App;
