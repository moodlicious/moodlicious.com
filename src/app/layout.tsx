import { Footer, Layout, Navbar } from "nextra-theme-docs";
import { Head } from "nextra/components";
import { getPageMap } from "nextra/page-map";
import "nextra-theme-docs/style.css";
import "./globals.css";
import { ReactNode } from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: { default: "Moodlicious", template: "%s | Moodlicious" },
};

const navbar = (
    <Navbar
        logo={<b>Moodlicious</b>}
        projectLink="https://github.com/moodlicious"
    />
);
const footer = <Footer>{new Date().getFullYear()} © Moodlicious.</Footer>;

export default async function RootLayout({
    children,
}: {
    children: ReactNode;
}) {
    return (
        <html lang="en" dir="ltr" suppressHydrationWarning>
            <Head></Head>
            <body>
                <Layout
                    navbar={navbar}
                    pageMap={await getPageMap("/docs")}
                    footer={footer}
                    feedback={{ content: null }}
                    editLink={null}
                >
                    {children}
                </Layout>
            </body>
        </html>
    );
}
