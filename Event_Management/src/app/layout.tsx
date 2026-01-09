import "./globals.css";
import Providers from "./provider";
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>

        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
