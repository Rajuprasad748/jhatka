import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import UHome from "./pages/UHome";
import UserSignUp from "./components/UserSignUp";
import UserLogin from "./components/UserLogin";
import Header from "./components/Header";
import BetHistory from "./components/BetHistory";
import PlaceBetForm from "./pages/PlaceBetForm";
import ShowBetDigitsHistory from "./pages/ShowBetDigitsHistory";
import GameRates from "./components/GameRates";
import PrivateRoute from "./context/PrivateRoute";
import UAddMoney from "./components/UAddMoney";
import UWithdrawTokens from "./components/UWithdrawTokens";
import UserCard from "./components/UserCard";
import TokenHistory from "./components/TokenHistory";
import CustomerSupport from "./components/CustomerSupport";
import PersonalGame from "./components/PersonalGame";

function App() {

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={true}
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
            <Route path="/gameRates" element={<GameRates />} />
            <Route path="/history" element={<History />} />
            <Route path="/customerSupport" element={<CustomerSupport />} />

            {/* Protected Routes */}
            <Route element={<PrivateRoute />}>
              <Route
                path="/showBetDigitsHistory"
                element={<ShowBetDigitsHistory />}
              />
              <Route path="/betHistory" element={<BetHistory />} />
              <Route path="/addTokens" element={<UAddMoney />} />
              <Route path="/withdrawTokens" element={<UWithdrawTokens />} />
              <Route path="/tokenHistory" element={<TokenHistory />} />
              <Route path="/personalGame" element={<PersonalGame />} />
              <Route path="/userProfile" element={<UserCard />} />
              <Route path="/game/:name" element={<PlaceBetForm />} />
            </Route>

            {/* 404 Fallback */}
            <Route
              path="*"
              element={
                <div className="text-center mt-20">404 | Page Not Found</div>
              }
            />
          </Routes>
        </div>
    </>
  );
}

export default App;
