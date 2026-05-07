import { Routes, Route, Link, Navigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from 'react';

import Cadastro from "./pages/Cadastro";
import Login from "./pages/Login";
import Principal from "./pages/Principal";
import Rituais from './pages/Rituais';

import "./App.css";

function App() {

  const [loading, setLoading] = useState(true);

  const [islogado, setLogado] = useState(false);

  useEffect(() => {

    const token = localStorage.getItem("token");

    if (!token) {
      setLogado(false);
      setLoading(false);
      return;
    }

    try {

      const decoded = jwtDecode(token);

      const isExpired =
        decoded.exp * 1000 < Date.now();

      if (isExpired) {

        localStorage.removeItem("token");

        setLogado(false);

      } else {

        setLogado(true);

      }

    } catch (e) {
      console.log(e)
      localStorage.removeItem("token");

      setLogado(false);

    } finally {

      setLoading(false);

    }

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
          <Route path='/*' element={<Navigate to="/principal" replace />} />
          
        </Routes>

      </main>

    </div>
  );
}

export default App;