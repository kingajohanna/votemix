import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useEffect } from "react";

export const ProtectedRoute = ({ children }: any) => {
  const [authenticated, _] = useLocalStorage("authenticated");
  const navigate = useNavigate();

  useEffect(() => {
    if (!authenticated) {
      navigate("/", { replace: true });
    }
  }, []);

  return children;
};
