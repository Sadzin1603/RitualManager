import { Routes, Route,Link } from 'react-router-dom';
import Cadastro from "./pages/Cadastro"; 
import Login from "./pages/Login"
import "./App.css";
import Rituais from './pages/Rituais';
import Principal from "./pages/Principal"
import {Navigate} from "react-router-dom"
import { jwtDecode } from "jwt-decode";
import { useState,useEffect } from 'react';


function App() {
  const [islogado,setLogado] = useState(false)
  useEffect( ()=> {
    const token = localStorage.getItem("token");

    if (!token) return ()=>{};

    const decoded = jwtDecode(token);

    const isExpired = decoded.exp * 1000 < Date.now();
    setLogado(!isExpired)
    
  },[islogado])
  function PrivateRoute({ children} ) {
    return islogado ? children : <Navigate to="/" />;
  }

  return (
    <div className="App">
      <header className="w-screen bg-slate-800 h-36 flex justify-around items-center">
        {/*<h2>Olá {name}</h2>*/}
        <nav className="space-x-10 text-white">
          <Link to="/" className="hover:text-red-400">Home</Link>
          <Link to="/login" className="hover:text-red-400">Login</Link>
          {islogado ? <Link to="/principal" className="hover:text-red-400">Principal</Link> : ""}
          {islogado ?<Link to="/rituais" className="hover:text-red-400">Rituais</Link> : ""}
        </nav>
        {islogado? <button 
          className='bg-red-900'
          onClick={()=>{
            localStorage.setItem('token','') 
            setLogado(false)}
          }
          >Deslogar
          </button> 
          : ""}
        
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Cadastro />} />
          <Route path="/login" element={<Login setLogado={setLogado}/>} />
          <Route path="/principal" element={<PrivateRoute><Principal /></PrivateRoute>} />
          <Route path="/rituais" element={<PrivateRoute><Rituais /></PrivateRoute>} />
          
        </Routes>
      </main>
    </div>
  )
}

export default App;
