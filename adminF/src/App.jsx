import {  Routes, Route } from 'react-router-dom';
import AHome from './pages/AHome';
import LoginForm from './components/LoginForm';
import AllPlayers from './pages/AllPlayers';
import PlaceBet from './pages/PlaceBet';
import AddToken from './components/AddToken';
import Header from './components/Header';
import ApaymentHistory from './pages/ApaymentHistory';
import RemoveToken from './components/RemoveToken';
import UpdateTime from './pages/UpdateTime';
import AddTokenHistory from './pages/AddTokenHistory';
import RemoveTokenHistory from './pages/RemoveTokenHistory';

function App() {
  return (
    <>

    <Header />
   
      <Routes>
        <Route path="/" element={<AHome />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/users" element={<AllPlayers/>} />
        <Route path="/removeToken" element={<RemoveToken/>} />
        <Route path="/bet" element={<PlaceBet/>} />
        <Route path="/addToken" element={<AddToken/>} />
        <Route path="/paymenthistory" element={<ApaymentHistory/>} />
        <Route path="/updateTime" element={<UpdateTime/>} />
        <Route path="/addTokenHistory" element={<AddTokenHistory/>} />
        <Route path="/removeTokenHistory" element={<RemoveTokenHistory/>} />
      </Routes>
    </>
  );
}

export default App;
