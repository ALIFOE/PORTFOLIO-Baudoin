/**
 * Couche "motion" : remplace les plugins jQuery du template Devix
 * (WOW.js, counterUp, SplitText, ScrollSmoother) par des directives Vue
 * qui se nettoient correctement à chaque changement de page.
 */
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollSmoother } from 'gsap/ScrollSmoother'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText)
gsap.config({ nullTargetWarn: false })

export { gsap, ScrollTrigger, ScrollSmoother, SplitText }

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* ------------------------------------------------------------------
 * "App prête" : les animations d'entrée attendent la fin du préchargeur
 * ------------------------------------------------------------------ */
let resolveReady
export const appReady = new Promise((r) => (resolveReady = r))
export const markAppReady = () => resolveReady()

/* ------------------------------------------------------------------
 * ScrollSmoother (défilement fluide du template)
 * ------------------------------------------------------------------ */
let smoother = null

export function createSmoother() {
  if (prefersReducedMotion() || smoother) return smoother
  smoother = ScrollSmoother.create({
    wrapper: '#smooth-wrapper',
    content: '#smooth-content',
    smooth: 1.4,
    effects: false,
    smoothTouch: 0.1,
    normalizeScroll: false,
    ignoreMobileResize: true,
  })
  return smoother
}

export const getSmoother = () => smoother

export function scrollToTop(animated = true) {
  if (smoother) smoother.scrollTo(0, animated)
  else window.scrollTo({ top: 0, behavior: animated ? 'smooth' : 'auto' })
}

export function scrollToElement(el) {
  if (!el) return
  if (smoother) smoother.scrollTo(el, true, 'top 100px')
  else el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

let refreshTimer
export function refreshScroll() {
  clearTimeout(refreshTimer)
  refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 120)
}

/* ------------------------------------------------------------------
 * v-anim : apparition au scroll (remplace WOW.js + animate.css)
 *   v-anim                 → fadeInUp
 *   v-anim="'.3s'"         → fadeInUp avec délai
 *   v-anim:fadeInLeft="'.5s'"
 * ------------------------------------------------------------------ */
let revealObserver
function getRevealObserver() {
  if (revealObserver) return revealObserver
  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        const el = entry.target
        revealObserver.unobserve(el)
        appReady.then(() => reveal(el))
      })
    },
    { rootMargin: '0px 0px -40px 0px', threshold: 0.05 },
  )
  return revealObserver
}

function reveal(el) {
  const { name, delay } = el.__anim || {}
  el.style.visibility = 'visible'
  if (delay) el.style.animationDelay = delay
  el.classList.add('animated', name)
}

export const vAnim = {
  mounted(el, binding) {
    const delay = binding.value == null ? '' : String(binding.value)
    el.__anim = { name: binding.arg || 'fadeInUp', delay: /^\d*\.?\d+$/.test(delay) ? `${delay}s` : delay }
    if (prefersReducedMotion()) return
    el.style.visibility = 'hidden'
    getRevealObserver().observe(el)
  },
  unmounted(el) {
    revealObserver?.unobserve(el)
  },
}

/* ------------------------------------------------------------------
 * v-split : animation lettre par lettre des titres (.split-title)
 * ------------------------------------------------------------------ */
export const vSplit = {
  mounted(el) {
    el.classList.add('split-title')
    if (prefersReducedMotion()) {
      el.classList.add('split-done')
      return
    }
    const state = (el.__split = { alive: true })
    Promise.all([appReady, document.fonts?.ready]).then(() => {
      if (!state.alive) return
      state.split = new SplitText(el, { type: 'words,chars' })
      state.split.chars.forEach((c) => c.classList.add('char'))
      state.tween = gsap.to(state.split.chars, {
        scrollTrigger: { trigger: el, start: 'top 92%', toggleActions: 'play none none none' },
        duration: 0.8,
        clipPath: 'inset(0% 0% -15% 0%)',
        x: 0,
        opacity: 1,
        ease: 'power4.out',
        stagger: 0.025,
      })
    })
  },
  unmounted(el) {
    const state = el.__split
    if (!state) return
    state.alive = false
    state.tween?.scrollTrigger?.kill()
    state.tween?.kill()
  },
}

/* ------------------------------------------------------------------
 * v-count : compteur animé (remplace counterUp)
 *   <span v-count="25">0</span>
 * ------------------------------------------------------------------ */
export const vCount = {
  mounted(el, binding) {
    const target = Number(binding.value) || 0
    if (prefersReducedMotion()) {
      el.textContent = String(target)
      return
    }
    el.textContent = '0'
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return
        io.disconnect()
        appReady.then(() => {
          const obj = { v: 0 }
          el.__countTween = gsap.to(obj, {
            v: target,
            duration: 2.2,
            ease: 'power2.out',
            onUpdate: () => (el.textContent = String(Math.round(obj.v))),
          })
        })
      },
      { threshold: 0.4 },
    )
    io.observe(el)
    el.__countIo = io
  },
  unmounted(el) {
    el.__countIo?.disconnect()
    el.__countTween?.kill()
  },
}

export default {
  install(app) {
    app.directive('anim', vAnim)
    app.directive('split', vSplit)
    app.directive('count', vCount)
  },
}
