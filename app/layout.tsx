import Script from "next/script";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://rv-estrategia.vercel.app";
export const metadata = {

    metadataBase: new URL(SITE_URL),

    title: {
        default:
            "Rita Vanin | Estrategista Digital",
        template: "%s | Rita Vanin Rita Vanin | Estrategista Digital",
    },

    description:
        "Ajudo empresas e profissionais liberais a se posicionarem na internet e atrair clientes através do Instagram, Facebook e TikTok. Mais de 10 anos de experiência em marketing digital.",

    keywords: [
        "estratégia digital",
        "marketing com resultado para médicos",
        "marketing com resultado para advogados",
        "marketing com resultado para dentistas",
        "posicionamento digital",
        "posicionamento Instagram",
        "posicionamento Facebook",
        "posicionamento LinkedIn",
        "posicionamento TikTok",
    ],

    authors: [{ name: "Rita Vanin" }],

    openGraph: {
        title:
            "Rita Vanin | Estrategista Digital",
        description:
            "Ajudo empresas e profissionais liberais a se posicionarem na internet e atrair clientes através do Instagram, Facebook e TikTok. Mais de 10 anos de experiência em marketing digital.",
        url: SITE_URL,
        siteName: "Rita Vanin",
        images: [
            {
                url: `${SITE_URL}/og-image.jpg`,
                width: 1200,
                height: 630,
            },
        ],
        locale: "pt_BR",
        type: "website",
    },

    twitter: {
        card: "summary_large_image",
        title: "Rita Vanin | Estrategista Digital",
        description:
            "Ajudo empresas e profissionais liberais a se posicionarem na internet e atrair clientes através do Instagram, Facebook e TikTok. Mais de 10 anos de experiência em marketing digital.",
        images: [`${SITE_URL}/og-image.jpg`],
    },

    robots: {
        index: true,
        follow: true,
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="pt-BR">
            <head>
                {GA_ID && (
                    <>
                        <Script
                            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
                            strategy="afterInteractive"
                        />
                        <Script id="ga" strategy="afterInteractive">
                            {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}');
              `}
                        </Script>
                    </>
                )}
            </head>
            <body>{children}</body>
        </html>
    );
}