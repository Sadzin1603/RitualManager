import { Routes, Route,Link } from 'react-router-dom';
import Cadastro from "./pages/Cadastro"; 
import Login from "./pages/Login"
import "./App.css";
import Rituais from './pages/Rituais';


function App() {

  return (
    <div className="App">
      <header className="w-screen bg-slate-800 h-36 flex justify-center items-center ">
        <nav className="space-x-10 text-white">
          <Link to="/" className="hover:text-red-400">Home</Link>
          <Link to="/login" className="hover:text-red-400">Login</Link>
          <Link to="/rituais" className="hover:text-red-400">Rituais</Link>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Cadastro />} />
          <Route path="/login" element={<Login />} />
          <Route path="/rituais" element={<Rituais />} />
          
        </Routes>
      </main>
    </div>
  )
}

export default App;
