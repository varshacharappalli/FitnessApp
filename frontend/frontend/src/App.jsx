import {Routes, Route, Navigate} from 'react-router-dom';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import CreateProfile from './pages/createProfile';
import CreateGoal from './pages/CreateGoal';
import CreateActivity from './pages/CreateActivity';
import ViewGoals from './pages/ViewGoals';
import ViewActivities from './pages/ViewActivities';
import Dashboard from './pages/Dashboard';

function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/signUp' element={<SignUp/>}/>
        <Route path='/signIn' element={<SignIn/>}/>
        <Route path='/createProfile' element={<CreateProfile/>}/>
        <Route path='/create-goal' element={<CreateGoal/>}/>
        <Route path='/createGoal' element={<CreateGoal/>}/>
        <Route path="/create-activity/:goalId" element={<CreateActivity />} />
        <Route path='/viewGoals' element={<ViewGoals/>}/>
        <Route path='/view-activities' element={<ViewActivities/>}/>
        <Route path='/view-activities/:goalId' element={<ViewActivities/>}/>
        <Route path='/dashboard' element={<Dashboard/>}/>
      </Routes>
    </>
  )
}

export default App