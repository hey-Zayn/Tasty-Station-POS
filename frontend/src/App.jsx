import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Auth/Login'
import Signup from './pages/Auth/Signup'
import Dashboard from './pages/dashboard/Dashboard'
import { useAuthStore } from './store/useAuthStore'
import { useThemeStore } from './store/useThemeStore'
import { Loader } from 'lucide-react'
import DashboardHome from './pages/dashboard/page/DashboardHome'
import OrderPage from './pages/dashboard/page/OrderPage'
import ManageTables from './pages/dashboard/page/ManageTables'
import Inventory from './pages/dashboard/page/Inventory'
import Dishes from './pages/dashboard/page/Dishes'

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const { theme } = useThemeStore();

  React.useEffect(() => {
    checkAuth();
  }, []);

  React.useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  // console.log(authUser)

  if (isCheckingAuth) {
    return <div className='w-full h-screen flex justify-center items-center'><Loader className="animate-spin size-20 text-cyan-500" /></div>
  }
  return (
    <Routes>

      <Route path="/login" element={!authUser ? <Login /> : <Navigate to="/" />} />
      <Route path="/signup" element={!authUser ? <Signup /> : <Navigate to="/" />} />


      <Route path="/" element={authUser ? <Dashboard /> : <Navigate to="/login" />} >
        <Route index element={<Navigate to="dashboard" />} />
        <Route path="dashboard" element={<DashboardHome />} />
        <Route path="orders" element={<OrderPage />} />
        <Route path="tables" element={<ManageTables />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="dishes" element={<Dishes />} />
      </Route>

    </Routes>
  )
}

export default App