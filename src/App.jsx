import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './layouts/AppLayout.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Containers from './pages/Containers.jsx';
import Deployments from './pages/Deployments.jsx';
import Logs from './pages/Logs.jsx';
import SystemHealth from './pages/SystemHealth.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="/containers" element={<Containers />} />
        <Route path="/deployments" element={<Deployments />} />
        <Route path="/logs" element={<Logs />} />
        <Route path="/system-health" element={<SystemHealth />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
