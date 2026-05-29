import { Routes, Route, Link, Navigate } from 'react-router-dom';
import { useState, useEffect, type ReactNode } from 'react';
import Cadastro from "./pages/Cadastro.js";
import Login from "./pages/Login.js";
import Principal from "./pages/Principal.js";
import Rituais from './pages/Rituais.js';
import Admin from './pages/Admin.js';
import Ritual from './pages/Ritual.js';
import Profile from './pages/Profile.js';
import "./App.css";

function App() {
  const [loading, setLoading] = useState(true);
  const [islogado, setLogado] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {

    async function verifyLogin() {

      const token = localStorage.getItem("token");

      if (!token) {
        setLogado(false);
        setLoading(false);
        return;
      }

      try {
        const API_URL = import.meta.env.VITE_API_URL
        const response = await fetch(
          `${API_URL}/auth/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (!response.ok) {
          throw new Error();
        }

        const user = await response.json();
        setUser(user);

        setLogado(true);

      } catch (e) {

        localStorage.removeItem("token");

        setLogado(false);

      } finally {

        setLoading(false);

      }

    }

    verifyLogin();

  }, []);

  function logout() {
    localStorage.removeItem("token");
    setLogado(false);

  }
  interface User {
    id: string;
    admin: boolean; 
  }
  interface PrivateRouteProps {
    children: ReactNode;
  }
  function PrivateRoute({ children } : PrivateRouteProps) {

    if (loading) {
      return <p>Carregando...</p>;
    }

    return islogado
      ? children
      : <Navigate to="/login" replace />;
  }

  function AdminRoute({ children } : PrivateRouteProps) {
    if (loading) return <p className='text-xl'>Carregando ...</p>

    if (!islogado) return <Navigate to="/login" />

    if (!user?.admin) return <Navigate to="/principal" />

    return children
  }

  return (

    <div className="App">
      <header className="w-auto bg-slate-800 h-36 flex justify-around items-center">
        <nav className="space-x-10 text-white">
          <Link to="/" className="hover:text-red-400">
            Home
          </Link>

          {!islogado && (
            <Link
              to="/login"
              className="hover:text-red-400"
            >
              Login
            </Link>
          )}

          {islogado && (
            <>
              <Link
                to="/principal"
                className="hover:text-red-400"
              >
                Principal
              </Link>

              <Link
                to="/rituais"
                className="hover:text-red-400"
              >
                Criar Ritual
              </Link>
            </>
          )}

        </nav>
        <div className="flex items-center gap-4">
          {islogado && (
            <Link
              to="/login"
              className='bg-red-900 px-4 py-2 rounded text-white'
              onClick={logout}
            >
              Deslogar
            </Link>
          )}

          {islogado && user?.admin ? (
            <Link
              to="/admin"
              className="bg-red-900 px-4 py-2 rounded text-white"
            >
              Admin
            </Link>
          )
          : ''
        }
        </div>
      </header>

      <main>

        <Routes>

          <Route path="/" element={<Cadastro />} />

          <Route path="/login" element={<Login setLogado={setLogado} />} />

          <Route path="/principal" element={
            <PrivateRoute>
              <Principal />
            </PrivateRoute>
          }
          />
          <Route path="/profile" element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
          />
          

          <Route path="/rituais" element={
            <PrivateRoute>
              <Rituais />
            </PrivateRoute>
          }
          />

          <Route path="/ritual/:id" element={
              <Ritual />
          }
          />


          <Route path="/admin" element={
            <AdminRoute>
              <Admin />
            </AdminRoute>
          }
          />
          <Route path='/*' element={<Navigate to="/principal" replace />} />

        </Routes>

      </main>

    </div>
  );
}

export default App;