const hasGSAP =
  typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined";
const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

if (hasGSAP) {
  gsap.registerPlugin(ScrollTrigger);
} else {
  document.documentElement.classList.add("no-gsap");
}

// NAV GLOBAL: toggle mobile + estado "scrolled"
const siteNav = document.getElementById("siteNav");
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");

if (navToggle && siteNav && navLinks) {
  navToggle.addEventListener("click", () => {
    const opening = !siteNav.classList.contains("menu-open");
    siteNav.classList.toggle("menu-open", opening);
    navToggle.classList.toggle("active", opening);
    navToggle.setAttribute("aria-expanded", opening ? "true" : "false");

    if (hasGSAP && opening && !reduceMotion) {
      const links = navLinks.querySelectorAll(".nav-link");
      gsap.fromTo(
        links,
        { opacity: 0, y: -10 },
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
          stagger: 0.07,
          ease: "power2.out",
          delay: 0.1,
        },
      );
    }
  });

  // fecha o menu mobile ao clicar em um link
  navLinks.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      siteNav.classList.remove("menu-open");
      navToggle.classList.remove("active");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

if (hasGSAP && siteNav) {
  ScrollTrigger.create({
    start: "top -60",
    end: 99999,
    onUpdate: (self) => {
      siteNav.classList.toggle("scrolled", self.scroll() > 60);
    },
  });
} else if (siteNav) {
  window.addEventListener("scroll", () => {
    siteNav.classList.toggle("scrolled", window.scrollY > 60);
  });
}

// PARALLAX DO MOUSE NO HERO
const orb = document.querySelector(".glow-orb");
const portrait = document.querySelector(".portrait-shape");
window.addEventListener("mousemove", (e) => {
  const x = (e.clientX / window.innerWidth - 0.5) * 40;
  const y = (e.clientY / window.innerHeight - 0.5) * 40;
  if (hasGSAP && !reduceMotion) {
    if (orb)
      gsap.to(orb, {
        x,
        y,
        duration: 0.9,
        ease: "power2.out",
        overwrite: "auto",
      });
    if (portrait)
      gsap.to(portrait, {
        x: x * 0.3,
        y: y * 0.3,
        duration: 0.9,
        ease: "power2.out",
        overwrite: "auto",
      });
  } else if (!reduceMotion) {
    if (orb) orb.style.transform = `translate(${x * 0.5}px, ${y * 0.5}px)`;
    if (portrait)
      portrait.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
  }
});

// conforme o usuário rola para fora do hero (GSAP ScrollTrigger)
if (hasGSAP && !reduceMotion) {
  gsap.to(".bg-word", {
    yPercent: 18,
    ease: "none",
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: 0.6,
    },
  });
  gsap.to(".portrait-wrap", {
    yPercent: -10,
    ease: "none",
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: 0.6,
    },
  });
}

// MARQUEE DE TECNOLOGIAS
const track = document.getElementById("marqueeTrack");
if (track) {
  track.innerHTML += track.innerHTML;

  if (hasGSAP && !reduceMotion) {
    track.style.animation = "none";
    const marqueeTween = gsap.to(track, {
      xPercent: -50,
      duration: 34,
      ease: "none",
      repeat: -1,
    });
    const marqueeEl = document.querySelector(".marquee");
    if (marqueeEl) {
      marqueeEl.addEventListener("mouseenter", () => marqueeTween.pause());
      marqueeEl.addEventListener("mouseleave", () => marqueeTween.resume());
    }
  }
}

// SCROLL-REVEAL DE TODAS AS SEÇÕES (GSAP ScrollTrigger)
if (hasGSAP) {
  const revealEls = gsap.utils.toArray(".reveal");
  revealEls.forEach((el, i) => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: reduceMotion ? 0.01 : 0.85,
      ease: "power3.out",
      delay: reduceMotion ? 0 : (i % 4) * 0.06,
      scrollTrigger: {
        trigger: el,
        start: "top 88%",
        once: true,
      },
    });
  });
}

