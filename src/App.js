import './App.css';
import Homepage from "./components/pages/Homepage"
import AdminPanel from "./components/pages/AdminPanel"
import ClientPanel from "./components/pages/ClientPanel"
import NotFound from "./components/pages/NotFound";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/dashboard" element={<ClientPanel />} />
        <Route path="*" element={<NotFound />} /> {/* Trang 404 */}
      </Routes>
    </Router>
  );
}

export default App;
