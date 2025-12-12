import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { Villain } from './components/Villain'
import { Manifesto } from './components/Manifesto'
import { Features } from './components/Features'
import { FounderStory } from './components/FounderStory'
import { Footer } from './components/Footer'
import { DynamicShowcase } from './pages/DynamicShowcase'
import { EmailValidationPending } from './pages/email_validations/Pending'
import { EmailValidationConfirming } from './pages/email_validations/Confirming'
import { MeetingsNew } from './pages/meetings/New'

function LandingPage() {
  return (
    <div className="min-h-screen bg-bg-base overflow-x-hidden">
      <Navbar />
      <main>
        <Hero />
        <Villain />
        <Manifesto />
        <Features />
        <FounderStory />
      </main>
      <Footer />
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/demo/structure" element={<DynamicShowcase />} />
        <Route path="/email_validations/pending" element={<EmailValidationPending />} />
        <Route path="/email_validations/confirming" element={<EmailValidationConfirming />} />
        <Route path="/meetings/new" element={<MeetingsNew />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
