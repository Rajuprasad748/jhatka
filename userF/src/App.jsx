import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UHome from "./pages/UHome";
import UserSignUp from "./components/UserSignUp";
import UserLogin from "./components/UserLogin";
import Header from "./components/Header";
// import Wallet from './pages/Wallet';
import AddMoney from "./pages/AddMoney";
import WithdrawAmount from "./pages/WithdrawAmount";
import PlaceBetForm from "./pages/PlaceBetForm";
import History from "./pages/History";

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
          <Route path="/" element={<UHome />} />
          <Route path="/auth" element={<UserLogin />} />
          <Route path="/signup" element={<UserSignUp />} />
          <Route path="/login" element={<UserLogin />} />
          {/* <Route path="/wallet" element={<Wallet />} /> */}
          <Route path="/add-money" element={<AddMoney />} />
          <Route path="/withdraw" element={<WithdrawAmount />} />
          <Route path="/place-bet" element={<PlaceBetForm />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
