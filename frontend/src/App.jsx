import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import "./App.css";
import { MainContextProvider } from "./context/mainContext";
import { ToastContainer } from "react-toastify";
import RouterPage from "./components/routes";

function App() {
  return (
    <>
      <Router>
        <MainContextProvider>
          <ToastContainer />
          <RouterPage />
        </MainContextProvider>
      </Router>
    </>
  );
}

export default App;
