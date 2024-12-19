import './App.css'
import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import { MainView } from './components/MainView'

import { Header } from './components/Header'
import { Home } from './components/Home'
import { Footer } from './components/Footer'
import { Month } from './components/Month'
import { Login } from './components/Login'
import { Register } from './components/Register'

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'))

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    }
  }, [token]);
  

  return (
    <div id='app-function'>
      <Header/>
        <Routes>    
          <Route path='/' element={<MainView token={token}/>}>
            <Route index element={<Home/>}/>
            <Route path="month/:month" element={<Month />} />
          </Route>
          <Route path='/register' element={<Register/> }/>
          <Route path='/login' element={<Login token={token} setToken={setToken}/> }/>
        </Routes>
      <Footer/>
    </div>
  )
}

export default App
