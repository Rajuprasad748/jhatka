import {  Routes, Route } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import AllPlayers from './pages/AllPlayers';
import PlaceBet from './pages/PlaceBet';
import AddToken from './components/AddToken';
import Header from './components/Header';
import ABetHistory from './pages/ABetHistory';
import RemoveToken from './components/RemoveToken';
import UpdateTime from './pages/UpdateTime';
import AddTokenHistory from './pages/AddTokenHistory';
import RemoveTokenHistory from './pages/RemoveTokenHistory';
import PrivateRoute from './context/PrivateRoutes';
import HideGames from './components/HideGames';
import AddGame from './components/AddGame';
import RemoveGame from './components/RemoveGame';
import ADashboard from './components/ADashboard';
import UpdateContactInfo from './components/UpdateContactInfo';
import UserBetHistory from './components/UserBetHistory';
import Account from './components/Account';
import QueryWriter from './pages/QueryWriter';
import UserBetRecord from './components/UserBetRecord';

function App() {
  return (
    <>

    <Header />
      <Routes>
        <Route path="/login" element={<LoginForm />} />
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<ADashboard />} />
        <Route path="/users" element={<AllPlayers/>} />
        <Route path="/removeToken" element={<RemoveToken/>} />
        <Route path="/bet" element={<PlaceBet/>} />
        <Route path="/addToken" element={<AddToken/>} />
        <Route path="/updateTime" element={<UpdateTime/>} />
        <Route path="/addTokenHistory" element={<AddTokenHistory/>} />
        <Route path="/removeTokenHistory" element={<RemoveTokenHistory/>} />
        <Route path="/betHistory" element={<ABetHistory/>} />
        <Route path="/hideGames" element={<HideGames/>} />
        <Route path="/addGame" element={<AddGame/>} />
        <Route path="/removeGame" element={<RemoveGame/>} />
        <Route path="/contactInfo" element={<UpdateContactInfo/>} />
        <Route path="/users/userBetDetails" element={<UserBetHistory/>} />
        <Route path="/accounts" element={<Account/>} />
        <Route path="/developer" element={<QueryWriter/>} />
        <Route path="/userBetRecord" element={<UserBetRecord/>} />
        </Route>
        <Route path="*" element={<div className='text-center mt-20'>404 | Page Not Found</div>} />
      </Routes>
    </>
  );
}

export default App;
