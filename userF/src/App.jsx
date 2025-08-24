import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UHome from "./pages/UHome";
import UserSignUp from "./components/UserSignUp";
import UserLogin from "./components/UserLogin";
import Header from "./components/Header";
import AddMoney from "./pages/AddMoney";
import WithdrawAmount from "./pages/WithdrawAmount";
import PlaceBetForm from "./pages/PlaceBetForm";
import History from "./pages/History";
import GameRates from "./components/GameRates";
import PrivateRoute from "./context/PrivateRoute";

function App() {
  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={true} // ✅ Enables manual closing by mouse
        pauseOnFocusLoss={false}
        pauseOnHover={false}
        draggable={true}
        theme="colored"
      />

      <div className="flex flex-col min-h-screen max-w-screen overflow-hidden">
        <Header />

        <Routes>
  {/* Public Routes */}
  <Route path="/" element={<UHome />} />
  <Route path="/signup" element={<UserSignUp />} />
  <Route path="/login" element={<UserLogin />} />
  <Route path="/game-rates" element={<GameRates />} />

  {/* Protected Routes - only check once here */}
  <Route element={<PrivateRoute />}>
    <Route path="/add-money" element={<AddMoney />} />
    <Route path="/withdraw" element={<WithdrawAmount />} />
    <Route path="/place-bet" element={<PlaceBetForm />} />
    <Route path="/history" element={<History />} />
    <Route path="/game/:name" element={<PlaceBetForm />} />
  </Route>

  {/* 404 Fallback */}
  <Route
    path="*"
    element={<div className="text-center mt-20">404 | Page Not Found</div>}
  />
</Routes>
      </div>
    </>
  );
}

export default App;
