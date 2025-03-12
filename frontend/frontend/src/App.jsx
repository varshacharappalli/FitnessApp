import {Routes, Route, Navigate} from 'react-router-dom';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import CreateProfile from './pages/createProfile';

function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/signUp' element={<SignUp/>}/>
        <Route path='/signIn' element={<SignIn/>}/>
        <Route path='/createProfile' element={<CreateProfile/>}/>
      </Routes>
    </>
  )
}

export default App
