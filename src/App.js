
import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import Home from "./Pages/Home/Home";
import Details from "./Pages/Details/Details";
import Error from "./Pages/Error/Error";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function App() {
  return (
    
    <Router>
      <ToastContainer/>
      <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/details" element={<Details />} />
      <Route path="*" element={<Error />} />
      </Routes>
    </Router>
  );
}

export default App;
