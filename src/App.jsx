import { Routes, Route } from "react-router-dom";
import Header from "./components/Header.jsx";
import DemoControls from "./components/DemoControls.jsx";
import ClassesPage from "./pages/ClassesPage.jsx";
import ClassDetailsPage from "./pages/ClassDetailsPage.jsx";
import PlanPage from "./pages/PlanPage.jsx";
import ConfirmationPage from "./pages/ConfirmationPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

export default function App() {
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <Header />
      <main id="main" className="page">
        <Routes>
          <Route path="/" element={<ClassesPage />} />
          <Route path="/classes/:id" element={<ClassDetailsPage />} />
          <Route path="/plan" element={<PlanPage />} />
          <Route path="/confirmation" element={<ConfirmationPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <DemoControls />
    </>
  );
}
