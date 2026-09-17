'use client'

import Image from 'next/image'
import dynamic from 'next/dynamic'
import { Component, useEffect, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, motion, MotionConfig, useReducedMotion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { ArrowDown, ArrowDownRight, ArrowRight, ArrowUpRight, Box, Check, ChevronDown, Cpu, Gamepad2, Menu, Monitor, Mouse, Users, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { BookingDialog } from '@/components/booking-dialog'

const RigPreview = dynamic(() => import('@/components/rig-preview'), {
  ssr: false,
  loading: () => <div className="preview-loading">Загружаем 3D-модель…</div>,
})

const zones = [
  { id: 'arena', name: 'ARENA', label: 'В центре игры', number: '01', price: 150, image: 'photo-1542751371-adc38448a05e', description: 'Общий зал, энергия команды и тот самый звук победы. Твоя точка входа в игру.', features: ['240 Гц · Full HD', 'Механическая клавиатура', 'Для соло и игры с друзьями'], icon: Monitor },
  { id: 'bootcamp', name: 'BOOTCAMP', label: 'Только твой состав', number: '02', price: 250, image: 'photo-1593305841991-05c297ba4575', description: 'Отдельная зона для сквадов. Соберите состав, закройте дверь и отработайте каждый раунд.', features: ['360 Гц · Full HD', 'Турнирная периферия', 'Командная зона'], icon: Users },
  { id: 'duo', name: 'DUO ROOM', label: 'На одной волне', number: '03', price: 350, image: 'photo-1593305841991-05c297ba4575', description: 'Ваш маленький мир на двоих. Кооператив, любимые игры и ничего лишнего.', features: ['240 Гц · QHD', 'Два игровых места', 'Приватная комната'], icon: Gamepad2 },
]

function photo(id: string, width = 1400) {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85&sat=-100`
}

class PreviewBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() {
    return this.state.failed ? <p className="preview-loading">3D недоступно в этом браузере. Характеристики доступны в карточках зон.</p> : this.props.children
  }
}

export default function Home() {
  const root = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  const [bookingOpen, setBookingOpen] = useState(false)
  const [selectedZone, setSelectedZone] = useState('arena')
  const [menuOpen, setMenuOpen] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)

  function book(zone = 'arena') {
    setSelectedZone(zone)
    setMenuOpen(false)
    setBookingOpen(true)
  }

  useEffect(() => {
    if (reduceMotion) return
    gsap.registerPlugin(ScrollTrigger)
    const lenis = new Lenis({ duration: 1.05, anchors: { offset: -90 } })
    let frame = 0
    function tick(time: number) {
      lenis.raf(time)
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    lenis.on('scroll', ScrollTrigger.update)
    const context = gsap.context(() => {
      gsap.fromTo('.hero-photo', { scale: 1.055 }, { scale: 1, duration: 1.8, ease: 'power2.out' })
      gsap.to('.marquee-line', {
        xPercent: -18,
        ease: 'none',
        scrollTrigger: { trigger: '.statement', start: 'top bottom', end: 'bottom top', scrub: 1 },
      })
    }, root)
    return () => {
      cancelAnimationFrame(frame)
      lenis.destroy()
      context.revert()
    }
  }, [reduceMotion])

  useEffect(() => {
    if (!menuOpen) return
    const close = (event: KeyboardEvent) => { if (event.key === 'Escape') setMenuOpen(false) }
    document.addEventListener('keydown', close)
    return () => document.removeEventListener('keydown', close)
  }, [menuOpen])

  return (
    <MotionConfig reducedMotion="user">
      <div ref={root}>
        <a href="#main" className="skip-link">Перейти к содержимому</a>
        <header className="site-header">
          <a href="#" className="brand" aria-label="CTRL CLUB — на главную">CTRL<span className="brand-symbol">↗</span><small>COMPUTER<br />CLUB</small></a>
          <nav className="desktop-nav" aria-label="Основная навигация">
            <a href="#atmosphere">Атмосфера</a>
            <a href="#zones">Игровые зоны</a>
            <a href="#zones">Тарифы</a>
          </nav>
          <div className="nav-actions">
            <span className="nav-caption">ТВОЙ НОВЫЙ РЕСПАУН</span>
            <Button variant="outline" onClick={() => book()} className="nav-book">Забронировать <ArrowUpRight /></Button>
            <Button variant="ghost" size="icon" className="mobile-toggle" aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'} aria-expanded={menuOpen} aria-controls="mobile-nav" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</Button>
          </div>
          <AnimatePresence>
            {menuOpen && <motion.nav id="mobile-nav" aria-label="Мобильная навигация" className="mobile-nav" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
              <a href="#atmosphere" onClick={() => setMenuOpen(false)}>Атмосфера <ArrowUpRight /></a>
              <a href="#zones" onClick={() => setMenuOpen(false)}>Зоны и тарифы <ArrowUpRight /></a>
              <Button onClick={() => book()}>Забронировать место <ArrowRight /></Button>
            </motion.nav>}
          </AnimatePresence>
        </header>

        <main id="main">
          <section className="hero" aria-labelledby="hero-title">
            <div className="hero-image-wrap"><Image className="hero-photo" src={photo('photo-1542751371-adc38448a05e', 2400)} alt="Киберспортивная арена: игровые станции и большой экран в тёмном зале" fill priority unoptimized sizes="100vw" /></div>
            <div className="hero-topline"><span><span className="status-dot" /> COMPUTER CLUB / EST. 2026</span><span>OFFLINE SPACE. ONLINE GAME.</span></div>
            <div className="hero-content">
              <motion.div initial={reduceMotion ? false : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.12 }}>
                <p className="eyebrow hero-eyebrow">НЕ ПРОСТО КОМПЬЮТЕРНЫЙ КЛУБ</p>
                <h1 id="hero-title">ТВОЙ МИР.<br />ТВОИ <span className="outline-word">ПРАВИЛА.</span></h1>
                <div className="hero-bottom">
                  <div className="hero-copy"><p>Оставь повседневность за дверью.<br />Здесь только ты, твоя команда и игра.</p><Button size="lg" onClick={() => book()}>Занять своё место <ArrowUpRight /></Button></div>
                  <a href="#atmosphere" className="explore-link"><span>ПОЧУВСТВУЙ<br />АТМОСФЕРУ</span><ArrowDown size={24} strokeWidth={1.4} /></a>
                </div>
              </motion.div>
            </div>
            <div className="hero-index"><span>01 / ВХОД В ИГРУ</span><span>SCROLL TO EXPLORE <ArrowDownRight size={14} /></span></div>
          </section>

          <div className="spec-strip" aria-label="Концепция клуба">
            <span><Monitor /> МОНИТОРЫ ДО 360 ГЦ</span><span><Cpu /> ЖЕЛЕЗО ДЛЯ ПОБЕД</span><span><Mouse /> ТОЧНОСТЬ В КАЖДОМ КЛИКЕ</span><span><Users /> СВОИ ЛЮДИ. СВОЯ ИГРА.</span>
          </div>

          <section className="statement" aria-labelledby="statement-title">
            <p className="eyebrow centered">[ МЕСТО, ГДЕ ТЕБЯ ПОНИМАЮТ ]</p>
            <h2 id="statement-title" className="statement-title">НЕ ПРОСТО ИГРАТЬ.<br />БЫТЬ В ИГРЕ.</h2>
            <div className="marquee-clip" aria-hidden="true"><div className="marquee-line">PLAY TOGETHER. STAY CONNECTED. PLAY TOGETHER.</div></div>
          </section>

          <section id="atmosphere" className="atmosphere" aria-labelledby="atmosphere-title">
            <div className="section-topline"><span>02 / АТМОСФЕРА</span><span>ТВОЁ МЕСТО СИЛЫ <ArrowDownRight size={16} /></span></div>
            <div className="atmosphere-scene">
              <Image src={photo('photo-1593305841991-05c297ba4575', 2000)} alt="Игроки за компьютерами в затемнённом игровом пространстве" fill unoptimized sizes="100vw" className="atmosphere-photo" />
              <div className="scene-caption"><span className="status-dot" /> REAL PEOPLE. REAL GAME.</div>
              <div className="floating-card">
                <div className="floating-card-top"><span>CTRL / ВНЕ ПОВСЕДНЕВНОСТИ</span><ArrowUpRight size={25} strokeWidth={1.3} /></div>
                <h2 id="atmosphere-title">ВЫКЛЮЧИ ШУМ.<br />ВКЛЮЧИ ИГРУ.</h2>
                <p>Приглушённый свет. Звук механики. Друзья на соседних местах. Та самая атмосфера, ради которой хочется выйти из дома.</p>
                <p>Приходи на один матч.<br />Оставайся ради своих.</p>
                <a href="#zones" className="card-link">Найти свою зону <ArrowRight size={20} /></a>
              </div>
            </div>
          </section>

          <section id="zones" className="zones-section" aria-labelledby="zones-title">
            <div className="section-topline"><span>03 / ИГРОВЫЕ ЗОНЫ</span><span>ВЫБЕРИ СВОЙ РЕЖИМ <ArrowDownRight size={16} /></span></div>
            <div className="zone-heading"><h2 id="zones-title">ТВОЯ ИГРА.<br />ТВОЯ ТЕРРИТОРИЯ.</h2><p>Соло, дуо или полный состав —<br />для каждого есть своё место.</p></div>
            <div className="zone-grid">
              {zones.map((zone) => <article className="zone-card" key={zone.id}>
                <div className="zone-image"><Image src={photo(zone.image, 800)} alt={`Атмосферный фотореференс зоны ${zone.name}`} fill unoptimized sizes="(max-width: 760px) 100vw, 33vw" /><span className="zone-number">/ {zone.number}</span><span className="zone-image-label"><zone.icon size={15} /> {zone.label}</span></div>
                <div className="zone-body"><div className="zone-title"><h3>{zone.name}</h3><span>от <strong>{zone.price}</strong> ₽/час</span></div><p>{zone.description}</p><ul>{zone.features.map((feature) => <li key={feature}><Check size={14} />{feature}</li>)}</ul><Button variant="outline" className="zone-button" onClick={() => book(zone.id)}>Выбрать зону <ArrowUpRight /></Button></div>
              </article>)}
            </div>
            <div className="zones-footnote"><span>Тарифы, комплектации и фотографии — демонстрационные.</span><button aria-expanded={previewOpen} aria-controls="rig-preview" onClick={() => setPreviewOpen(!previewOpen)}><Box size={17} /> {previewOpen ? 'Скрыть 3D-модель ПК' : 'Рассмотреть ПК в 3D'}<ChevronDown size={16} className={previewOpen ? 'rotated' : ''} /></button></div>
            {previewOpen && <div className="rig-panel" id="rig-preview"><div><p className="eyebrow">ЖЕЛЕЗО / ДЕТАЛИ</p><h3>ВСЁ ЛИШНЕЕ —<br />ЗА КАДРОМ.</h3><p>Интерактивный эскиз игрового ПК.<br />Не является точной моделью оборудования клуба.</p></div><PreviewBoundary><RigPreview reducedMotion={!!reduceMotion} /></PreviewBoundary></div>}
          </section>

          <section className="closing" aria-labelledby="closing-title"><p className="eyebrow">[ ТВОЯ КОМАНДА УЖЕ СОБИРАЕТСЯ ]</p><h2 id="closing-title">УВИДИМСЯ<br />В <span className="outline-word">ИГРЕ.</span></h2><Button size="lg" onClick={() => book()}>Забронировать место <ArrowUpRight /></Button><span className="closing-caption">CTRL CLUB. ТВОЙ НОВЫЙ РЕСПАУН.</span></section>
        </main>

        <footer className="site-footer"><div className="footer-top"><a className="brand" href="#" aria-label="CTRL CLUB — наверх">CTRL<span className="brand-symbol">↗</span><small>COMPUTER<br />CLUB</small></a><p>Меньше повседневности.<br />Больше игры.</p><nav aria-label="Навигация в подвале"><a href="#atmosphere">Атмосфера</a><a href="#zones">Зоны и тарифы</a><button onClick={() => book()}>Бронирование <ArrowUpRight size={14} /></button></nav></div><div className="footer-bottom"><span>© 2026 CTRL CLUB</span><span>Демо-концепт · Не является публичной офертой</span><a href="#">НАВЕРХ <ArrowUpRight size={13} /></a></div></footer>
        <BookingDialog open={bookingOpen} onOpenChange={setBookingOpen} initialZone={selectedZone} />
      </div>
    </MotionConfig>
  )
}
