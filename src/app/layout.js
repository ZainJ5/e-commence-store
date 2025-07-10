// "use client"

import { Inter } from 'next/font/google';
// import { ThemeProvider, createTheme } from '@mui/material/styles';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

// const theme = createTheme({
//   typography: {
//     fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
//   },
//   palette: {
//     primary: {
//       main: '#f0e6d2',
//     },
//   },
// });

export const metadata = {
  title: 'ShahBazar - Premium Fashion Store',
  description: 'Elevate your style with premium fashion pieces. Where luxury meets accessibility.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* <ThemeProvider theme={theme}> */}
          {children}
        {/* </ThemeProvider> */}
      </body>
    </html>
  );
}