import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import OpenviduDefault from './component/webrtc/OpenviduDefault'
import Header from './component/header/Header'
import Footer from './component/footer/Footer'

const App = () => {
  return (
    <div className='body'>
      <div className='headerWrap'>
        <Header/>
      </div>

      <div>
        <h1>메인 페이지 자리</h1>
        <BrowserRouter>

          <Routes>
            <Route path='/openvidu' element={<OpenviduDefault></OpenviduDefault>} />
          </Routes>

        </BrowserRouter>
      </div>

      <footer id='footerWrap'>
        <Footer />
      </footer>
    </div>
  )
}

export default App;