// All photos by Matt Perry https://citizenofnowhe.re
import "./index.css";
import * as React from "react";
import { AnimatePresence } from "framer-motion";
import { useLocation, useRoutes } from "react-router-dom";
import ErrorPage from "./pages/error";
import PrivacyPolicy from "./pages/privacypage";
import Index from "./pages";

export default function App() {
  const element = useRoutes([
    {
      path: "/",
      element: <Index />,
      errorElement: <ErrorPage />,
    },
    {
      path: "privacy",
      element: <PrivacyPolicy />,
    },
  ]);

  const location = useLocation();

  if (!element) return null;

  return (
    <AnimatePresence mode="wait" initial={false}>
      {React.cloneElement(element, { key: location.pathname })}
    </AnimatePresence>
  );
}
