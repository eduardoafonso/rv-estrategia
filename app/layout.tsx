import Script from "next/script";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="pt-BR">
            <head>
                <Script
                    src={`https://www.googletagmanager.com/gtag/js?id=G-H1QVFKNHJQ`}
                    strategy="afterInteractive"
                />
                <Script id="google-analytics" strategy="afterInteractive">
                    {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-H1QVFKNHJQ');
          `}
                </Script>
            </head>
            <body>{children}</body>
        </html>
    );
}