import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    background: "#ffffff",
                }}
            >
                <h1 style={{ fontSize: 64, color: "#000" }}>
                    Rita Vanin
                </h1>

                < p style={{ fontSize: 32, color: "#444" }}>
                    Estrategista Digital
                </p>
            </div>
        ),
        {
            width: 1200,
            height: 630,
        }
    );
}