import { headers } from "next/headers";
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from '@/app/providers';

const interDisplay = localFont({
    src: [
        {
            path: "../public/fonts/InterDisplay-Light.woff2",
            weight: "300",
        },
        {
            path: "../public/fonts/InterDisplay-Regular.woff2",
            weight: "400",
        },
        {
            path: "../public/fonts/InterDisplay-Medium.woff2",
            weight: "500",
        },
        {
            path: "../public/fonts/InterDisplay-SemiBold.woff2",
            weight: "600",
        },
        {
            path: "../public/fonts/InterDisplay-Bold.woff2",
            weight: "700",
        },
    ],
    variable: "--font-inter-display",
});

export const metadata: Metadata = {
    title: "Collabs - UGC Platform",
    description: "Nigerian UGC platform connecting brands with creators",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <meta
                    name="description"
                    content="Collabs - Nigerian UGC platform connecting brands with creators"
                />
                <meta
                    name="product-name"
                    content="Collabs - UGC Platform"
                />
            </head>
            <body
                className={`${interDisplay.variable} bg-b-surface1 font-inter text-body-1 text-t-primary antialiased`}
                suppressHydrationWarning
            >
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}

export async function generateViewport(): Promise<Viewport> {
    const userAgent = (await headers()).get("user-agent");
    const isiPhone = /iphone/i.test(userAgent ?? "");
    return {
        ...(isiPhone ? {
            width: "device-width",
            initialScale: 1,
            maximumScale: 1, // disables auto-zoom on ios safari
        } : {
            width: "device-width",
            initialScale: 1,
        }),
        // Disable scroll restoration for smoother navigation
        colorScheme: "light dark",
    };
}
