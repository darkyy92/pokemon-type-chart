import { Routes, Route } from 'react-router-dom';
import { Search } from './pages/Search';
import { TypeChart } from './pages/TypeChart';
import { Trainers } from './pages/Trainers';
import { BottomNav } from './components/BottomNav';

function App() {
  return (
    <>
      <div className="pb-16">
        <Routes>
          <Route path="/" element={<Search />} />
          <Route path="/types" element={<TypeChart />} />
          <Route path="/trainers" element={<Trainers />} />
        </Routes>
      </div>
      <BottomNav />
    </>
  );
}

export default App;
