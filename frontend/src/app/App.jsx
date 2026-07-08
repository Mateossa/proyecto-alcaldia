
import { RouterProvider } from "react-router-dom";
import router from "./router/router"; // ojo con la ruta relativa

export default function App() {
  return <RouterProvider router={router} />;
}
