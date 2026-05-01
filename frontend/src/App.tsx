import { Routes, Route,Link } from 'react-router-dom';
import Cadastro from "./pages/Cadastro"; 
import Login from "./pages/Login"
import "./App.css";
import Principal from "./pages/Principal"
import { useState,useEffect } from 'react';
import { jwtDecode } from "jwt-decode";


function App() {
  // const [name,setName] = useState("")

  // useEffect(() => {
  //   const token = localStorage.getItem("token");

  //   if (token) {
  //     const decoded = jwtDecode(token);
  //     setName(decoded.name);
  //   }
  // }, []);

  return (
    <div className="App">
      <header className="w-screen bg-slate-800 h-36 flex justify-around items-center">
        {/*<h2>Olá {name}</h2>*/}
        <nav className="space-x-10 text-white">
          <Link to="/" className="hover:text-red-400">Home</Link>
          <Link to="/login" className="hover:text-red-400">Login</Link>
          <Link to="/principal" className="hover:text-red-400">Principal</Link>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Cadastro />} />
          <Route path="/login" element={<Login />} />
          <Route path="/principal" element={<Principal />} />
          
        </Routes>
      </main>
    </div>
  )
}

export default App;
