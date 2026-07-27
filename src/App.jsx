import React, { useState, useEffect, useRef } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Gallery from './components/Gallery'
import Menu from './components/Menu'
import CakeDesigner3D from './components/CakeDesigner3D'
import Contact from './components/Contact'
import Footer from './components/Footer'
import CookieBanner from './components/CookieBanner'
import './App.css'

export default function App() {
  const [activeSection, setActiveSection] = useState('home')
  const [scrolled, setScrolled] = useState(false)
  const sectionRefs = {
    home: useRef(null), about: useRef(null), gallery: useRef(null),
    menu: useRef(null), designer: useRef(null), contact: useRef(null)
  }

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60)
      const scrollPos = window.scrollY + 200
      for (const [id, ref] of Object.entries(sectionRefs)) {
        if (ref.current && scrollPos >= ref.current.offsetTop && scrollPos < ref.current.offsetTop + ref.current.offsetHeight) {
          setActiveSection(id)
          break
        }
      }
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="app">
      <Navbar activeSection={activeSection} scrolled={scrolled} scrollTo={scrollTo} />
      <section id="home" ref={sectionRefs.home}><Hero scrollTo={scrollTo} /></section>
      <section id="about" ref={sectionRefs.about}><About /></section>
      <section id="gallery" ref={sectionRefs.gallery}><Gallery /></section>
      <section id="menu" ref={sectionRefs.menu}><Menu /></section>
      <section id="designer" ref={sectionRefs.designer}><CakeDesigner3D /></section>
      <section id="contact" ref={sectionRefs.contact}><Contact /></section>
      <Footer scrollTo={scrollTo} />
      <CookieBanner />
    </div>
  )
}
