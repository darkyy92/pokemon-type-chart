import { Routes, Route } from 'react-router-dom';
import { Search } from './pages/Search';
import { PokemonDetail } from './pages/PokemonDetail';
import { TypeChart } from './pages/TypeChart';
import { BottomNav } from './components/BottomNav';

function App() {
  return (
    <>
      <div className="pb-16">
        <Routes>
          <Route path="/" element={<Search />} />
          <Route path="/pokemon/:name" element={<PokemonDetail />} />
          <Route path="/types" element={<TypeChart />} />
        </Routes>
      </div>
      <BottomNav />
    </>
  );
}

export default App;
