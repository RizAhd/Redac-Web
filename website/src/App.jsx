import { useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { startLenis, scrollToTop, ScrollTrigger } from './lib/motion.js';
import Nav from './components/Nav.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import Services from './pages/Services.jsx';
import Service from './pages/Service.jsx';
import About from './pages/About.jsx';
import Team from './pages/Team.jsx';
import Who from './pages/Who.jsx';
import Contact from './pages/Contact.jsx';
import Book from './pages/Book.jsx';
import Faq from './pages/Faq.jsx';
import Insights from './pages/Insights.jsx';
import Post from './pages/Post.jsx';
import { Privacy, Terms } from './pages/Legal.jsx';
import ThankYou from './pages/ThankYou.jsx';
import Credits from './pages/Credits.jsx';
import NotFound from './pages/NotFound.jsx';

const TITLES = {
  '/': 'Tax and accounting for people and businesses',
};

function RouteEffects() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    scrollToTop();
    const name = pathname === '/' ? TITLES['/'] : pathname.split('/').filter(Boolean).pop().replace(/-/g, ' ');
    document.title = `${name.charAt(0).toUpperCase() + name.slice(1)} | REDAC & Associates`;
    // let new sections measure themselves before triggers refresh
    const t = setTimeout(() => ScrollTrigger.refresh(), 120);
    return () => clearTimeout(t);
  }, [pathname, hash]);
  return null;
}

export default function App() {
  useEffect(() => { startLenis(); }, []);
  return (
    <HashRouter>
      <RouteEffects />
      <a className="skip" href="#main">Skip to content</a>
      <Nav />
      <main id="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:slug" element={<Service />} />
          <Route path="/about" element={<About />} />
          <Route path="/team" element={<Team />} />
          <Route path="/who-we-help" element={<Who />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/book" element={<Book />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/insights/:slug" element={<Post />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/thank-you" element={<ThankYou />} />
          <Route path="/credits" element={<Credits />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </HashRouter>
  );
}
