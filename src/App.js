import "./css/styles.css"
import SubmitForm from './SubmitForm';
import { BrowserRouter , Route, Routes } from 'react-router-dom';

function App() {
  return (
    <div className="form-container">
      <BrowserRouter>

        <Routes>
          <Route exact path="/" element={<SubmitForm isNewUser={true}/>} />
          <Route exact path="/verify" element={<SubmitForm isNewUser={false}/> } />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