(function initProjectCards3D() {
  if (typeof THREE === "undefined") return;

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  function createPlaceholderTexture(label, accentHex) {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 640;
    const ctx = canvas.getContext("2d");

    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, "#141414");
    grad.addColorStop(1, "#050505");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // borda tracejada
    ctx.strokeStyle = accentHex;
    ctx.lineWidth = 3;
    ctx.setLineDash([14, 10]);
    ctx.strokeRect(28, 28, canvas.width - 56, canvas.height - 56);
    ctx.setLineDash([]);

    // ícone simples de "imagem"
    const cx = canvas.width / 2;
    const cy = canvas.height / 2 - 46;
    ctx.strokeStyle = accentHex;
    ctx.globalAlpha = 0.85;
    ctx.lineWidth = 4;
    ctx.strokeRect(cx - 62, cy - 42, 124, 84);
    ctx.beginPath();
    ctx.arc(cx - 30, cy - 10, 10, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx - 50, cy + 30);
    ctx.lineTo(cx - 10, cy - 6);
    ctx.lineTo(cx + 20, cy + 18);
    ctx.lineTo(cx + 55, cy - 14);
    ctx.lineTo(cx + 55, cy + 30);
    ctx.closePath();
    ctx.stroke();
    ctx.globalAlpha = 1;

    // textos
    ctx.textAlign = "center";
    ctx.fillStyle = "#f2f0ec";
    ctx.font = "600 30px Inter, sans-serif";
    ctx.fillText("IMAGEM DO PROJETO", cx, cy + 74);

    ctx.fillStyle = "#8a8783";
    ctx.font = '400 20px "JetBrains Mono", monospace';
    ctx.fillText(label.toUpperCase(), cx, cy + 112);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace || texture.colorSpace;
    return texture;
  }

  function initCard(mediaEl) {
    const canvas = mediaEl.querySelector(".card-3d");
    if (!canvas) return null;

    const card = mediaEl.closest(".project-card");
    const isNeon = mediaEl.dataset.accent === "neon";
    const accentHex = isNeon ? "#2ad9ff" : "#ff2a2a";
    const accentNum = isNeon ? 0x2ad9ff : 0xff2a2a;
    const label = mediaEl.dataset.label || "Projeto";
    const imagePath = mediaEl.dataset.image;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
      });
    } catch (e) {
      return null;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 10);
    camera.position.z = 3.6;

    scene.add(new THREE.AmbientLight(0xffffff, 0.85));
    const key = new THREE.DirectionalLight(0xffffff, 0.55);
    key.position.set(2, 2.4, 2.6);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xffffff, 0.3);
    rim.position.set(-2, -1, 1.5);
    scene.add(rim);

    const w = 3.4,
      h = w * (mediaEl.clientHeight / mediaEl.clientWidth || 0.625);

    // plano de trás: dá a sensação de espessura ao card ao inclinar
    const backMat = new THREE.MeshStandardMaterial({
      color: 0x0c0c0c,
      roughness: 0.9,
      metalness: 0.1,
    });
    const backPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(w * 1.015, h * 1.03),
      backMat,
    );
    backPlane.position.z = -0.09;
    scene.add(backPlane);

    // moldura fina com brilho do acento, levemente atrás da frente
    const frameMat = new THREE.MeshBasicMaterial({
      color: accentNum,
      transparent: true,
      opacity: 0.35,
    });
    const framePlane = new THREE.Mesh(
      new THREE.PlaneGeometry(w * 1.01, h * 1.018),
      frameMat,
    );
    framePlane.position.z = -0.045;
    scene.add(framePlane);

    // plano da frente: recebe a imagem (ou placeholder)
    const placeholderTex = createPlaceholderTexture(label, accentHex);
    const frontMat = new THREE.MeshStandardMaterial({
      map: placeholderTex,
      roughness: 0.85,
      metalness: 0.05,
    });
    const frontPlane = new THREE.Mesh(new THREE.PlaneGeometry(w, h), frontMat);
    scene.add(frontPlane);

    if (imagePath) {
      new THREE.TextureLoader().load(
        imagePath,
        (tex) => {
          tex.colorSpace = THREE.SRGBColorSpace || tex.colorSpace;
          frontMat.map = tex;
          frontMat.needsUpdate = true;
        },
        undefined,
        () => {
        },
      );
    }

    const group = new THREE.Group();
    group.add(backPlane, framePlane, frontPlane);
    scene.add(group);

    let targetRotX = 0,
      targetRotY = 0;
    let curRotX = 0,
      curRotY = 0;
    let hovering = false;
    let running = false;
    let raf = null;
    let floatT = Math.random() * Math.PI * 2;
    const useTicker = typeof gsap !== "undefined";

    function resize() {
      const width = mediaEl.clientWidth || 300;
      const height = mediaEl.clientHeight || 190;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }
    resize();
    if ("ResizeObserver" in window) {
      new ResizeObserver(resize).observe(mediaEl);
    } else {
      window.addEventListener("resize", resize);
    }

    function onMove(e) {
      const rect = mediaEl.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width; //
      const y = (e.clientY - rect.top) / rect.height; //
      targetRotY = (x - 0.5) * 0.55;
      targetRotX = -(y - 0.5) * 0.4;
    }
    mediaEl.addEventListener("mouseenter", () => {
      hovering = true;
    });
    mediaEl.addEventListener("mousemove", onMove);
    mediaEl.addEventListener("mouseleave", () => {
      hovering = false;
      targetRotX = 0;
      targetRotY = 0;
    });

    function tick() {
      if (!reduceMotion) {
        floatT += 0.01;
        if (!hovering) {
          targetRotY = Math.sin(floatT) * 0.06;
          targetRotX = Math.cos(floatT * 0.8) * 0.03;
        }
        curRotX += (targetRotX - curRotX) * 0.08;
        curRotY += (targetRotY - curRotY) * 0.08;
        group.rotation.x = curRotX;
        group.rotation.y = curRotY;
        group.position.y = Math.sin(floatT * 0.9) * 0.03;
      }
      renderer.render(scene, camera);
      if (!useTicker && running && !reduceMotion)
        raf = requestAnimationFrame(tick);
    }

    renderer.render(scene, camera); // frame estático inicial

    return {
      start() {
        if (running || reduceMotion) return;
        running = true;
        if (useTicker) {
          gsap.ticker.add(tick);
        } else {
          tick();
        }
      },
      stop() {
        running = false;
        if (useTicker) {
          gsap.ticker.remove(tick);
        } else if (raf) {
          cancelAnimationFrame(raf);
        }
      },
    };
  }

  const mediaEls = document.querySelectorAll(".card-media");
  mediaEls.forEach((mediaEl) => {
    const instance = initCard(mediaEl);
    if (!instance) return;
    if ("IntersectionObserver" in window) {
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) instance.start();
            else instance.stop();
          });
        },
        { threshold: 0.1 },
      );
      obs.observe(mediaEl);
    } else {
      instance.start();
    }
  });
})();
