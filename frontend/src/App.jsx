import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Auth/Login'
import Signup from './pages/Auth/Signup'
import Dashboard from './pages/dashboard/Dashboard'
import { useAuthStore } from './store/useAuthStore'
import { Loader } from 'lucide-react'

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  React.useEffect(() => {
    checkAuth();
  }, []);

  // console.log(authUser)

  if (isCheckingAuth) {
    return <div className='w-full h-screen flex justify-center items-center'><Loader className="animate-spin size-20 text-cyan-500" /></div>
  }
  return (
    <Routes>
      <Route path="/" element={authUser ? <Dashboard /> : <Navigate to="/login" />} />
      <Route path="/login" element={!authUser ? <Login /> : <Navigate to="/" />} />
      <Route path="/signup" element={!authUser ? <Signup /> : <Navigate to="/" />} />
    </Routes>
  )
}

export default App