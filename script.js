/* ═══════════════════════════════════════════════════════════
   SHAZIN'S EID SURPRISE — Cinematic Experience Script
   WebGL 3D Particles, Shooting Stars, Section Bursts,
   3D Tilt, Constellation, Custom Sparkle Bursts
   ═══════════════════════════════════════════════════════════ */

(function () {
  "use strict";

  // ─── DOM REFERENCES ───
  const introOverlay  = document.getElementById("intro-overlay");
  const introCanvas   = document.getElementById("intro-canvas");
  const introMoon     = document.getElementById("intro-moon");
  const introText     = document.getElementById("intro-text");
  const enterBtn      = document.getElementById("enter-btn");
  const mainSite      = document.getElementById("main-site");
  const trailCanvas   = document.getElementById("trail-canvas");
  const bgMusic       = document.getElementById("bg-music");
  const musicToggle   = document.getElementById("music-toggle");
  const musicIcon     = document.getElementById("music-icon");
  const openBlessingsBtn = document.getElementById("open-blessings-btn");
  const extraBlessings   = document.getElementById("extra-blessings");
  const typewriterEl     = document.getElementById("typewriter-text");

  let musicPlaying = false;

  // ─── UTILITY ───
  function rand(min, max) { return Math.random() * (max - min) + min; }

  /* ═══════════════════════════════════════════
     PROGRAMMATIC TWINKLING STAR FIELD (Intro)
     ═══════════════════════════════════════════ */
  function createIntroStars() {
    const container = document.getElementById("intro-stars");
    if (!container) return;
    const count = Math.min(80, Math.floor(window.innerWidth * 0.05));
    for (let i = 0; i < count; i++) {
      const star = document.createElement("div");
      star.className = "intro-star";
      star.style.left = rand(0, 100) + "%";
      star.style.top = rand(0, 100) + "%";
      star.style.width = star.style.height = rand(1.5, 4) + "px";
      star.style.opacity = rand(0.2, 0.7);
      star.style.animation = `twinkle ${rand(2, 5)}s ${rand(0, 3)}s ease-in-out infinite alternate`;
      container.appendChild(star);
    }
  }

  /* ═══════════════════════════════════════════
     SHOOTING STARS
     ═══════════════════════════════════════════ */
  function createShootingStar(container) {
    if (!container) return;
    const star = document.createElement("div");
    star.className = "shooting-star";
    star.style.top = rand(5, 50) + "%";
    star.style.left = rand(-10, 70) + "%";
    const angle = rand(15, 35);
    star.style.transform = `rotate(${angle}deg)`;
    star.style.width = rand(80, 180) + "px";
    container.appendChild(star);

    gsap.fromTo(star, {
      opacity: 0,
      x: 0,
      y: 0
    }, {
      opacity: 1,
      x: rand(300, 600),
      y: rand(100, 300),
      duration: rand(0.8, 1.5),
      ease: "power2.in",
      onComplete: () => {
        gsap.to(star, {
          opacity: 0,
          duration: 0.3,
          onComplete: () => star.remove()
        });
      }
    });
  }

  // Recurring shooting stars
  let shootingStarInterval;
  function startShootingStars(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    shootingStarInterval = setInterval(() => {
      createShootingStar(container);
    }, rand(3000, 7000));
    // Fire one immediately
    setTimeout(() => createShootingStar(container), 1500);
  }

  /* ═══════════════════════════════════════════
     FOOTER CONSTELLATION DOTS
     ═══════════════════════════════════════════ */
  function createConstellationDots() {
    const container = document.getElementById("footer-constellation");
    if (!container) return;
    const count = 20;
    for (let i = 0; i < count; i++) {
      const dot = document.createElement("div");
      dot.className = "constellation-dot";
      dot.style.left = rand(5, 95) + "%";
      dot.style.top = rand(5, 90) + "%";
      dot.style.opacity = rand(0.15, 0.5);
      dot.style.animation = `twinkle ${rand(2, 5)}s ${rand(0, 3)}s ease-in-out infinite alternate`;
      container.appendChild(dot);
    }
  }

  /* ═══════════════════════════════════════════
     INTRO PARTICLE CANVAS (2D Cinematic)
     ═══════════════════════════════════════════ */
  const ictx = introCanvas.getContext("2d");
  let introParticles = [];
  let introAnimId;

  function resizeIntroCanvas() {
    introCanvas.width = window.innerWidth;
    introCanvas.height = window.innerHeight;
  }

  class IntroParticle {
    constructor() { this.reset(); }
    reset() {
      this.x = rand(0, introCanvas.width);
      this.y = rand(0, introCanvas.height);
      this.size = rand(0.5, 2.5);
      this.speedY = rand(-0.35, -0.05);
      this.speedX = rand(-0.15, 0.15);
      this.opacity = rand(0.1, 0.6);
      this.flickerSpeed = rand(0.005, 0.02);
      this.flickerPhase = rand(0, Math.PI * 2);
      this.isGold = Math.random() > 0.5;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.flickerPhase += this.flickerSpeed;
      this.opacity = 0.2 + Math.sin(this.flickerPhase) * 0.4;
      if (this.y < -5 || this.x < -5 || this.x > introCanvas.width + 5) this.reset();
    }
    draw(ctx) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      const color = this.isGold ? `rgba(212,168,67,${this.opacity})` : `rgba(200,225,210,${this.opacity * 0.7})`;
      ctx.fillStyle = color;
      ctx.shadowColor = this.isGold ? "rgba(212,168,67,0.4)" : "rgba(200,225,210,0.2)";
      ctx.shadowBlur = this.isGold ? 8 : 4;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  function initIntroParticles() {
    resizeIntroCanvas();
    const count = Math.min(100, Math.floor(window.innerWidth * 0.08));
    introParticles = Array.from({ length: count }, () => new IntroParticle());
  }

  function animateIntro() {
    ictx.clearRect(0, 0, introCanvas.width, introCanvas.height);
    introParticles.forEach((p) => { p.update(); p.draw(ictx); });
    introAnimId = requestAnimationFrame(animateIntro);
  }

  /* ═══════════════════════════════════════════
     INTRO CINEMATIC SEQUENCE (GSAP)
     ═══════════════════════════════════════════ */
  function playIntroSequence() {
    const tl = gsap.timeline();

    // 0. Letterbox bars slide in
    tl.fromTo(".letterbox-top", { y: -60 }, { y: 0, duration: 1.2, ease: "power3.out" }, 0);
    tl.fromTo(".letterbox-bottom", { y: 60 }, { y: 0, duration: 1.2, ease: "power3.out" }, 0);

    // 1. Moon fades in with dramatic scale
    tl.to(introMoon, { opacity: 1, scale: 1, duration: 2.5, ease: "power2.out" }, 0.8);

    // 2. Elegant sways and fade of hanging lanterns
    tl.to(".lantern", {
      opacity: 0.85, duration: 1.8, stagger: 0.2, ease: "power2.out"
    }, 1.8);

    // 3. Narrative greeting
    tl.to(introText, { opacity: 1, y: 0, duration: 2, ease: "power3.out" }, 2.8);

    // 4. Enter button (with slight delay for drama)
    tl.to(enterBtn, { opacity: 1, y: 0, duration: 1.2, ease: "power2.out" }, 4);
  }

  /* ═══════════════════════════════════════════
     THREE.JS 3D BACKGROUND PARTICLE SYSTEM
     ═══════════════════════════════════════════ */
  let scene, camera, renderer, starSystem, fireflySystem;
  let starPositions, starSpeeds, starOffsets, fireflyPositions, fireflySpeeds, fireflyOffsets;
  let targetCamX = 0, targetCamY = 0;
  let targetScrollY = 0, currentScrollY = 0;

  function initThreeBg() {
    const container = document.getElementById("three-container");
    if (!container) return;

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 45;

    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const goldStarTexture = createGlowingDotTexture('#fbe49d', '#ffffff');
    const greenFireflyTexture = createGlowingDotTexture('#26df85', '#fffede');

    // Star Dust Layer
    const starCount = window.innerWidth < 768 ? 180 : 500;
    const starGeometry = new THREE.BufferGeometry();
    starPositions = new Float32Array(starCount * 3);
    starSpeeds = new Float32Array(starCount);
    starOffsets = new Float32Array(starCount);

    for (let i = 0; i < starCount; i++) {
      starPositions[i * 3]     = rand(-75, 75);
      starPositions[i * 3 + 1] = rand(-50, 50);
      starPositions[i * 3 + 2] = rand(-45, 25);
      starSpeeds[i]  = rand(0.012, 0.055);
      starOffsets[i]  = rand(0, Math.PI * 2);
    }
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));

    const starMaterial = new THREE.PointsMaterial({
      size: window.innerWidth < 768 ? 1.3 : 1.8,
      map: goldStarTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    starSystem = new THREE.Points(starGeometry, starMaterial);
    scene.add(starSystem);

    // Emerald Fireflies Layer
    const fireflyCount = window.innerWidth < 768 ? 40 : 100;
    const fireflyGeometry = new THREE.BufferGeometry();
    fireflyPositions = new Float32Array(fireflyCount * 3);
    fireflySpeeds = new Float32Array(fireflyCount);
    fireflyOffsets = new Float32Array(fireflyCount);

    for (let i = 0; i < fireflyCount; i++) {
      fireflyPositions[i * 3]     = rand(-55, 55);
      fireflyPositions[i * 3 + 1] = rand(-45, 45);
      fireflyPositions[i * 3 + 2] = rand(-30, 15);
      fireflySpeeds[i]  = rand(0.025, 0.08);
      fireflyOffsets[i]  = rand(0, Math.PI * 2);
    }
    fireflyGeometry.setAttribute('position', new THREE.BufferAttribute(fireflyPositions, 3));

    const fireflyMaterial = new THREE.PointsMaterial({
      size: window.innerWidth < 768 ? 3 : 4.5,
      map: greenFireflyTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    fireflySystem = new THREE.Points(fireflyGeometry, fireflyMaterial);
    scene.add(fireflySystem);

    window.addEventListener("resize", onThreeResize);
    document.addEventListener("mousemove", onThreeMouseMove);

    animateThreeBg();
  }

  function createGlowingDotTexture(colorHex, coreHex) {
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext("2d");
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, coreHex);
    gradient.addColorStop(0.15, colorHex);
    gradient.addColorStop(0.45, 'rgba(212, 168, 67, 0.4)');
    gradient.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(canvas);
  }

  function onThreeResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  function onThreeMouseMove(e) {
    const mx = (e.clientX / window.innerWidth) * 2 - 1;
    const my = -(e.clientY / window.innerHeight) * 2 + 1;
    targetCamX = mx * 8;
    targetCamY = my * 5;
  }

  let timeVal = 0;
  function animateThreeBg() {
    timeVal += 0.003;

    const starPos = starSystem.geometry.attributes.position.array;
    const starLen = starPositions.length / 3;
    for (let i = 0; i < starLen; i++) {
      starPos[i * 3 + 1] += starSpeeds[i];
      starPos[i * 3]     += Math.sin(timeVal + starOffsets[i]) * 0.01;
      if (starPos[i * 3 + 1] > 55) starPos[i * 3 + 1] = -55;
    }
    starSystem.geometry.attributes.position.needsUpdate = true;

    const fireflyPos = fireflySystem.geometry.attributes.position.array;
    const fireflyLen = fireflyPositions.length / 3;
    for (let i = 0; i < fireflyLen; i++) {
      fireflyPos[i * 3 + 1] += fireflySpeeds[i];
      fireflyPos[i * 3]     += Math.cos(timeVal + fireflyOffsets[i]) * 0.025;
      if (fireflyPos[i * 3 + 1] > 45) fireflyPos[i * 3 + 1] = -45;
    }
    fireflySystem.geometry.attributes.position.needsUpdate = true;

    // Smooth mouse parallax
    camera.position.x += (targetCamX - camera.position.x) * 0.035;
    camera.position.y += (targetCamY - camera.position.y) * 0.035;

    // Scroll parallax
    targetScrollY = window.scrollY * 0.06;
    currentScrollY += (targetScrollY - currentScrollY) * 0.05;
    starSystem.position.y = -currentScrollY;
    fireflySystem.position.y = -currentScrollY * 0.8;

    camera.lookAt(scene.position);
    renderer.render(scene, camera);
    requestAnimationFrame(animateThreeBg);
  }

  /* ═══════════════════════════════════════════
     CURSOR TRAIL (Gold + Emerald Glow Trails)
     ═══════════════════════════════════════════ */
  const tctx = trailCanvas.getContext("2d");
  let trailParts = [];

  function resizeTrailCanvas() {
    trailCanvas.width = window.innerWidth;
    trailCanvas.height = window.innerHeight;
  }

  class TrailParticle {
    constructor(x, y) {
      this.x = x; this.y = y;
      this.size = rand(1, 3.5);
      this.life = 1;
      this.decay = rand(0.014, 0.032);
      this.vx = rand(-0.7, 0.7);
      this.vy = rand(-0.7, 0.7);
      this.isGold = Math.random() > 0.35;
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      this.life -= this.decay;
      this.size *= 0.97;
    }
    draw(ctx) {
      if (this.life <= 0) return;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.isGold ? `rgba(212,168,67,${this.life * 0.6})` : `rgba(38,223,133,${this.life * 0.45})`;
      ctx.shadowColor = this.isGold ? "rgba(212,168,67,0.5)" : "rgba(38,223,133,0.35)";
      ctx.shadowBlur = 6;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  function animateTrail() {
    tctx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);
    trailParts = trailParts.filter((p) => p.life > 0);
    trailParts.forEach((p) => { p.update(); p.draw(tctx); });
    requestAnimationFrame(animateTrail);
  }

  let lastTrailTime = 0;
  document.addEventListener("mousemove", (e) => {
    const now = Date.now();
    if (now - lastTrailTime < 25) return;
    lastTrailTime = now;
    for (let i = 0; i < 3; i++) {
      trailParts.push(new TrailParticle(e.clientX, e.clientY));
    }
    if (trailParts.length > 180) trailParts.splice(0, 15);
  });

  /* ═══════════════════════════════════════════
     MAGICAL SVG CLICK SPARKLE BURSTS
     ═══════════════════════════════════════════ */
  function createSparkles(x, y, count) {
    for (let i = 0; i < count; i++) {
      const spark = document.createElement("div");
      spark.className = "click-sparkle-svg";
      spark.style.left = `${x}px`;
      spark.style.top = `${y}px`;
      const isGold = Math.random() > 0.3;
      spark.innerHTML = `
        <svg viewBox="0 0 40 40" style="width:100%;height:100%;">
          <path d="M20,0 L24,14 L38,20 L24,26 L20,40 L16,26 L2,20 L16,14 Z" fill="${isGold ? '#fbe49d' : '#26df85'}" />
        </svg>
      `;
      document.body.appendChild(spark);

      const angle = Math.random() * Math.PI * 2;
      const velocity = rand(35, 120);
      gsap.to(spark, {
        x: Math.cos(angle) * velocity,
        y: Math.sin(angle) * velocity,
        opacity: 0,
        scale: rand(0.4, 1.8),
        rotation: rand(-200, 200),
        duration: rand(0.7, 1.5),
        ease: "power2.out",
        onComplete: () => spark.remove()
      });
    }
  }

  // Sparkles on interactive elements
  document.addEventListener("click", (e) => {
    const el = e.target.closest(".lantern, .bg-lantern, .dua-card, .blessing-card");
    if (el) {
      createSparkles(e.clientX, e.clientY, 18);
    }
  });

  /* ═══════════════════════════════════════════
     SECTION ENTRANCE GOLDEN PARTICLE BURST
     ═══════════════════════════════════════════ */
  function createSectionBurst(triggerEl) {
    const rect = triggerEl.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    for (let i = 0; i < 12; i++) {
      const dot = document.createElement("div");
      dot.className = "section-burst-particle";
      const size = rand(3, 7);
      dot.style.width = size + "px";
      dot.style.height = size + "px";
      dot.style.left = cx + "px";
      dot.style.top = cy + "px";
      document.body.appendChild(dot);

      const angle = (Math.PI * 2 / 12) * i;
      const dist = rand(60, 140);
      gsap.to(dot, {
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist,
        opacity: 0,
        scale: 0.2,
        duration: rand(0.8, 1.3),
        ease: "power2.out",
        onComplete: () => dot.remove()
      });
    }
  }

  /* ═══════════════════════════════════════════
     INTERACTIVE 3D CARD TILT EFFECT
     ═══════════════════════════════════════════ */
  function initTiltEffect() {
    const cards = document.querySelectorAll(".glass-card");
    cards.forEach((card) => {
      // Skip if already initialized
      if (card.dataset.tiltInit) return;
      card.dataset.tiltInit = "true";

      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const tiltX = (rect.height / 2 - y) / 14;
        const tiltY = (x - rect.width / 2) / 14;

        gsap.to(card, {
          rotateX: tiltX,
          rotateY: tiltY,
          scale: 1.02,
          duration: 0.3,
          ease: "power2.out",
          transformPerspective: 1000
        });
      });

      card.addEventListener("mouseleave", () => {
        gsap.to(card, {
          rotateX: 0,
          rotateY: 0,
          scale: 1,
          duration: 0.5,
          ease: "power2.out",
          transformPerspective: 1000
        });
      });
    });
  }

  /* ═══════════════════════════════════════════
     HEARTFELT FAMILY MESSAGE TYPEWRITER
     ═══════════════════════════════════════════ */
  const familyMessage =
    "To my beloved family,\n\nMay this Eid bring peace, happiness, health, and endless blessings into our lives. Thank you for being my strength, love, and home.\n\nEid Mubarak with love, Shazin.";

  let typewriterStarted = false;

  function startTypewriter() {
    if (typewriterStarted) return;
    typewriterStarted = true;
    let index = 0;
    const cursor = document.createElement("span");
    cursor.className = "cursor-blink";
    typewriterEl.innerHTML = "";
    typewriterEl.appendChild(cursor);

    function type() {
      if (index < familyMessage.length) {
        const char = familyMessage[index];
        if (char === "\n") {
          cursor.before(document.createElement("br"));
        } else {
          cursor.before(document.createTextNode(char));
        }
        index++;
        setTimeout(type, char === "," || char === "." ? 95 : 32);
      } else {
        setTimeout(() => {
          cursor.remove();
          document.querySelector(".message-signature").classList.add("visible");
        }, 500);
      }
    }
    type();
  }

  /* ═══════════════════════════════════════════
     SCROLL PARALLAX & SECTION ANIMATIONS (GSAP)
     ═══════════════════════════════════════════ */
  function initScrollAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    // Parallax mosque silhouette
    gsap.to("#mosque-silhouette", {
      y: 60,
      ease: "none",
      scrollTrigger: { trigger: "#main-site", start: "top top", end: "bottom bottom", scrub: true }
    });

    // Dramatic hero slow-zoom
    gsap.to(".hero-content", {
      scale: 0.95,
      opacity: 0.6,
      ease: "none",
      scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: true }
    });

    // Hero content entrance
    const heroTl = gsap.timeline({
      scrollTrigger: { trigger: "#hero", start: "top 75%" }
    });
    heroTl.from(".hero-moon-decor", { opacity: 0, scale: 0.3, duration: 1.8, ease: "back.out(1.5)" })
      .from(".hero-bismillah", { opacity: 0, y: 25, duration: 1.2 }, "-=1.2")
      .from("#hero-title", { opacity: 0, y: 50, duration: 1.5 }, "-=0.9")
      .from("#hero-arabic", { opacity: 0, y: 35, duration: 1.4 }, "-=1.0")
      .from(".hero-divider", { opacity: 0, scaleX: 0, duration: 1.2 }, "-=0.8")
      .from(".hero-subtitle", { opacity: 0, y: 25, duration: 1.2 }, "-=0.8")
      .from(".hero-scroll-indicator", { opacity: 0, y: 15, duration: 0.8 }, "-=0.5");

    // Section dividers fade in
    gsap.utils.toArray(".section-divider").forEach((div) => {
      gsap.from(div, {
        opacity: 0, scaleX: 0, duration: 1.2,
        scrollTrigger: { trigger: div, start: "top 85%" }
      });
    });

    // Duas section with burst
    gsap.from("#duas-section .section-header", {
      opacity: 0, y: 50, duration: 1.2,
      scrollTrigger: {
        trigger: "#duas-section", start: "top 70%",
        onEnter: () => {
          const icon = document.querySelector("#duas-section .section-icon");
          if (icon) createSectionBurst(icon);
        }
      }
    });
    gsap.utils.toArray(".dua-card").forEach((card, idx) => {
      gsap.from(card, {
        opacity: 0, y: 70, rotateX: 10, duration: 1.1, delay: idx * 0.2,
        ease: "power3.out",
        scrollTrigger: { trigger: card, start: "top 82%" },
      });
    });

    // Family message with burst
    gsap.from("#family-message .section-header", {
      opacity: 0, y: 50, duration: 1.2,
      scrollTrigger: {
        trigger: "#family-message", start: "top 70%",
        onEnter: () => {
          const icon = document.querySelector("#family-message .section-icon");
          if (icon) createSectionBurst(icon);
        }
      }
    });
    gsap.from("#message-card", {
      opacity: 0, y: 60, scale: 0.92, duration: 1.5,
      ease: "power3.out",
      scrollTrigger: {
        trigger: "#message-card", start: "top 80%",
        onEnter: () => setTimeout(startTypewriter, 600),
      },
    });

    // Blessings section with burst
    gsap.from("#blessings-section .section-header", {
      opacity: 0, y: 50, duration: 1.2,
      scrollTrigger: {
        trigger: "#blessings-section", start: "top 70%",
        onEnter: () => {
          const icon = document.querySelector("#blessings-section .section-icon");
          if (icon) createSectionBurst(icon);
        }
      }
    });
    gsap.from("#open-blessings-btn", {
      opacity: 0, scale: 0.7, duration: 1.3,
      ease: "back.out(1.6)",
      scrollTrigger: { trigger: "#open-blessings-btn", start: "top 85%" },
    });

    // Footer animations
    gsap.from("#site-footer .footer-moon", {
      opacity: 0, scale: 0, rotation: -30, duration: 1.5, ease: "back.out(2)",
      scrollTrigger: { trigger: "#site-footer", start: "top 85%" },
    });
    gsap.from(".footer-message", {
      opacity: 0, y: 35, duration: 1.2,
      scrollTrigger: { trigger: ".footer-message", start: "top 90%" },
    });
    gsap.from(".footer-credit", {
      opacity: 0, y: 20, duration: 1.2,
      scrollTrigger: { trigger: ".footer-credit", start: "top 92%" },
    });

    // Active nav tracking
    document.querySelectorAll("section").forEach((sec) => {
      ScrollTrigger.create({
        trigger: sec,
        start: "top center",
        end: "bottom center",
        onEnter: () => setActiveNav(sec.id),
        onEnterBack: () => setActiveNav(sec.id),
      });
    });
  }

  function setActiveNav(id) {
    document.querySelectorAll(".nav-link").forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === "#" + id);
    });
  }

  /* ═══════════════════════════════════════════
     OPEN BLESSINGS
     ═══════════════════════════════════════════ */
  openBlessingsBtn.addEventListener("click", () => {
    createSparkles(
      openBlessingsBtn.getBoundingClientRect().left + openBlessingsBtn.offsetWidth / 2,
      openBlessingsBtn.getBoundingClientRect().top + openBlessingsBtn.offsetHeight / 2,
      30
    );
    extraBlessings.classList.remove("hidden");
    openBlessingsBtn.style.display = "none";

    gsap.from(".blessing-card", {
      opacity: 0, y: 50, scale: 0.9, rotateX: 8,
      duration: 0.9, stagger: 0.2,
      ease: "power3.out",
      onComplete: () => initTiltEffect()
    });
  });

  /* ═══════════════════════════════════════════
     AUDIO MUSIC CONTROLLER
     ═══════════════════════════════════════════ */
  function toggleMusic() {
    if (musicPlaying) {
      bgMusic.pause();
      musicIcon.textContent = "🔇";
    } else {
      bgMusic.volume = 0.35;
      bgMusic.play().catch(() => {});
      musicIcon.textContent = "🔊";
    }
    musicPlaying = !musicPlaying;
  }
  musicToggle.addEventListener("click", toggleMusic);

  /* ═══════════════════════════════════════════
     ENTER SURPRISE EXPERIENCE TRANSITION
     ═══════════════════════════════════════════ */
  enterBtn.addEventListener("click", (e) => {
    createSparkles(e.clientX, e.clientY, 30);

    bgMusic.volume = 0.35;
    bgMusic.play().then(() => {
      musicPlaying = true;
      musicIcon.textContent = "🔊";
    }).catch(() => {});

    // Cinematic letterbox expand (movie feel exit)
    gsap.to(".letterbox-top", { height: 0, duration: 1.5, ease: "power3.inOut" });
    gsap.to(".letterbox-bottom", { height: 0, duration: 1.5, ease: "power3.inOut" });

    // Dramatic zoom + fade out intro
    gsap.to(introOverlay, {
      opacity: 0, scale: 1.08, duration: 2, ease: "power2.inOut",
      onComplete: () => {
        introOverlay.style.display = "none";
        cancelAnimationFrame(introAnimId);
        if (shootingStarInterval) clearInterval(shootingStarInterval);
      },
    });

    // Reveal main site
    mainSite.classList.remove("hidden");
    initThreeBg();
    initTiltEffect();
    createConstellationDots();
    startShootingStars("main-shooting-stars");

    // Delay scroll animations to after transition
    setTimeout(initScrollAnimations, 500);
  });

  /* ═══════════════════════════════════════════
     INITIALIZE ON LOAD
     ═══════════════════════════════════════════ */
  createIntroStars();
  initIntroParticles();
  animateIntro();
  resizeTrailCanvas();
  animateTrail();
  playIntroSequence();
  startShootingStars("shooting-stars-container");

  window.addEventListener("resize", () => {
    resizeIntroCanvas();
    resizeTrailCanvas();
  });

})();
