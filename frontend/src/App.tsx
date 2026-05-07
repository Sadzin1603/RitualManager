import { Routes, Route, Link, Navigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from 'react';

import Cadastro from "./pages/Cadastro";
import Login from "./pages/Login";
import Principal from "./pages/Principal";
import Rituais from './pages/Rituais';
import Admin from './pages/Admin';

import "./App.css";

function App() {

  const [loading, setLoading] = useState(true);
  const [islogado, setLogado] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {

  async function verifyLogin() {

    const token = localStorage.getItem("token");

    if (!token) {
      setLogado(false);
      setLoading(false);
      return;
    }

    try {

      const response = await fetch(
        "http://localhost:3000/auth/me",
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

  function PrivateRoute({ children }) {

    if (loading) {
      return <p>Carregando...</p>;
    }

    return islogado
      ? children
      : <Navigate to="/login" replace />;
  }

  function AdminRoute({children}){
    if(loading) return <p className='text-xl'>Carregando ...</p>

    if(!islogado) return <Navigate to="/login" />

    if(!user.admin) return <Navigate to="/principal" />

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
                Rituais
              </Link>
            </>
          )}

        </nav>

        {islogado && (
          <button
            className='bg-red-900 px-4 py-2 rounded'
            onClick={logout}
          >
            Deslogar
          </button>
        )}

      </header>

      <main>

        <Routes>

          <Route path="/" element={<Cadastro />}/>

          <Route path="/login" element={ <Login setLogado={setLogado} /> } />

          <Route path="/principal" element={ 
            <PrivateRoute>
              <Principal />
            </PrivateRoute>
            }
          />

          <Route path="/rituais" element={
              <PrivateRoute>
                <Rituais />
              </PrivateRoute>
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