import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import './styles/fonts'
import './styles/tokens.css'
import './styles/ui.css'
import './styles/layout.css'
import './styles/pages.css'
import { AppProvider } from './state/AppContext'
import { AppLayout, AuthLayout, InstallationLayout } from './layouts/layouts'
import { LoginPage, RegisterPage } from './pages/Auth'
import { InstallationsPage } from './pages/Installations'
import { DashboardPage } from './pages/Dashboard'
import { ParametersPage } from './pages/Parameters'
import { ChartsPage } from './pages/Charts'
import { NotificationsPage } from './pages/Notifications'
import { AccountPage } from './pages/Account'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>
          <Route element={<AppLayout />}>
            <Route path="/installations" element={<InstallationsPage />} />
            <Route path="/account" element={<AccountPage />} />
          </Route>
          <Route path="/i/:id" element={<InstallationLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="parameters" element={<ParametersPage />} />
            <Route path="charts" element={<ChartsPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/installations" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  </StrictMode>,
)
