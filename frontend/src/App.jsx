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
import AdminLayout from './pages/Admin/AdminLayout'
import AdminHome from './pages/Admin/pages/AdminHome'
import MenuMangement from './pages/Admin/pages/MenuMangement'
import AddCategory from './pages/Admin/pages/AddCategory'
import AddMenu from './pages/Admin/pages/AddMenu'
import AdminTables from './pages/Admin/pages/AdminTables'
import Customer from './pages/dashboard/page/Customer'
import ManageInventory from './pages/Admin/pages/ManageInventory'
import AdminReports from './pages/Admin/pages/AdminReports'
import StaffManagement from './pages/Admin/pages/StaffManagement'
import CustomerHistory from './pages/Admin/pages/CustomerHistory'
import AdminDashboard from './pages/Admin/pages/AdminDashboard'
import KitchenDashboard from './pages/dashboard/page/KitchenDashboard'

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const { theme } = useThemeStore();

  React.useEffect(() => {
    checkAuth();
  }, [checkAuth]);

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

      <Route
        path="/login"
        element={!authUser ? <Login /> : <Navigate to={authUser.role === 'admin' ? "/admin" : "/"} />}
      />
      <Route
        path="/signup"
        element={!authUser ? <Signup /> : <Navigate to={authUser.role === 'admin' ? "/admin" : "/"} />}
      />


      <Route path="/" element={authUser ? <Dashboard /> : <Navigate to="/login" />} >
        <Route index element={
          authUser?.role === 'admin' ? <Navigate to="/admin" /> : <Navigate to="dashboard" />
        } />
        <Route path="dashboard" element={<DashboardHome />} />
        <Route path="orders" element={<OrderPage />} />
        <Route path="tables" element={<ManageTables />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="dishes" element={<Dishes />} />
        <Route path="customers" element={<Customer />} />
        <Route path="kitchen" element={<KitchenDashboard />} />
      </Route>

      <Route path='/admin' element={authUser && authUser.role === 'admin' ? <AdminLayout /> : <Navigate to={authUser ? "/" : "/login"} />} >
        <Route index element={<AdminDashboard />} />
        <Route path="/admin/menu" element={<MenuMangement />} />
        <Route path="/admin/add-category" element={<AddCategory />} />
        <Route path="/admin/add-menu" element={<AddMenu />} />
        <Route path="/admin/tables" element={<AdminTables />} />
        <Route path="/admin/inventory" element={<ManageInventory />} />
        <Route path="/admin/reports" element={<AdminReports />} />
        <Route path="/admin/staff" element={<StaffManagement />} />
        <Route path="/admin/customer-history" element={<CustomerHistory />} />
      </Route>

    </Routes>
  )
}

export default App