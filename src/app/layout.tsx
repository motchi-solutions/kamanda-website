import { socialMetadata } from "@/lib/social-metadata";
import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";

import { JsonLd } from "@/components/seo/json-ld";
import { indexingAllowed, site, siteUrl } from "@/lib/site";

import "./globals.css";
import { ContactNavigationProvider } from "@/components/ui/contact-navigation";
import { SiteIntro } from "@/components/layout/site-intro";
import { SiteAnalytics } from "@/components/analytics/site-analytics";
import { analyticsEnabled } from "@/lib/analytics";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const baseUrl = siteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),

  title: {
    default: "Kamanda Management LLC",
    template: "%s | Kamanda Management LLC",
  },

  description:
    "Kamanda Management LLC provides project management, construction support, technology and AI adoption, and specialized business solutions.",

  applicationName: "Kamanda Management LLC",

  keywords: [
    "Kamanda Management LLC",
    "project management",
    "construction support",
    "technology consulting",
    "AI adoption",
    "business solutions",
    "UAE",
    "Saudi Arabia",
  ],

  authors: [
    {
      name: "Kamanda Management LLC",
      url: baseUrl,
    },
  ],

  creator: "Kamanda Management LLC",
  publisher: "Kamanda Management LLC",

  alternates: {
    canonical: "/",
  },

  ...socialMetadata({
    title: "Kamanda Management LLC",
    description:
      "Project management, construction support, technology and AI adoption, and specialized business solutions.",
    path: "/",
  }),

  robots: indexingAllowed()
    ? {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-image-preview": "large",
          "max-snippet": -1,
          "max-video-preview": -1,
        },
      }
    : { index: false, follow: false },
};

/* Organization details for search engines. Only facts shown on the site. */
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: site.name,
  url: site.url,
  logo: `${site.url}/icon.svg`,
  image: `${site.url}/seo/og-default.png`,
  description: site.description,
  areaServed: ["United Arab Emirates", "Saudi Arabia"],
  email: "info@kamandagroup.com",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body
        className={`${manrope.variable} ${cormorantGaramond.variable} antialiased`}
      >
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <JsonLd data={organizationJsonLd} />
        <SiteIntro />
        <ContactNavigationProvider>
          <div className="site-content">{children}</div>
        </ContactNavigationProvider>
        {analyticsEnabled() && <SiteAnalytics />}
      </body>
    </html>
  );
}
