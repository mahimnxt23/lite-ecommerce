import type {Metadata} from "next";
import {Jost} from "next/font/google";
import "./globals.css";
import {Footer, Navbar} from "@/components";
import React from "react";

const jost = Jost({
    variable: "--font-josh",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Lite E-commerce",
    description: "A lightweight e-commerce site",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body className={`${jost.className} antialiased`}>
        <Navbar/>
        {children}
        <Footer/>
        </body>
        </html>
    );
}
