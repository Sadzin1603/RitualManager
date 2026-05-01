import { Routes, Route,Link } from 'react-router-dom';
import Cadastro from "./pages/Cadastro"; 
import Login from "./pages/Login"
import "./App.css";
import Principal from "./pages/Principal"
import {Navigate} from "react-router-dom"
import { jwtDecode } from "jwt-decode";
import Rituais from './pages/Rituais';

function App() {
  function isAuthenticated() {
    const token = localStorage.getItem("token");

    if (!token) return false;

    const decoded = jwtDecode(token);

    const isExpired = decoded.exp * 1000 < Date.now();

    return !isExpired;
  }
  function PrivateRoute({ children} ) {
    return isAuthenticated() ? children : <Navigate to="/" />;
  }

  return (
    <div className="App">
      <header className="w-screen bg-slate-800 h-36 flex justify-around items-center">
        {/*<h2>Olá {name}</h2>*/}
        <nav className="space-x-10 text-white">
          <Link to="/" className="hover:text-red-400">Home</Link>
          <Link to="/login" className="hover:text-red-400">Login</Link>
          <Link to="/principal" className="hover:text-red-400">Principal</Link>
          <Link to="/rituais" className="hover:text-red-400">Rituais</Link>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Cadastro />} />
          <Route path="/login" element={<Login />} />
          <Route path="/rituais" element={<Rituais />} />
          
          <Route path="/principal" element={<PrivateRoute route="/principal"><Principal /></PrivateRoute>} />
          
        </Routes>
      </main>
    </div>
  )
}

export default App;
