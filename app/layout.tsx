import type { Metadata } from "next";
import { IBM_Plex_Mono, Space_Grotesk } from "next/font/google";
import Link from "next/link";

import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "OSSTrust — Bug Bounty Treasuries for Open Source",
  description:
    "Donate USDC to GitHub repositories, rank bug-bounty treasuries, and keep payout control inside guarded Safe vaults.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${ibmPlexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <nav className="site-nav">
          <Link className="nav-logo" href="/">
            <span className="nav-logo-icon">O</span>
            OSSTrust
          </Link>
          <div className="nav-links">
            <a className="nav-link" href="#custody">How it works</a>
            <a className="nav-link" href="#leaderboard">Leaderboard</a>
            <a className="nav-link" href="#roadmap">Roadmap</a>
          </div>
          <a className="nav-cta" href="#leaderboard">Explore →</a>
        </nav>

        {children}

        <footer className="site-footer">
          <div className="footer-inner">
            <div className="footer-logo">
              <span className="nav-logo-icon">O</span>
              OSSTrust
            </div>
            <p className="footer-copy">
              © 2025 OSSTrust · USDC bug bounties for open source
            </p>
            <div className="footer-links">
              <a className="footer-link" href="https://github.com/pierce403/osstrust" target="_blank" rel="noopener">GitHub</a>
              <a className="footer-link" href="#custody">Custody model</a>
              <a className="footer-link" href="#leaderboard">Leaderboard</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
