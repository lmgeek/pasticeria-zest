'use client'

import { useState, useEffect, useRef } from 'react'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Gallery from '@/components/Gallery'
import MenuSection from '@/components/Menu'
import CakeDesigner3D from '@/components/CakeDesigner3D'
import Contact from '@/components/Contact'
import UnderConstruction from '@/components/UnderConstruction'
import { api } from '@/lib/api'

export default function Home() {
  const [activeSection, setActiveSection] = useState('home')
  const [underConstruction, setUnderConstruction] = useState(false)
  const sectionRefs = {
    home: useRef(null), about: useRef(null), gallery: useRef(null),
    menu: useRef(null), designer: useRef(null), contact: useRef(null),
  }

  useEffect(() => {
    api.get('/config/public')
      .then(({ data }) => setUnderConstruction(Boolean(data.underConstruction)))
      .catch(() => setUnderConstruction(false))
  }, [])

  useEffect(() => {
    if (underConstruction) return
    const hash = window.location.hash?.replace('#', '')
    if (hash) {
      setTimeout(() => {
        const el = document.getElementById(hash)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    }
  }, [underConstruction])

  useEffect(() => {
    if (underConstruction) return
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
  }, [underConstruction])

  if (underConstruction) return <UnderConstruction />

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
