
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Nav from './components/Nav.jsx'
import Login from './pages/Login.jsx'
import Editor from './pages/Editor.jsx'
import SignUp from './pages/SingUp.jsx'
import Browse from'./pages/Browse.jsx'
import Doc from './pages/Docs.jsx'
import {pdfjs} from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

function App() {
  return (
    
      <BrowserRouter>
        <Routes>
  
            <Route index element={<SignUp/>}/>
        <Route path='login' element={<Login/>}/>
        <Route path="search" element={<Browse/>}/>
        <Route path="documentation" element={<Doc/>}/>
        <Route path="document/:id" element={<Editor/>}/>
       
        </Routes>
     </BrowserRouter>
     

  )
}

export default App

