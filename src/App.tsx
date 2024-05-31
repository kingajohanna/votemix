import { useRoutes } from "react-router-dom";
import { initializeApp } from "firebase/app";
import { Protection } from "./pages/Protection";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Login from "./pages/Login";
import { Welcome } from "./pages/Welcome";
import { EuropeanParliament } from "./pages/EuropeanParliament";
import { Mayor } from "./pages/Major";
import { Twelve } from "./pages/Twelve";
import { Nine } from "./pages/Nine";
import { BudapestList } from "./pages/BudapestList";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export default function App() {
  const routes = useRoutes([
    {
      path: "/",
      element: <Protection />,
    },
    {
      path: "/login",
      element: (
        <ProtectedRoute>
          <Login />
        </ProtectedRoute>
      ),
    },
    {
      path: "/welcome",
      element: (
        <ProtectedRoute>
          <Welcome />
        </ProtectedRoute>
      ),
    },
    {
      path: "/european-parliament",
      element: (
        <ProtectedRoute>
          <EuropeanParliament />
        </ProtectedRoute>
      ),
    },
    {
      path: "/mayor",
      element: (
        <ProtectedRoute>
          <Mayor />
        </ProtectedRoute>
      ),
    },
    {
      path: "/12-district",
      element: (
        <ProtectedRoute>
          <Twelve />
        </ProtectedRoute>
      ),
    },
    {
      path: "/9-district",
      element: (
        <ProtectedRoute>
          <Nine />
        </ProtectedRoute>
      ),
    },
    {
      path: "/budapest-list",
      element: (
        <ProtectedRoute>
          <BudapestList />
        </ProtectedRoute>
      ),
    },
  ]);
  return routes;
}
