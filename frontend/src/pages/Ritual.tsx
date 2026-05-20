import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Modal from '../components/Modal'
import "./Ritual.css";
import { useMutation, useQuery } from "@tanstack/react-query";

export default function Ritual() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [token,setToken] = useState(localStorage.getItem('token') || [])
  const [openModalDelete,setOpenModalDelete] = useState(false)
  const [open,setOpen] = useState(false)

  const {data:ritual} = useQuery({
    queryKey:['ritual',id],
    queryFn: fetchData
  })
  async function fetchData() {
    const res = await fetch(`http://localhost:3000/ritual/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const ritual = await res.json()
    return await ritual[0]
  }

  const {mutateAsync:deletar} = useMutation({
    mutationFn:deletarRitual
  })
  async function deletarRitual(){
      const decoded = jwtDecode(token);

      const formData = new FormData();
      formData.append("name", ritual?.name);
      formData.append("element",    ritual?.element);
      formData.append("circle",     ritual?.circle);
      formData.append("exec",       ritual?.exec);
      formData.append("range", ritual?.range);
      formData.append("duration", ritual?.duration);
      formData.append("area", ritual?.area);
      formData.append("target", ritual?.target);
      formData.append("effect", ritual?.effect);
      formData.append("resistence", ritual?.resistence);
      formData.append("dices", ritual?.dices);
      formData.append("description", ritual?.description);
      formData.append("discent_description", ritual?.discent_description);
      formData.append("truly_description", ritual?.truly_description);
      formData.append("discent_dices", ritual?.discent_dices);
      formData.append("truly_dices", ritual?.truly_dices)
      formData.append("creator",    "17");
      formData.append("status",    ritual?.status);
      formData.append("img", ritual?.img); 

      try{
        const res = await fetch(`http://localhost:3000/ritual/delete/${ritual?.id}`, {
          method: "PUT",
          headers:{
            Authorization: `Bearer ${token}`,
            ritual:ritual?.creator.id
          },
          body: formData,
        });
        setOpenModalDelete(false)
        navigate("/profile")
      }catch(err){
        console.log(err.message)
      }
    }


  const {mutateAsync:copiar} = useMutation({
    mutationFn:copiarRitual
  })
  async function copiarRitual(){
      const decoded = jwtDecode(token!);

      const formData = new FormData();
      formData.append("name", `${ritual?.name} (cópia)`);
      formData.append("element",    ritual?.element);
      formData.append("circle",     ritual?.circle);
      formData.append("exec",       ritual?.exec);
      formData.append("range", ritual?.range);
      formData.append("duration", ritual?.duration);
      formData.append("area", ritual?.area);
      formData.append("target", ritual?.target);
      formData.append("effect", ritual?.effect);
      formData.append("resistence", ritual?.resistence);
      formData.append("dices", ritual?.dices);
      formData.append("description", ritual?.description);
      formData.append("discent_description", ritual?.discent_description);
      formData.append("truly_description", ritual?.truly_description);
      formData.append("discent_dices", ritual?.discent_dices);
      formData.append("truly_dices", ritual?.truly_dices)
      formData.append("creator",    decoded.id);

      formData.append("img", ritual?.img); 
      try{
        await fetch("http://localhost:3000/ritual/copy", {
          method: "POST",
          body: formData,
        });
        setOpen(false)
        navigate("/profile")
      }catch(err){
        console.log(err.message)
      }
  }
  return (
    <div
      className="pagina"
      data-element={ritual?.element.toLowerCase()}
    >
      <div className="conteudo">

        {/* HEADER */}
        <div className="header">
          <div className="header-layout relative">
            <div className="header-imagem-wrap">
              {ritual?.img
                ? <img className="header-imagem" src={ritual.img} alt={ritual.name} />
                : <div className="header-imagem-placeholder" />
              }
              <div className="header-imagem-glow" />
            </div>

            <div className="header-info">
              <h1 className="header-titulo">
                {ritual?.name}
              </h1>

              <span className="badge">
                {ritual?.element} {ritual?.circle}
              </span>

              <p className="header-criador">
                Criado por {ritual?.creator.name}
              </p>
            </div>
            <div className="absolute right-0">
              {/*   Botão de editar   */}
              {ritual?.creator.id == jwtDecode(token).id ?
              <button className="absolute top-[-1rem] right-[1.5rem] bg-[#18181B] rounded-lg" onClick={()=>navigate("/rituais",{state:ritual})} >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} color="green" stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
              </svg>
              </button>
              : ""}
              {/*   Botão de copiar   */}
              <button className="absolute top-[-1rem] right-[-1.5rem] bg-[#18181B] rounded-lg" >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6" onClick={()=>setOpen(true)}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 8.25V6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 6v8.25A2.25 2.25 0 0 0 6 16.5h2.25m8.25-8.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-7.5A2.25 2.25 0 0 1 8.25 18v-1.5m8.25-8.25h-6a2.25 2.25 0 0 0-2.25 2.25v6" />
                </svg>
              </button>
              {/*   Botão de deletar   */}
              {ritual?.creator.id == jwtDecode(token).id ?
              <button className="absolute top-[-1rem] right-[5rem] bg-[#18181B] rounded-lg" >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-red-500" onClick={()=>setOpenModalDelete(true)} >
                      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                  </svg>
              </button>
              : ""}
              <Modal
                  isOpen={open}
                  title="Copiar Ritual"
                  message="Tem certeza que deseja copiar esse ritual?"
                  onConfirm={copiar}
                  onCancel={() => setOpen(false)}
              />
              <Modal
                  isOpen={openModalDelete}
                  title="Deletar Ritual!!!"
                  message="Tem certeza que deseja deletar esse ritual?"
                  onConfirm={deletar}
                  onCancel={() => setOpenModalDelete(false)}
              />
            </div>
          </div>
        </div>

        {/* INFO GRID */}
        <div className="info-grid">
          <InfoCard title="Execução" value={ritual?.exec} />
          <InfoCard title="Alcance" value={ritual?.range} />
          <InfoCard title="Alvo" value={ritual?.target} />
          <InfoCard title="Duração" value={ritual?.duration} />
          <InfoCard title="Efeito" value={ritual?.effect} />
          <InfoCard title="Resistência" value={ritual?.resistence} />
          <InfoCard title="Área" value={ritual?.area} />
          <InfoCard title="Dados" value={ritual?.dices} />
        </div>

        {/* DESCRIÇÃO */}
        <Section title="Descrição">
          {ritual?.description}
        </Section>

        {/* DISCENTE */}
        {ritual?.dice_discent && (
          <div className="extra-dado">
            <InfoCard title="Dados Discente" value={ritual?.discent_dices} />
          </div>
        )}
        {ritual?.discent_description && (
          <Section title="Discente">
            {ritual?.discent_description}
          </Section>
        )}

        {/* VERDADEIRO */}
        {ritual?.dice_truly && (
          <div className="extra-dado">
            <InfoCard title="Dados Verdadeiro" value={ritual?.truly_dices} />
          </div>
        )}
        {ritual?.truly_description && (
          <Section title="Verdadeiro">
            {ritual?.truly_description}
          </Section>
        )}

        {/* RODAPÉ */}
        <div className="rodape">
          <p>Status: {ritual?.status}</p>
          <p>Criado em {new Date(ritual?.created_at).toLocaleDateString("pt-BR")}</p>
        </div>

      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="secao">
      <h2 className="secao-titulo">{title}</h2>
      <p className="secao-texto">{children}</p>
    </div>
  );
}

function InfoCard({ title, value }) {
  return (
    <div className="info-card">
      <p className="info-card-titulo">{title}</p>
      <p className="info-card-valor">{value || "-"}</p>
    </div>
  );
}