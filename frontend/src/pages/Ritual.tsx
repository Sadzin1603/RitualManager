import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Ritual.css";

export default function Ritual() {
  const { id } = useParams();
  const [ritual, setRitual] = useState<any>({ name: "loading", img: "", creator: { name: "loading" }, element: "loading" });

  useEffect(() => {
    async function fetchData() {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3000/ritual/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      setRitual(data[0]);
    }
    fetchData();
  }, []);

  return (
    <div
      className="pagina"
      data-element={ritual.element.toLowerCase()}
    >
      <div className="conteudo">

        {/* HEADER */}
        <div className="header">
          <div className="header-layout relative">
            <div className="header-imagem-wrap">
              {ritual.img
                ? <img className="header-imagem" src={ritual.img} alt={ritual.name} />
                : <div className="header-imagem-placeholder" />
              }
              <div className="header-imagem-glow" />
            </div>

            <div className="header-info">
              <h1 className="header-titulo">
                {ritual.name}
              </h1>

              <span className="badge">
                {ritual.element} {ritual.circle}
              </span>

              <p className="header-criador">
                Criado por {ritual.creator?.name}
              </p>
            </div>

            <button className="absolute top-[-1rem] right-[-1.5rem] bg-[#18181B] rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 8.25V6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 6v8.25A2.25 2.25 0 0 0 6 16.5h2.25m8.25-8.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-7.5A2.25 2.25 0 0 1 8.25 18v-1.5m8.25-8.25h-6a2.25 2.25 0 0 0-2.25 2.25v6" />
              </svg>
            </button>
          </div>
        </div>

        {/* INFO GRID */}
        <div className="info-grid">
          <InfoCard title="Execução" value={ritual.exec} />
          <InfoCard title="Alcance" value={ritual.range} />
          <InfoCard title="Alvo" value={ritual.target} />
          <InfoCard title="Duração" value={ritual.duration} />
          <InfoCard title="Efeito" value={ritual.effect} />
          <InfoCard title="Resistência" value={ritual.resistence} />
          <InfoCard title="Área" value={ritual.area} />
          <InfoCard title="Dados" value={ritual.dices} />
        </div>

        {/* DESCRIÇÃO */}
        <Section title="Descrição">
          {ritual.description}
        </Section>

        {/* DISCENTE */}
        {ritual.dice_discent && (
          <div className="extra-dado">
            <InfoCard title="Dados Discente" value={ritual.discent_dices} />
          </div>
        )}
        {ritual.discent_description && (
          <Section title="Discente">
            {ritual.discent_description}
          </Section>
        )}

        {/* VERDADEIRO */}
        {ritual.dice_truly && (
          <div className="extra-dado">
            <InfoCard title="Dados Verdadeiro" value={ritual.truly_dices} />
          </div>
        )}
        {ritual.truly_description && (
          <Section title="Verdadeiro">
            {ritual.truly_description}
          </Section>
        )}

        {/* RODAPÉ */}
        <div className="rodape">
          <p>Status: {ritual.status}</p>
          <p>Criado em {new Date(ritual.created_at).toLocaleDateString("pt-BR")}</p>
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