import { SITE_URL } from "@/lib/site";

export const metadata = {
  title: "Rita | Estrategista Digital",

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
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema),
        }}
      />

      <h1>Rita Vanin</h1>
      <p>Estrategista Digital</p>
    </main>
  );
}