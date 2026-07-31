'use client'

import { useState, useEffect, useRef } from 'react'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Gallery from '@/components/Gallery'
import MenuSection from '@/components/Menu'
import CakeDesigner3D from '@/components/CakeDesigner3D'
import Contact from '@/components/Contact'

export default function Home() {
  const [activeSection, setActiveSection] = useState('home')
  const sectionRefs = {
    home: useRef(null), about: useRef(null), gallery: useRef(null),
    menu: useRef(null), designer: useRef(null), contact: useRef(null),
  }

  useEffect(() => {
    const hash = window.location.hash?.replace('#', '')
    if (hash) {
      setTimeout(() => {
        const el = document.getElementById(hash)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    }
  }, [])

  useEffect(() => {
    const onScroll = () => {
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

  return (
    <>
      <section id="home" ref={sectionRefs.home}><Hero /></section>
      <section id="about" ref={sectionRefs.about}><About /></section>
      <section id="gallery" ref={sectionRefs.gallery}><Gallery /></section>
      <section id="menu" ref={sectionRefs.menu}><MenuSection /></section>
      <section id="designer" ref={sectionRefs.designer}><CakeDesigner3D /></section>
      <section id="contact" ref={sectionRefs.contact}><Contact /></section>
    </>
  )
}
