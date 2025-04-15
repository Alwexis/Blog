import { Routes, Route } from 'react-router-dom';

import SignUp from './views/SignUp.jsx';
import SignIn from './views/SignIn.jsx';
import Profile from './views/Profile.jsx';

function App() {
  return (
    <Routes>
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/sign-in" element={<SignIn />} />

      <Route path="/:username" element={<Profile />} />
    </Routes>
  )
}

export default App
