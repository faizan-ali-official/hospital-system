import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import "./App.css";
import { MainContextProvider, useMainContext } from "./context/mainContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RouterPage from "./components/routes";

function AppContent() {
  const { theme } = useMainContext();
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme={theme === "dark" ? "dark" : "light"}
      />
      <RouterPage />
    </>
  );
}

function App() {
  return (
    <>
      <Router>
        <MainContextProvider>
          <AppContent />
        </MainContextProvider>
      </Router>
    </>
  );
}

export default App;
