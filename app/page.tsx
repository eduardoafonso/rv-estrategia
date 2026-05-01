import LeadForm from "@/components/LeadForm";
import { SITE_URL } from "@/lib/site";

export const metadata = {
  title: "Rita Vanin | Estrategista Digital",

};

export default function Home() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Rita Vanin",
    url: SITE_URL,
    description:
      "Especialista em posicionamento digital para empresas e profissionais liberais.",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema),
        }}
      />

      <main className="flex flex-col items-center justify-center gap-12 p-10">

        {/* HERO */}
        <section className="text-center max-w-2xl">
          <h1 className="text-4xl font-bold">
            Rita Vanin | Estrategista Digital
          </h1>

          <p className="mt-4 text-gray-600">
            Posicionamento digital. Atraia clientes com estratégia nas redes sociais.
          </p>
        </section>

        {/* FORM */}
        <section className="w-full flex justify-center">
          <LeadForm />
        </section>

      </main>
    </>
  );
}