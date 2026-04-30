import { useState } from "react";
import Input from "../components/Input";
import { CheckIcon, EyeIcon, EyeOffIcon, XIcon } from "lucide-react";

function Cadastro( ) {

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  // Dentro do input
  const temTamanho = senha.length >= 5;
  const temMaiuscula = /[A-Z]/.test(senha);
  const temNumero = /[0-9]/.test(senha);
  const temEspecial = /[!@#$%^&*(),.?":{}|<>]/.test(senha);

  // Esta variável decide se o formulário é válido
  const senhaValida = temTamanho && temMaiuscula && temNumero && temEspecial;

  const [show, setShow] = useState(false);//ver a senha

  function mostrar() {
    setShow(!show);
  }

  async function cadastrar() {
    await fetch("http://localhost:3000/cadastro",{
      method:"POST",
      headers:{ 'Content-Type': 'application/json' },
      body: JSON.stringify({ name:nome,email,password:senha })
    })
  }


  return (
    <div className='title w-screen min-h-screen flex justify-center p-6'>
      <div className="w-[500px] space-y-4">
        
    <div className="div space-y-6 p-6 rounded-md shadow flex flex-col">
      <h1 className="text-white text-center font-black text-3xl">
        Cadastro de Usuários
      </h1>
      <Input
        type="text"
        placeholder="Nome"
        value={nome}
        onChange={(event) => setNome(event.target.value)}
      />
      <Input
        type="email"
        placeholder="E-mail"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          placeholder="senha"
          value={senha}
          onChange={(event) => setSenha(event.target.value)}
          className="input px-4 py-2 rounded-2xl placeholder-gray-400 text-white w-full"
        />
        <span
          className="absolute text-white right-3 top-2.5 cursor-pointer"
          onClick={mostrar}
        >
          {show ? <EyeIcon /> : <EyeOffIcon />}
        </span>
      </div>

      <button
        className="input px-4 py-2 rounded-2xl placeholder-gray-400 text-white cursor-pointer"
        type="submit"
        placeholder="Nome"
        value="Cadastrar"
        onClick={async () => {
          if (!nome.trim() || !senha.trim() || !email.trim()) {
            return alert("Preencha todos os campos antes de cadastrar");//inves de ser alerta fazer como o require de um formulario do html padrão
          }
          if (!senhaValida) {
            return alert("A senha não corresponde algum dos criterios");//inves de ser alerta fazer como o require de um formulario do html padrão
          }

          cadastrar()

          setNome("");
          setEmail("");
          setSenha("");
        }}
      >
        Cadastrar
      </button>
      <div>
        <div className="flex text-white space-x-2">
          {temTamanho ? (
            <CheckIcon className="text-green-500" />
          ) : (
            <XIcon className="text-red-500" />
          )}
          <p>Ter pelo menos de 5 caracteres</p>
        </div>
        <div className="flex text-white space-x-2">
          {temMaiuscula ? (
            <CheckIcon className="text-green-500" />
          ) : (
            <XIcon className="text-red-500" />
          )}

          <p>Ter pelo menos 1 letra maiscula</p>
        </div>
        <div className="flex text-white space-x-2">
          {temNumero ? (
            <CheckIcon className="text-green-500" />
          ) : (
            <XIcon className="text-red-500" />
          )}
          <p>Ter pelo menos 1 numero</p>
        </div>
        <div className="flex text-white space-x-2">
          {temEspecial ? (
            <CheckIcon className="text-green-500" />
          ) : (
            <XIcon className="text-red-500" />
          )}
          <p>Ter pelo menos 1 caractere especial</p>
        </div>
      </div>
    </div>
    </div>
    </div>
  );
}

export default Cadastro;