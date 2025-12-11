import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { Villain } from './components/Villain'
import { Manifesto } from './components/Manifesto'
import { Features } from './components/Features'
import { FounderStory } from './components/FounderStory'
import { Footer } from './components/Footer'

function App() {
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

export default App
