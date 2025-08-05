import {  Routes, Route } from 'react-router-dom';
import AHome from './pages/AHome';
import LoginForm from './components/LoginForm';
import AllPlayers from './pages/AllPlayers';
import PlaceBet from './pages/PlaceBet';
import AAcount from './pages/AAcount';
import Header from './components/Header';
import ApaymentHistory from './pages/ApaymentHistory';
import AAbout from './pages/AAbout';

function App() {
  return (
    <>

    <Header />
   
      <Routes>
        <Route path="/" element={<AHome />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/users" element={<AllPlayers/>} />
        <Route path="/about" element={<AAbout/>} />
        <Route path="/bet" element={<PlaceBet/>} />
        <Route path="/account" element={<AAcount/>} />
        <Route path="/paymenthistory" element={<ApaymentHistory/>} />
        <Route path="/bethistory" element={<AAcount/>} />
      </Routes>
    </>
  );
}

export default App;
