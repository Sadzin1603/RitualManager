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
          {ritual.img
            ? <img className="header-imagem" src={ritual.img} alt={ritual.name} />
            : <div className="header-imagem-placeholder" />
          }

          <div className="header-gradiente" />

          <div className="header-info">
            <span className="badge">
              {ritual.element} {ritual.circle}
            </span>

            <h1 className="header-titulo">
              {ritual.name}
            </h1>

            <p className="header-criador">
              Criado por {ritual.creator?.name}
            </p>
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