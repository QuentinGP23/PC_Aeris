import { Routes, Route } from 'react-router-dom'
import Test from './pages/Test'
import { SignIn, SignUp } from './pages/admin/authentification'

function App() {
  return (
    <Routes>
      <Route path="/" element={<div>Accueil PC Aeris</div>} />
      <Route path="/test" element={<Test />} />
      <Route path="/admin/authentification/signin" element={<SignIn />} />
      <Route path="/admin/authentification/signup" element={<SignUp />} />
    </Routes>
  )
}

export default App
