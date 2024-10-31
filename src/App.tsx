import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FileManager from './components/Files/FileManager';
import ViewFile from './components/ViewFile';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<FileManager />} />
          <Route path="/view/:fileName" element={<ViewFile />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
