import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Modal from '../components/Modal.js'
import "./Ritual.css";
import { queryClient } from "../lib/react-querty.js";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";

export default function Ritual() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [token, setToken] = useState<string>(localStorage.getItem('token') || '')
  const [decodedToken, setDecodedToken] = useState<any | null>(token ? jwtDecode(token) : null)
  const [acoesAberto, setAcoesAberto] = useState(false);

  const { data: ritual } = useQuery({
    queryKey: ['ritual', id],
    queryFn: fetchData
  })
  async function fetchData() {
    const API_URL = import.meta.env.VITE_API_URL;
    const res = await fetch(`${API_URL}/ritual/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const ritual = await res.json()
    return await ritual[0]
  }

  const { mutateAsync: deletar } = useMutation({ mutationFn: deletarRitual })
  async function deletarRitual() {
    const formData = new FormData();
    formData.append("name", ritual?.name);
    formData.append("element", ritual?.element);
    formData.append("circle", ritual?.circle);
    formData.append("exec", ritual?.exec);
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
    formData.append("creator", "17");
    formData.append("status", ritual?.status);
    formData.append("img", ritual?.img);
    try {
      const API_URL = import.meta.env.VITE_API_URL;
      await fetch(`${API_URL}/ritual/delete/${ritual?.id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}`, ritual: ritual?.creator.id },
        body: formData,
      });
      setModal([false, '', '', () => { }])
      navigate("/profile")
    } catch (err) { console.log(err instanceof Error ? err.message : err) }
  }

  const [link, setLink] = useState(false);
  const handleShare = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setLink(true);
    setTimeout(() => setLink(false), 2000);
  };

  const { mutateAsync: copiar } = useMutation({ mutationFn: copiarRitual })
  async function copiarRitual() {
    const decoded = jwtDecode(token!) as any;
    const formData = new FormData();
    formData.append("name", `${ritual?.name} (cópia)`);
    formData.append("element", ritual?.element);
    formData.append("circle", ritual?.circle);
    formData.append("exec", ritual?.exec);
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
    formData.append("creator", decoded.id);
    formData.append("status", ritual?.status);
    formData.append("img", ritual?.img);
    try {
      const API_URL = import.meta.env.VITE_API_URL;
      await fetch(`${API_URL}/ritual/copy`, { method: "POST", body: formData });
      setModal([false, '', '', () => { }])
      navigate("/profile")
    } catch (err) { console.log(err instanceof Error ? err.message : err) }
  }

  const { mutateAsync: excluir } = useMutation({ mutationFn: excluirRitual })
  async function excluirRitual() {
    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const res = await fetch(`${API_URL}/ritual/${ritual.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) navigate("/principal")
    } catch (err: any) { console.log(err.message) }
  }

  const { mutateAsync: favoritar } = useMutation({
    mutationFn: favoritarRitual,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['ritual', id] }) }
  })
  async function favoritarRitual() {
    try {
      const API_URL = import.meta.env.VITE_API_URL;
      await fetch(`${API_URL}/ritual/${ritual.id}/favorite`, {
        method: "POST", headers: { Authorization: `Bearer ${token}` }
      })
    } catch (err: any) { console.log(err.message) }
  }

  const { mutateAsync: desfavoritar } = useMutation({
    mutationFn: desfavoritarRitual,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['ritual', id] }) }
  })
  async function desfavoritarRitual() {
    try {
      const API_URL = import.meta.env.VITE_API_URL;
      await fetch(`${API_URL}/ritual/${ritual.id}/desfavorite`, {
        method: "POST", headers: { Authorization: `Bearer ${token}` }
      })
    } catch (err: any) { console.log(err.message) }
  }

  const [modal, setModal] = useState<[boolean, string, string, () => void]>([false, '', '', () => { }])
  function openModal(title: string, message: string, onConfirm: () => void) {
    setModal([true, title, message, onConfirm])
  }

  const [comment, setComment] = useState('')
  const { data: comments } = useQuery({
    queryKey: ['comments', id],
    queryFn: async () => {
      const API_URL = import.meta.env.VITE_API_URL;
      const res = await fetch(`${API_URL}/comments/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!res.ok) throw new Error("Failed to fetch comments")
      return res.json()
    }
  })

  const { mutateAsync: comentar } = useMutation({
    mutationFn: comentarRitual,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['comments', id] }) }
  })
  async function comentarRitual() {
    try {
      if (!comment.trim()) return;
      const API_URL = import.meta.env.VITE_API_URL;
      await fetch(`${API_URL}/comments/${id}`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ comentario: comment })
      })
      setComment('')
    } catch (err: any) { console.log(err.message) }
  }

  const queryClient2 = useQueryClient()
  const { data: rituais } = useQuery({ queryKey: ['rituais_pendentes'], queryFn: fetchData2 })
  async function fetchData2() {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:3000/admin/rituals/pending", {
      headers: { Authorization: `Bearer ${token}` }
    });
    return await res.json();
  }

  const { data: rituais } = useQuery({
    queryKey: ['rituais_pendentes'],
    queryFn: fetchData2
  })

  async function fetchData2() {
    const token = localStorage.getItem("token");
    const res = await fetch(
      "http://localhost:3000/admin/rituals/pending",
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return await res.json();

  }
  const { mutateAsync: mudarStatus } = useMutation({
    mutationFn: changeAproved,
    onSuccess(_, variables) {
      queryClient2.setQueryData(['rituais_pendentes'], (data: any) =>
        data.filter((ritual: any) => ritual.id !== variables.id)
      )
    }
  })
  async function changeAproved({ id, status }: { id: number, status: string }) {
    try {
      const token = localStorage.getItem("token");
      const API_URL = import.meta.env.VITE_API_URL;
      await fetch(`${API_URL}/admin/ritual/${id}/${status}`, {
        method: "PATCH", headers: { Authorization: `Bearer ${token}` },
      })
    } catch (err: any) { console.log(err.message) }
  }

  return (
    <div className="pagina flex justify-around" data-element={ritual?.element.toLowerCase()}>
      <div className="conteudo w-[60%]">

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
              <h1 className="header-titulo">{ritual?.name}</h1>
              <span className="badge">{ritual?.element} {ritual?.circle}</span>
              <p className="header-criador">Criado por {ritual?.creator.name}</p>
            </div>

            {/* ── Botões DESKTOP (absolute, comportamento original) ── */}
            <div className="div-botoes absolute right-3 top-3 div-botoes--desktop">
              {decodedToken ? ritual?.favorited
                ? <button className="absolute top-[-1.8rem] right-[-1.5rem] bg-[#0c0c0c] rounded-lg p-2" onClick={() => desfavoritar()}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="red" viewBox="0 0 24 24" strokeWidth={1.5} stroke="red" className="size-6"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.239-4.5-5-4.5-1.74 0-3.273.8-4 2.019-.727-1.22-2.26-2.019-4-2.019-2.761 0-5 2.015-5 4.5 0 7.22 9 12 9 12s9-4.78 9-12Z" /></svg>
                  </button>
                : <button className="absolute top-[-1.8rem] right-[-1.5rem] bg-[#0c0c0c] rounded-lg p-2" onClick={() => favoritar()}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.239-4.5-5-4.5-1.74 0-3.273.8-4 2.019-.727-1.22-2.26-2.019-4-2.019-2.761 0-5 2.015-5 4.5 0 7.22 9 12 9 12s9-4.78 9-12Z" /></svg>
                  </button>
                : ""}
              {decodedToken
                ? <button className="absolute top-[-1.8rem] right-[1.5rem] bg-[#0c0c0c] rounded-lg p-2" onClick={handleShare}>
                    {link && <span className="absolute top-[-2rem] right-[-2rem] bg-green-600 text-white text-xs px-2 py-1 rounded w-[100px]">Link Copiado</span>}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6"><path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" /></svg>
                  </button>
                : ""}
              {decodedToken
                ? <button className="absolute top-[-1.8rem] right-[4.5rem] bg-[#0c0c0c] rounded-lg p-2" onClick={() => openModal("Copiar Ritual", "Tem certeza que deseja copiar esse ritual?", copiar)}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" color="blue" strokeWidth={1.5} stroke="currentColor" className="size-6"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 8.25V6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 6v8.25A2.25 2.25 0 0 0 6 16.5h2.25m8.25-8.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-7.5A2.25 2.25 0 0 1 8.25 18v-1.5m8.25-8.25h-6a2.25 2.25 0 0 0-2.25 2.25v6" /></svg>
                  </button>
                : ""}
              {ritual?.creator.id == decodedToken?.id
                ? <button className="absolute top-[-1.8rem] right-[7.5rem] bg-[#0c0c0c] rounded-lg p-2" onClick={() => navigate("/rituais", { state: ritual })}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} color="green" stroke="currentColor" className="size-6"><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg>
                  </button>
                : ""}
              {ritual?.creator.id == decodedToken?.id
                ? <button className="absolute top-[-1.8rem] right-[10.5rem] bg-[#0c0c0c] rounded-lg p-2" onClick={() => openModal("Deletar Ritual", "Tem certeza que deseja deletar esse ritual?", deletar)}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-red-500"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
                  </button>
                : ""}
              {decodedToken?.admin
                ? <button className="absolute top-[-1.8rem] right-[13.5rem] bg-[#ef4444] rounded-lg p-2" onClick={() => openModal("Desaprovar ritual", "Tem certeza que deseja desaprovar esse ritual?", () => mudarStatus({ "id": ritual.id, "status": "reprovado" }))}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-[#0c0c0c]"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
                  </button>
                : ""}
              <Modal isOpen={modal[0]} title={modal[1]} message={modal[2]} onConfirm={modal[3]} onCancel={() => setModal([false, '', '', () => { }])} />
            </div>

          <div className="div-botoes--mobile">
              {/* Favoritar: fica sempre visível ao lado do botão de ações */}
              {decodedToken ? ritual?.favorited
                ? <button className="bg-[#0c0c0c] rounded-lg p-2" onClick={() => desfavoritar()}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="red" viewBox="0 0 24 24" strokeWidth={1.5} stroke="red" className="size-6"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.239-4.5-5-4.5-1.74 0-3.273.8-4 2.019-.727-1.22-2.26-2.019-4-2.019-2.761 0-5 2.015-5 4.5 0 7.22 9 12 9 12s9-4.78 9-12Z" /></svg>
                  </button>
                : <button className="bg-[#0c0c0c] rounded-lg p-2" onClick={() => favoritar()}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.239-4.5-5-4.5-1.74 0-3.273.8-4 2.019-.727-1.22-2.26-2.019-4-2.019-2.761 0-5 2.015-5 4.5 0 7.22 9 12 9 12s9-4.78 9-12Z" /></svg>
                  </button>
                : ""}

              {/* Botão de ações: abre drawer */}
              {decodedToken && (
                <button className="bg-[#0c0c0c] rounded-lg p-2" onClick={() => setAcoesAberto(true)}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
                  </svg>
                </button>
              )}

              {/* Drawer de ações mobile */}
              {acoesAberto && (
                <div className="acoes-drawer-overlay" onClick={() => setAcoesAberto(false)}>
                  <div className="acoes-drawer" onClick={e => e.stopPropagation()}>
                    <div className="acoes-drawer-lista">
                      {decodedToken && (
                        <button className="bg-[#0c0c0c] rounded-lg p-2" onClick={() => { handleShare(); setAcoesAberto(false); }}>
                          {link && <span className="absolute top-[-2rem] right-0 bg-green-600 text-white text-xs px-2 py-1 rounded w-[100px]">Link Copiado</span>}
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6"><path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" /></svg>
                        </button>
                      )}
                      {decodedToken && (
                        <button className="bg-[#0c0c0c] rounded-lg p-2" onClick={() => { openModal("Copiar Ritual", "Tem certeza que deseja copiar esse ritual?", copiar); setAcoesAberto(false); }}>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" color="blue" strokeWidth={1.5} stroke="currentColor" className="size-6"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 8.25V6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 6v8.25A2.25 2.25 0 0 0 6 16.5h2.25m8.25-8.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-7.5A2.25 2.25 0 0 1 8.25 18v-1.5m8.25-8.25h-6a2.25 2.25 0 0 0-2.25 2.25v6" /></svg>
                        </button>
                      )}
                      {ritual?.creator.id == decodedToken?.id && (
                        <button className="bg-[#0c0c0c] rounded-lg p-2" onClick={() => { navigate("/rituais", { state: ritual }); setAcoesAberto(false); }}>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} color="green" stroke="currentColor" className="size-6"><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg>
                        </button>
                      )}
                      {ritual?.creator.id == decodedToken?.id && (
                        <button className="bg-[#0c0c0c] rounded-lg p-2" onClick={() => { openModal("Deletar Ritual", "Tem certeza que deseja deletar esse ritual?", deletar); setAcoesAberto(false); }}>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-red-500"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
                        </button>
                      )}
                      {decodedToken?.admin && (
                        <button className="bg-[#ef4444] rounded-lg p-2" onClick={() => { openModal("Desaprovar ritual", "Tem certeza que deseja desaprovar esse ritual?", () => mudarStatus({ "id": ritual.id, "status": "reprovado" })); setAcoesAberto(false); }}>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-[#0c0c0c]"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
              <Modal isOpen={modal[0]} title={modal[1]} message={modal[2]} onConfirm={modal[3]} onCancel={() => setModal([false, '', '', () => { }])} />
            </div>{/* fecha div-botoes--mobile */}
          </div>{/* fecha header-layout */}
        </div>

        {/* INFO GRID */}
        <div className="info-grid">
          <InfoCard title="Execução" value={ritual?.exec} />
          <InfoCard title="Alcance" value={ritual?.range} />
          <InfoCard title="Alvo" value={ritual?.target} />
          <InfoCard title="Duração" value={ritual?.duration} />
          <InfoCard title="Dados" value={ritual?.dices} />
          <InfoCard title="Efeito" value={ritual?.effect} />
          <InfoCard title="Resistência" value={ritual?.resistence} />
          <InfoCard title="Área" value={ritual?.area} />
        </div>

        <Section title="Descrição">{ritual?.description}</Section>

        {ritual?.discent_dices && <div className="extra-dado"><InfoCard title="Dados Discente" value={ritual?.discent_dices} /></div>}
        {ritual?.discent_description && <Section title="Discente">{ritual?.discent_description}</Section>}
        {ritual?.truly_dices && <div className="extra-dado"><InfoCard title="Dados Verdadeiro" value={ritual?.truly_dices} /></div>}
        {ritual?.truly_description && <Section title="Verdadeiro">{ritual?.truly_description}</Section>}

        <div className="rodape">
          <p>Status: {ritual?.status}</p>
          <p>Criado em {new Date(ritual?.created_at).toLocaleDateString("pt-BR")}</p>
        </div>
      </div>

      {/* COMENTÁRIOS */}
      <div className="w-[40%] max-w-2xl ml-[2%]">
        <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-white">Comentários</h1>
            <span className="text-sm text-zinc-400">{comments?.length} comentários</span>
          </div>
          <textarea
            placeholder="Escreva um comentário..."
            className="w-full min-h-[120px] bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white placeholder:text-zinc-500 resize-none outline-none focus:border-violet-500 transition"
            onChange={(e) => setComment(e.target.value)}
            value={comment}
          />
          <button className="mt-4 bg-violet-600 hover:bg-violet-500 transition text-white px-5 py-2 rounded-xl font-medium" onClick={() => comentar()}>
            Comentar
          </button>
          <div className="mt-8 flex flex-col gap-4">
            {comments?.map((comment) => (
              <div key={comment.id} className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div>
                    <strong className="text-white block">{comment.creator.name}</strong>
                    <span className="text-xs text-zinc-500">
                      {comment.created_at && new Date(comment.created_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "2-digit", hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </div>
                <p className="text-zinc-300 leading-relaxed">{comment.comentario}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="secao">
      <h2 className="secao-titulo">{title}</h2>
      <p className="secao-texto">{children}</p>
    </div>
  );
}

function InfoCard({ title, value }: { title: string; value: string | number | null | undefined }) {
  return (
    <div className="info-card">
      <p className="info-card-titulo">{title}</p>
      <p className="info-card-valor">{value || "-"}</p>
    </div>
  );
}