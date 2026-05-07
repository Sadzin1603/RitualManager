import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function Ritual() {
  const { id } = useParams();
  const [ritual, setRitual] = useState({"name":"loading","img":"loading","creator":{"name":"loading"}});
  console.log(ritual)
  
  useEffect(() => {
      async function fetchData() {  
          const res = await fetch(`http://localhost:3000/ritual?id=${id}`);
          const data = await res.json();
          
          setRitual(data[0]);
      }

      fetchData();
  }, []);
  
  
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6">
      <div className="max-w-4xl mx-auto">

        {/* HEADER */}
        <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
          <img
            src={ritual.img}
            alt={ritual.name}
            className="w-full h-72 object-cover opacity-60"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent" />

          <div className="absolute bottom-0 left-0 p-6">
            <span className="bg-red-700 px-3 py-1 rounded-full text-sm font-semibold uppercase">
              {ritual.element}
            </span>

            <h1 className="text-4xl font-bold mt-4">
              {ritual.name}
            </h1>

            <p className="text-zinc-400 mt-2">
              Criado por {ritual.creator.name}
            </p>
          </div>
        </div>

        {/* INFO */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">

          <InfoCard
            title="Círculo"
            value={`${ritual.circle}°`}
          />

          <InfoCard
            title="Execução"
            value={ritual.exec}
          />

          <InfoCard
            title="Alcance"
            value={ritual.range}
          />

          <InfoCard
            title="Alvo"
            value={ritual.target}
          />
        </div>

        {/* DESCRIÇÃO */}
        <Section title="Descrição">
          {ritual.description}
        </Section>

        {/* DISCENTE */}
        {ritual.discent_description && (
          <Section title="Discente">
            {ritual.discent_description}
          </Section>
        )}

        {/* VERDADEIRO */}
        {ritual.truly_description && (
          <Section title="Verdadeiro">
            {ritual.truly_description}
          </Section>
        )}

        {/* RODAPÉ */}
        <div className="mt-10 text-sm text-zinc-500 border-t border-zinc-800 pt-4">
          <p>Status: {ritual.status}</p>
          <p>
            Criado em{" "}
            {new Date(ritual.created_at).toLocaleDateString("pt-BR")}
          </p>
        </div>
      </div>
    </div>
  
  )
}

function Section({ title, children }) {
  return (
    <div className="mt-8 bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
      <h2 className="text-2xl font-bold mb-4">
        {title}
      </h2>

      <p className="text-zinc-300 leading-relaxed">
        {children}
      </p>
    </div>
  );
}

function InfoCard({ title, value }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
      <p className="text-zinc-500 text-sm">
        {title}
      </p>

      <p className="text-lg font-semibold mt-1">
        {value || "-"}
      </p>
    </div>
  );
}