import { Inter, Instrument_Sans, Instrument_Serif } from "next/font/google";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", weight: ["300", "400", "500", "600", "700"] });
const instrumentSans = Instrument_Sans({ subsets: ["latin"], variable: "--font-instrument-sans", weight: ["400", "600"] });
const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-instrument-serif",
  weight: "400",
  style: ["normal", "italic"],
});

export const metadata = {
  title: "OpenMusic: Your music. Every screen.",
  description: "A free, ad-free music player for Android and Windows.",
  icons: { icon: "/shots/logo.png" },
};

export const viewport = { themeColor: "#000000", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${instrumentSans.variable} ${instrumentSerif.variable}`}>
      <body>
        <div className="atmosphere flex min-h-screen flex-col">
          <Nav />
          <div className="flex-1">{children}</div>
          <Footer />
        </div>
      </body>
    </html>
  );
}
