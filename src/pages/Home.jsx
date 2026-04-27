import Navbar from '../components/layout/Navbar'
import Hero from '../components/landing/Hero'
import Services from '../components/landing/Services'
import Aboutus from '../components/landing/About'
import Projects from "../components/landing/Projects";
import Footer from '../components/layout/Footer'

function Home() {
  return (
    <div>
      <Navbar />
      <Hero />
      <Aboutus />
      <Services />
      <Projects />
      {/* <Testimonials /> */}
      {/* <Contacts /> */}
      <Footer />
    </div>
  )
}

export default Home