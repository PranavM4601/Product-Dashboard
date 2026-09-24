import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 dark:bg-gray-900">
        {children}
        <ToastContainer 
          position="bottom-right" 
          autoClose={3000} 
          theme="dark" 
          toastClassName="bg-gray-800 text-white rounded-xl shadow-lg border border-gray-700"
        />
      </body>
    </html>
  );
}