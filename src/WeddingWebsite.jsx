/**
 * WeddingWebsite.jsx — Clara & William
 *
 * ── DYNAMIC GUEST INVITE ────────────────────────────────────
 * Pass a `guestName` prop OR use the URL param ?to=
 *
 * Examples:
 *   ?to=Sarah          → "Dear Sarah,"  (single guest)
 *   ?to=Sarah,Budi     → "Dear Sarah & Budi,"  (couple)
 * ────────────────────────────────────────────────────────────
 */

import React, { useState, useEffect, useRef } from "react";

// ============================================================
// CONFIGURATION — Edit everything here
// ============================================================
const CONFIG = {
  groom: "William",
  bride: "Clara",
  weddingDate: "2026-02-28",
  weddingTime: "09:00",
  venue: {
    name: "Plataran Menteng",
    address: "Jalan HOS. Cokroaminoto, RT.6/RW.4, Gondangdia, Kota Jakarta Pusat, DKI Jakarta",
    embedUrl:
      "https://www.google.com/maps/embed/v1/place?key=AIzaSyAeNSQM3Ay3ptkkKCM5zEkwB9lohaPGz2Y&q=place_id:ChIJF1aM29L1aS4RR9iRyHprRE4",
  },
  receptionVenue: {
    name: "Reception Venue",
    address: "Add the reception address here",
    embedUrl:
      "https://www.google.com/maps/embed/v1/place?key=AIzaSyAeNSQM3Ay3ptkkKCM5zEkwB9lohaPGz2Y&q=Jakarta",
  },
  events: {
    settlement: {
      title: "Marriage Settlement",
      time: "09:00 WIB - Finished",
    },
    reception: {
      title: "Reception",
      time: "12:00 WIB - Finished",
    },
  },
  music: {
    src: "/music/wedding-song.mp3",
    autoplay: true,
  },
  verse: {
    text: "And among the signs of His power is that He created for you wives of your own kind, so that you would be inclined and feel at ease with them, and He made among you a feeling of love and affection. Indeed, in that there are truly signs for a person who thinks.",
    reference: "QS. Ar-Rum : 21",
  },
  verse2: {
    text: "Love is patient, love is kind. It does not envy, it does not boast, it is not proud. It always protects, always trusts, always hopes, always perseveres.",
    reference: "1 Corinthians 13 : 4, 7",
  },
  gallery: [
    { src: "https://api.our-wedding.link/uploads/51205a60-758f-11eb-8da6-dd0d1b27de24.jpg", caption: "Our Story" },
    { src: "https://api.our-wedding.link/uploads/29a18720-e7fc-11ed-98be-b566ca689cd2.jpg", caption: "Together" },
    { src: "https://api.our-wedding.link/uploads/2a338df0-e7fc-11ed-b2db-9ff0c0d42cfe.jpg", caption: "Precious Moment" },
    { src: "https://api.our-wedding.link/uploads/f3fcda30-b90a-11ee-9c5f-6bbbfa84b82d.jpg", caption: "Love" },
    { src: "https://api.our-wedding.link/uploads/f3fa9040-b90a-11ee-9c5f-6bbbfa84b82d.jpg", caption: "Forever" },
    { src: "https://api.our-wedding.link/uploads/f3fdc490-b90a-11ee-9c5f-6bbbfa84b82d.jpg", caption: "Happy" },
    { src: "https://api.our-wedding.link/uploads/f400f8e0-b90a-11ee-9c5f-6bbbfa84b82d.jpg", caption: "Beautiful" },
    { src: "https://api.our-wedding.link/uploads/f403df10-b90a-11ee-9c5f-6bbbfa84b82d.jpg", caption: "Memories" },
  ],
  digitalEnvelope: {
    accounts: [
      {
        name: "Clara",
        bank: "BCA",
        accountNumber: "1234567890",
        accountName: "Clara Maria",
        qrSrc: "/qr/clara-qr.png",
      },
      {
        name: "William",
        bank: "Mandiri",
        accountNumber: "0987654321",
        accountName: "Jan William Sianturi",
        qrSrc: "/qr/william-qr.png",
      },
    ],
  },
};
// ============================================================

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,600&family=Jost:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --p50:  #FEF5F8;
    --p100: #FAE0E9;
    --p200: #F4BDD0;
    --p300: #EC96B3;
    --p400: #E07095;
    --p500: #CC5278;
    --p600: #A83D61;
    --fd: 'Cormorant Garamond', serif;
    --fb: 'Jost', sans-serif;
    --sh: 0 8px 40px rgba(180,60,100,0.08);
    --env-main: #C24D78;
    --env-deep: #B13C68;
    --env-light: #D66A91;
    --env-liner: #FCE8EF;
    --env-liner-ink: rgba(194,77,120,0.18);
    --env-floral: rgba(255,255,255,0.16);
    --env-floral-deep: rgba(120,24,64,0.12);
  }

  html { scroll-behavior: smooth; }
  body { font-family: var(--fb); background: #FFFBFD; color: #3d2035; overflow-x: hidden; }

  .pink-bg {
    background:
      linear-gradient(160deg, rgba(255,248,250,0.54) 0%, rgba(254,242,246,0.46) 42%, rgba(252,234,241,0.56) 100%),
      url('/assets/main-hero-bg.png') center center / cover no-repeat;
    background-attachment: fixed;
  }

  /* ===== INVITE OVERLAY ===== */
  .inv-overlay {
    position: fixed; inset: 0; z-index: 1;
    display: flex; align-items: center; justify-content: center;
    background: linear-gradient(150deg, #FFF8FA 0%, #FEF2F6 50%, #FCEAF1 100%);
    overflow: hidden;
  }
  .inv-overlay.out { animation: overlayOut 0.32s ease forwards; }
  @keyframes overlayOut {
    0%   { opacity:1; transform:scale(1); }
    100% { opacity:0; transform:scale(1); pointer-events:none; }
  }

  /* Falling petals */
  .petal {
    position: absolute; border-radius: 50% 10% 50% 10%;
    opacity: 0; animation: petalFall linear infinite;
  }
  @keyframes petalFall {
    0%   { transform: translateY(-60px) rotate(0deg); opacity:0; }
    10%  { opacity: 0.75; }
    90%  { opacity: 0.45; }
    100% { transform: translateY(110vh) rotate(420deg); opacity:0; }
  }

  /* Envelope scene */
  .inv-scene {
    display: flex; flex-direction: column; align-items: center;
    gap: 1.6rem; position: relative; z-index: 1;
    width: 100%; max-width: 760px; padding: 0 1rem;
  }
  .inv-pre {
    font-size: 0.7rem; letter-spacing: 0.22em; text-transform: uppercase;
    color: var(--p400); font-family: var(--fb); font-weight: 300;
    max-width: min(90vw, 560px); text-align: center; line-height: 1.7;
  }
  .inv-couple {
    font-family: var(--fd); font-size: clamp(1.7rem,5vw,2.8rem);
    font-weight: 300; font-style: italic; color: #5a1a35; text-align: center;
  }
  .inv-dear { text-align: center; }
  .inv-dear-label {
    font-size: 0.68rem; letter-spacing: 0.2em; text-transform: uppercase;
    color: var(--p400); font-family: var(--fb); font-weight: 300;
  }
  .inv-dear-name {
    font-family: var(--fd); font-style: italic;
    font-size: clamp(1.5rem,4vw,2.1rem); color: #5a1a35; font-weight: 300;
    margin-top: 0.2rem;
  }

  /* ===== ENVELOPE (REDESIGNED) ===== */
  .env-wrap {
    cursor: pointer;
    perspective: 1200px;
    margin-top: 0.35rem;
    transition: transform 0.25s ease, filter 0.25s ease;
    filter: drop-shadow(0 18px 42px rgba(160,37,74,0.26));
    transform: translateZ(0);
  }
  .env-wrap:hover { transform: translateY(-3px) scale(1.012); filter: drop-shadow(0 24px 54px rgba(160,37,74,0.34)); }

  /* 3-D flipper */
  .env-flipper {
    width: 292px; height: 199px;
    position: relative;
    transform-style: preserve-3d;
    transition: transform 0.5s cubic-bezier(0.22,1,0.36,1);
    will-change: transform;
  }
  .env-flipper.is-flipped { transform: rotateY(180deg); }
  .env-flipper:not(.is-flipped) .env-front {
    opacity: 0;
    pointer-events: none;
  }
  .env-flipper.is-flipped .env-front {
    opacity: 1;
  }

  /* shared face rules — NO overflow:hidden or clip-path, they break backface-visibility */
  .env-face {
    position: absolute; inset: 0; border-radius: 9px;
    backface-visibility: hidden; -webkit-backface-visibility: hidden;
    transform-style: preserve-3d;
  }

  /* ── BACK FACE (shown first) ── */
  .env-back {
    background:
      radial-gradient(circle at 18% 82%, rgba(255,255,255,0.13) 0 1px, transparent 2px 100%),
      linear-gradient(145deg, var(--env-light) 0%, var(--env-main) 48%, var(--env-deep) 100%);
    /* NO overflow:hidden — it breaks backface-visibility in preserve-3d contexts */
    display: flex; align-items: center; justify-content: center;
    box-shadow: inset 0 0 0 1px rgba(255,255,255,0.1);
  }
  /* diagonal seam lines (X pattern) */
  .env-back::before, .env-back::after {
    content: ''; position: absolute;
    background: rgba(255,255,255,0.16); height: 1.5px;
  }
  .env-back-floral,
  .env-front-floral {
    position: absolute;
    pointer-events: none;
    background-repeat: no-repeat;
    background-position: left bottom;
    background-size: contain;
    filter: saturate(0.9) brightness(1.15);
    mix-blend-mode: screen;
    z-index: 1;
  }
  .env-back-floral {
    left: 0px; bottom: 2px; width: 460px; height: 230px;
    opacity: 0.24;
    background-image: url('/assets/envelope-front-motif.png');
    background-position: left bottom;
  }
  .env-front-floral {
    left: 1px; bottom: 2px; width: 245px; height: 100px;
    opacity: 0.16;
    background-image: url('/assets/envelope-back-motif.png');
    background-position: left bottom;
    z-index: 13;
  }
  .fl-stem,
  .fl-stem::before,
  .fl-stem::after {
    position: absolute;
    content: '';
    width: 1.2px;
    height: 58px;
    left: 42px;
    bottom: 3px;
    background: rgba(255,255,255,0.16);
    transform-origin: bottom center;
    border-radius: 999px;
  }
  .fl-stem { transform: rotate(38deg); }
  .fl-stem::before { left: -18px; bottom: 0; height: 46px; transform: rotate(-34deg); }
  .fl-stem::after { left: 14px; bottom: 0; height: 40px; transform: rotate(26deg); }
  .fl-bloom,
  .fl-bloom::before,
  .fl-bloom::after {
    position: absolute;
    content: '';
    width: 18px;
    height: 18px;
    border: 1.2px solid rgba(255,255,255,0.18);
    border-radius: 58% 42% 56% 44%;
    background: rgba(255,255,255,0.04);
  }
  .fl-bloom { left: 10px; bottom: 34px; transform: rotate(-18deg); }
  .fl-bloom::before { left: 32px; bottom: 20px; transform: rotate(42deg) scale(0.82); }
  .fl-bloom::after { left: 56px; bottom: -10px; transform: rotate(-34deg) scale(0.68); }
  .fl-leaf,
  .fl-leaf::before,
  .fl-leaf::after {
    position: absolute;
    content: '';
    width: 15px;
    height: 8px;
    border-radius: 100% 0 100% 0;
    border: 1px solid rgba(255,255,255,0.14);
    background: rgba(255,255,255,0.035);
  }
  .fl-leaf { left: 40px; bottom: 30px; transform: rotate(16deg); }
  .fl-leaf::before { left: -15px; bottom: -16px; transform: rotate(-54deg); }
  .fl-leaf::after { left: 18px; bottom: -6px; transform: rotate(42deg); }
  .env-return {
    position: absolute; top: 1rem; left: 1.2rem;
    display: flex; flex-direction: column; gap: 2px;
  }
  .env-return span {
    font-size: 0.44rem; letter-spacing: 0.15em; text-transform: uppercase;
    color: rgba(255,255,255,0.6); font-family: var(--fb);
  }
  .env-back-names { text-align: center; position: relative; z-index: 1; }
  .env-back-name {
    font-family: var(--fd); font-style: italic; font-size: 1.55rem;
    font-weight: 300; color: rgba(255,255,255,0.95); line-height: 1.1;
  }
  .env-back-amp {
    font-family: var(--fd); font-style: italic; font-size: 0.9rem;
    color: rgba(255,255,255,0.65); display: block; margin: 3px 0;
  }

  /* ── FRONT FACE (after Y-flip) ── */
  .env-front {
    transform: rotateY(180deg);
    background: transparent;
    overflow: visible; /* allow letter to rise above */
    transform-style: preserve-3d;
    transition: opacity 0.18s linear;
  }
  .env-front-body {
    position: absolute; inset: 0; border-radius: 9px; overflow: hidden;
    background: var(--env-main);
    box-shadow: inset 0 0 0 1px rgba(255,255,255,0.1);
  }
  /* Inside reveal – light pink V under the flap */
  .env-inside {
    position: absolute; top: 18px; left: 22px; right: 22px; height: 72%;
    clip-path: polygon(0 0, 100% 0, 86% 100%, 14% 100%);
    background:
      url('/assets/envelope-inside-motif.png') center 42% / 245px auto repeat,
      linear-gradient(145deg, #fff 0%, var(--env-liner) 100%);
    z-index: 2;
    opacity: 0;
    transition: opacity 0.22s ease 0.1s;
  }
  .env-front.is-opening .env-inside,
  .env-front.is-open .env-inside { opacity: 1; }
  .env-inside::before,
  .env-inside::after {
    content: ''; position: absolute; inset: 0;
    background: rgba(255,255,255,0.24);
    opacity: 0.55;
  }
  .env-inside::after {
    display: none;
  }
  /* Left & right side flaps */
  .env-side-l {
    position: absolute; top: 0; left: 0; bottom: 0; width: 52%;
    clip-path: polygon(0 24%, 0 100%, 100% 100%, 100% 65%, 20% 47%);
    background: var(--env-main);
    z-index: 3;
  }
  .env-side-r {
    position: absolute; top: 0; right: 0; bottom: 0; width: 52%;
    clip-path: polygon(100% 24%, 100% 100%, 0 100%, 0 65%, 80% 47%);
    background: var(--env-main);
    z-index: 3;
  }
  /* Bottom flap */
  .env-btm {
    position: absolute; bottom: 0; left: 0; right: 0; height: 70%;
    clip-path: polygon(0 100%, 100% 100%, 78% 0, 22% 0);
    background: var(--env-main);
    z-index: 12;
  }
  /* ── TOP FLAP (opens on rotateX) ── */
  .env-flap-wrap {
    position: absolute; top: 0; left: 0; right: 0; height: 58%;
    transform-origin: top center;
    transform-style: preserve-3d;
    transition: transform 0.52s cubic-bezier(0.22,1,0.36,1);
    z-index: 20;
    will-change: transform;
  }
  .env-flap-wrap.is-open { transform: translateY(4%) scaleY(-0.84); }
  .env-front.is-opening .env-flap-wrap,
  .env-front.is-open .env-flap-wrap { z-index: 4; }
  .env-front.is-zooming .env-flap-wrap { z-index: 2; opacity: 0; transition: opacity 0.18s ease; }

  /* outside surface of flap */
  .env-flap-out {
    position: absolute; inset: 0;
    border-radius: 15px;
    clip-path: polygon(0 0, 100% 0, 50% 100%);
    background:
      radial-gradient(ellipse at 18% 74%, rgba(255,255,255,0.1) 0 8px, transparent 9px),
      radial-gradient(ellipse at 82% 74%, rgba(255,255,255,0.08) 0 7px, transparent 8px),
      linear-gradient(160deg, var(--env-deep) 0%, var(--env-main) 48%, var(--env-light) 100%);
    backface-visibility: hidden; -webkit-backface-visibility: hidden;
  }
  /* subtle sheen */
  .env-flap-out::after {
    content: ''; position: absolute;
    top: 0; left: 20%; width: 60%; height: 40%;
    background: linear-gradient(160deg, rgba(255,255,255,0.12) 0%, transparent 100%);
  }
  /* inside surface of flap (light pink, faces viewer when open) */
  .env-flap-in {
    position: absolute; inset: 0;
    clip-path: polygon(0 0, 100% 0, 50% 100%);
    background:
      radial-gradient(circle at 20% 40%, transparent 0 18px, var(--env-liner-ink) 19px 20px, transparent 21px),
      radial-gradient(circle at 78% 54%, transparent 0 22px, rgba(194,77,120,0.16) 23px 24px, transparent 25px),
      linear-gradient(160deg, #fff 0%, var(--env-liner) 100%);
    transform: rotateX(180deg);
    backface-visibility: hidden; -webkit-backface-visibility: hidden;
  }

  /* Wax seal */
  .env-seal {
    position: absolute; top: 29%; left: 50%;
    transform: translate(-50%, -50%);
    width: 40px; height: 40px; border-radius: 50%;
    background: radial-gradient(circle at 35% 35%, var(--p300), var(--env-deep));
    display: flex; align-items: center; justify-content: center;
    font-size: 0.95rem; color: rgba(255,255,255,0.92);
    box-shadow: 0 2px 14px rgba(100,20,50,0.45);
    z-index: 25;
    backface-visibility: hidden; -webkit-backface-visibility: hidden;
    transition: opacity 0.18s ease, transform 0.18s ease;
  }
  .env-seal.gone { opacity: 0; pointer-events: none; transform: translate(-50%, -50%) scale(0.9); }

  /* ── LETTER / MINI INVITE CARD ── */
  .env-letter-wrap {
    position: absolute; left: 94px; right: auto; bottom: 35px;
    width: 176px;
    z-index: 8;
    transition:
      transform 0.56s cubic-bezier(0.22,1,0.36,1) 0.08s,
      opacity   0.26s ease 0.08s;
    transform: translateY(72px) rotate(7deg);
    opacity: 0; pointer-events: none;
    will-change: transform, opacity;
  }
  .env-letter-wrap.is-up {
    transform: translateY(-34px) rotate(7deg);
    opacity: 1;
  }
  .env-letter-wrap.is-zoom {
    transform: translateY(-38px) rotate(3deg) scale(4.8);
    opacity: 0;
    transition:
      transform 0.32s cubic-bezier(0.5,0,0.75,0) 0s,
      opacity   0.18s ease 0.12s;
  }
  .env-letter-card {
    background: #fff;
    min-height: 214px;
    border-radius: 2px;
    border: 1px solid rgba(194,77,120,0.12);
    box-shadow: 0 12px 30px rgba(160,37,74,0.22);
    padding: 26px 14px 18px;
    display: flex; flex-direction: column; align-items: center; gap: 3px;
    overflow: hidden;
    background:
      radial-gradient(circle at 18% 17%, rgba(194,77,120,0.18) 0 4px, transparent 5px),
      radial-gradient(circle at 23% 20%, rgba(205,91,143,0.22) 0 3px, transparent 4px),
      radial-gradient(circle at 78% 82%, rgba(194,77,120,0.16) 0 4px, transparent 5px),
      linear-gradient(#fff, #fff);
  }
  .lc-petals  { color: var(--p500); font-size: 0.75rem; letter-spacing: 0.18em; }
  .lc-eyebrow { font-size: 0.43rem; letter-spacing: 0.12em; text-transform: uppercase; color: #8a6674; font-family: var(--fb); margin-top: 6px; }
  .lc-names   { font-family: var(--fd); font-style: italic; font-size: 1.08rem; color: #9f3b72; font-weight: 400; line-height: 1.15; text-align: center; }
  .lc-names span { font-size: 0.72rem; color: var(--p400); margin: 0 3px; }
  .lc-divider { width: 32px; height: 0.5px; background: rgba(194,77,120,0.24); margin: 6px auto; }
  .lc-date    { font-size: 0.38rem; letter-spacing: 0.12em; text-transform: uppercase; color: #8b6a42; font-family: var(--fb); text-align: center; }
  .lc-venue   { font-size: 0.32rem; letter-spacing: 0.08em; color: #8a6674; font-family: var(--fb); text-align: center; line-height: 1.45; }

  .inv-hint {
    font-size: 0.68rem; letter-spacing: 0.14em; text-transform: uppercase;
    color: var(--p300); font-weight: 300; animation: blink 2.2s ease-in-out infinite;
  }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.4} }

  .inv-btn {
    padding: 0.75rem 2.4rem; border: 1px solid var(--p300); background: transparent;
    color: var(--p600); border-radius: 100px; font-family: var(--fb);
    font-size: 0.75rem; font-weight: 400; letter-spacing: 0.18em;
    text-transform: uppercase; cursor: pointer;
    transition: background 0.2s, color 0.2s, transform 0.2s;
    position: relative; overflow: hidden;
  }
  .inv-btn:hover { background: var(--p500); border-color: var(--p500); color:#fff; transform:translateY(-1px); }
  .inv-btn::after {
    content:''; position:absolute; inset:0; border-radius:100px;
    background:rgba(255,255,255,0.25); transform:scale(0); opacity:0;
    transition: transform 0.5s ease, opacity 0.5s ease;
  }
  .inv-btn:active::after { transform:scale(1.5); opacity:1; }

  /* ===== NAV ===== */
  nav {
    position: fixed; top:0; left:0; right:0; z-index:100;
    background: rgba(253,240,243,0.88); backdrop-filter: blur(14px);
    border-bottom: 1px solid var(--p100);
    display:flex; align-items:center; justify-content:space-between;
    padding:0 2.5rem; height:64px;
  }
  .nav-brand { font-family:var(--fd); font-size:1.4rem; font-weight:400; color:var(--p600); letter-spacing:0.03em; }
  .nav-links  { display:flex; gap:2rem; list-style:none; }
  .nav-links a { text-decoration:none; font-size:0.74rem; font-weight:400; letter-spacing:0.14em; text-transform:uppercase; color:#7a4060; transition:color 0.2s; }
  .nav-links a:hover { color:var(--p500); }

  /* ===== HERO ===== */
  .hero {
    min-height:100vh; display:flex; flex-direction:column;
    align-items:center; justify-content:center; text-align:center;
    padding:5.6rem 2rem 3rem;
    background:
      linear-gradient(160deg, rgba(255,248,250,0.54) 0%, rgba(254,242,246,0.46) 42%, rgba(252,234,241,0.56) 100%),
      url('/assets/main-hero-bg.png') center center / cover no-repeat;
    position:relative; overflow:hidden;
  }
  .hero::before {
    content:''; position:absolute; width:600px; height:600px; border-radius:50%;
    background:radial-gradient(circle,rgba(238,122,155,0.08) 0%,transparent 70%);
    top:-100px; left:-100px;
  }
  .hero::after {
    content:''; position:absolute; width:500px; height:500px; border-radius:50%;
    background:radial-gradient(circle,rgba(193,53,96,0.06) 0%,transparent 70%);
    bottom:-50px; right:-80px;
  }
  .hero-eyebrow { font-size:0.72rem; letter-spacing:0.25em; text-transform:uppercase; color:var(--p400); margin-bottom:1.5rem; font-weight:400; }
  .hero-name-frame {
    position: relative;
    width: min(62vw, 640px);
    min-width: 300px;
    aspect-ratio: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: -0.4rem auto 0;
  }
  .hero-name-frame::before {
    content: '';
    position: absolute;
    inset: -14%;
    background: url('/assets/name-frame.png') center center / contain no-repeat;
    pointer-events: none;
    opacity: 1;
  }
  .hero-name-center {
    position: relative;
    z-index: 20;
    width: 72%;
    display: flex;
    align-items: center;
    justify-content: center;
    transform: translate(0, -20%);
  }
  .hero-names   { font-family:var(--fd); font-size:clamp(2.1rem,5vw,4rem); font-weight:300; line-height:1; color:#5a1a35; }
  .hero-amp     { display:block; font-style:italic; font-size:clamp(1.05rem,2.8vw,2rem); color:var(--p400); margin:0.02em 0; }
  .hero-date    { margin-top:0.5rem; font-size:0.82rem; letter-spacing:0.2em; text-transform:uppercase; color:#a06080; font-weight:300; }
  .hero-divider { width:80px; height:1px; background:linear-gradient(90deg,transparent,var(--p300),transparent); margin:0.9rem auto 1.05rem; }

  /* Verse */
  .verse-block {
    max-width:500px; margin:0 auto; padding:1.6rem 1.8rem 1.6rem 2rem;
    border-left:2px solid var(--p200); text-align:left; position:relative; z-index:1;
  }
  .verse-ql {
    font-family:var(--fd); font-size:4rem; color:var(--p200);
    line-height:0; position:absolute; top:1.8rem; left:0.5rem;
  }
  .verse-text {
    font-family:var(--fd); font-style:italic; font-size:1.02rem;
    color:#7a3050; line-height:1.82; font-weight:300; padding-left:1.4rem;
  }
  .verse-ref {
    display:block; margin-top:0.7rem; padding-left:1.4rem;
    font-size:0.7rem; letter-spacing:0.18em; text-transform:uppercase;
    color:var(--p400); font-weight:400; font-style:normal; font-family:var(--fb);
  }

  .verse-cover {
    padding: 5rem 2rem;
    border-top: 1px solid rgba(250,224,233,0.72);
    border-bottom: 1px solid rgba(250,224,233,0.72);
  }
  .verse-cover-inner {
    max-width: 1080px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 3rem;
    align-items: start;
  }
  .verse-cover .verse-block {
    max-width: none;
    margin: 0;
    min-height: 100%;
    background: rgba(255,255,255,0.54);
    border: 1px solid rgba(250,224,233,0.78);
    border-left: 2px solid var(--p200);
    border-radius: 10px;
    backdrop-filter: blur(4px);
  }
  .notes-sec {
    padding: 4.5rem 2rem;
    background: #fff;
  }
  .notes-inner {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1.25rem;
    max-width: 900px;
    margin: 0 auto;
  }
  .notes-inner .verse-block {
    max-width: none;
    margin: 0;
    padding: 1.2rem 1.35rem 1.1rem 1.65rem;
    background: #fff;
    border: 1px solid rgba(250,224,233,0.78);
    border-left: 2px solid var(--p200);
    border-radius: 8px;
    box-shadow: 0 12px 32px rgba(160,37,74,0.06);
  }
  .notes-inner .verse-ql { font-size: 2.7rem; top: 1.15rem; left: 0.45rem; }
  .notes-inner .verse-text { font-size: 0.9rem; line-height: 1.65; }
  .notes-inner .verse-ref { font-size: 0.58rem; margin-top: 0.55rem; }

  .scroll-hint {
    position:absolute; bottom:2rem; left:50%; transform:translateX(-50%);
    display:flex; flex-direction:column; align-items:center; gap:8px;
    color:var(--p300); animation:flt 2.5s ease-in-out infinite;
  }
  .scroll-dot { width:1px; height:32px; background:linear-gradient(to bottom,var(--p300),transparent); }
  @keyframes flt { 0%,100%{transform:translateX(-50%) translateY(0)} 50%{transform:translateX(-50%) translateY(6px)} }

  /* ===== COUNTDOWN ===== */
  .cds { background:#FFF; padding:5rem 2rem; text-align:center; border-top:1px solid var(--p100); border-bottom:1px solid var(--p100); }
  .cdg { display:flex; justify-content:center; gap:2rem; margin-top:2.5rem; flex-wrap:wrap; }
  .cdu { display:flex; flex-direction:column; align-items:center; gap:.5rem; }
  .cdn { font-family:var(--fd); font-size:3.5rem; font-weight:300; color:var(--p500); line-height:1; min-width:80px; }
  .cdl { font-size:0.68rem; letter-spacing:0.2em; text-transform:uppercase; color:#a06080; }
  .cdsep { font-family:var(--fd); font-size:2.5rem; color:var(--p200); align-self:center; padding-bottom:1.2rem; }

  /* ===== SECTION HEADER ===== */
  .sh   { text-align:center; margin-bottom:3rem; }
  .sey  { font-size:0.7rem; letter-spacing:0.25em; text-transform:uppercase; color:var(--p400); margin-bottom:1rem; }
  .st   { font-family:var(--fd); font-size:clamp(2rem,5vw,3rem); font-weight:300; color:#5a1a35; line-height:1.2; }
  .sl   { width:60px; height:1px; background:linear-gradient(90deg,transparent,var(--p300),transparent); margin:1.5rem auto 0; }

  /* ===== GALLERY ===== */
  .gal-sec { padding:6rem 2rem; }
  .gal-grid { display:grid; grid-template-columns:repeat(auto-fit, minmax(min(100%, 423.5px), 423.5px)); justify-content:center; gap:1.25rem; max-width:1320px; margin:0 auto; }
  .gal-item { position:relative; border-radius:12px; overflow:hidden; width:100%; max-width:423.5px; height:317.63px; background:var(--p100); cursor:pointer; transition:transform .3s,box-shadow .3s; }
  .gal-item:hover { transform:translateY(-4px); box-shadow:0 20px 60px rgba(193,53,96,.15); }
  .gal-item:first-child { grid-column:auto; }
  .gal-img { width:100%; height:100%; object-fit:cover; display:block; transition:transform .5s; }
  .gal-item:hover .gal-img { transform:scale(1.04); }
  .gal-ov  { position:absolute; inset:0; background:linear-gradient(to top,rgba(90,26,53,.6) 0%,transparent 50%); display:flex; align-items:flex-end; padding:1.25rem; opacity:0; transition:opacity .3s; }
  .gal-item:hover .gal-ov { opacity:1; }
  .gal-cap { color:#fff; font-size:.85rem; font-weight:300; letter-spacing:.05em; }
  .gal-ph  { width:100%; height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:.5rem; color:var(--p300); font-size:.75rem; letter-spacing:.1em; }
  .gal-ph svg { width:32px; height:32px; stroke:var(--p300); fill:none; stroke-width:1; }

  /* Lightbox */
  .lb { position:fixed; inset:0; z-index:1000; background:rgba(40,8,18,.92); display:flex; align-items:center; justify-content:center; backdrop-filter:blur(8px); animation:fi .3s ease; }
  @keyframes fi { from{opacity:0} to{opacity:1} }
  .lb-img { max-width:85vw; max-height:80vh; object-fit:contain; border-radius:8px; }
  .lb-cls { position:absolute; top:1.5rem; right:1.5rem; width:44px; height:44px; border-radius:50%; border:1px solid rgba(255,255,255,.2); background:transparent; color:#fff; font-size:1.2rem; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:background .2s; }
  .lb-cls:hover { background:rgba(255,255,255,.1); }
  .lb-cap { position:absolute; bottom:2rem; left:50%; transform:translateX(-50%); color:rgba(255,255,255,.7); font-size:.85rem; letter-spacing:.1em; }

  /* ===== MAP ===== */
  .map-sec { padding:6rem 2rem; background:#FFF; }
  .map-grid { max-width:1100px; margin:0 auto; display:grid; grid-template-columns:repeat(2, minmax(0, 1fr)); gap:1.5rem; }
  .map-wr  { border-radius:16px; overflow:hidden; box-shadow:var(--sh); border:1px solid var(--p100); background:#fff; }
  .event-strip {
    max-width: 900px;
    margin: 0 auto 2rem;
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    gap: 0;
  }
  .event-card {
    min-height: 116px;
    padding: 1.35rem 1.65rem;
    background: rgba(194,77,120,0.82);
    color: #fff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    box-shadow: 0 14px 36px rgba(160,37,74,0.13);
  }
  .event-card.left { border-radius: 28px 0 0 28px; text-align: right; padding-right: 2.2rem; }
  .event-card.right { border-radius: 0 28px 28px 0; text-align: left; padding-left: 2.2rem; }
  .event-title {
    font-family: var(--fd);
    font-size: 1.45rem;
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    line-height: 1;
  }
  .event-line {
    margin-top: 0.5rem;
    font-size: 0.76rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.86);
  }
  .event-heart {
    width: 86px;
    height: 86px;
    border-radius: 50%;
    background: #fff8fa;
    color: var(--env-main);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--fd);
    font-size: 2.5rem;
    margin: 0 -18px;
    z-index: 1;
    box-shadow: 0 12px 34px rgba(160,37,74,0.16);
  }
  .hero .event-strip {
    width: min(760px, 92vw);
    margin: 1.35rem auto 0;
    position: relative;
    z-index: 1;
  }
  .hero .event-card {
    min-height: 106px;
    background: rgba(194,77,120,0.86);
  }
  .hero .event-title { font-size: 1.28rem; }
  .hero .event-line { font-size: 0.68rem; }
  .event-venue {
    margin-top: 0.45rem;
    color: rgba(255,255,255,0.9);
    font-size: 0.66rem;
    line-height: 1.45;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
  .event-location {
    max-width: 420px;
    margin: -0.35rem auto 2rem;
    padding: 0.95rem 1.35rem;
    border-radius: 8px;
    background: rgba(194,77,120,0.82);
    color: #fff;
    text-align: center;
    box-shadow: 0 12px 32px rgba(160,37,74,0.12);
  }
  .event-location-title {
    font-family: var(--fd);
    font-size: 1.25rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }
  .event-location-address {
    margin-top: 0.35rem;
    font-size: 0.74rem;
    line-height: 1.55;
    color: rgba(255,255,255,0.82);
  }
  .map-inf { background:var(--p50); padding:1.5rem 1.6rem; display:flex; flex-wrap:wrap; gap:1rem; align-items:center; justify-content:space-between; }
  .map-kind { font-size:0.62rem; letter-spacing:0.18em; text-transform:uppercase; color:var(--p400); margin-bottom:0.35rem; }
  .map-vn  { font-family:var(--fd); font-size:1.5rem; font-weight:400; color:#5a1a35; }
  .map-ad  { font-size:.82rem; color:#a06080; margin-top:.3rem; font-weight:300; }
  .map-cta { display:inline-flex; align-items:center; gap:.5rem; padding:.7rem 1.5rem; background:var(--p500); color:#fff; border-radius:100px; text-decoration:none; font-size:.78rem; font-weight:400; letter-spacing:.1em; text-transform:uppercase; transition:background .2s,transform .2s; white-space:nowrap; }
  .map-cta:hover { background:var(--p600); transform:translateY(-1px); }
  .map-fr  { width:100%; height:330px; border:none; display:block; }

  /* ===== DIGITAL ENVELOPE (GIFT) ===== */
  .gift-sec { padding:6rem 2rem; }
  .gift-sub { margin-top:.9rem; font-size:.85rem; color:#a06080; font-weight:300; line-height:1.7; }
  .gift-grid { display:grid; grid-template-columns:1fr 1fr; gap:2rem; max-width:720px; margin:2.5rem auto 0; }
  .gift-card { background:#FFF; border-radius:16px; border:1px solid var(--p100); box-shadow:var(--sh); padding:2rem 1.75rem; display:flex; flex-direction:column; align-items:center; gap:1.1rem; text-align:center; transition:transform .3s,box-shadow .3s; }
  .gift-card:hover { transform:translateY(-4px); box-shadow:0 20px 60px rgba(193,53,96,.14); }
  .gift-person { font-family:var(--fd); font-size:1.65rem; font-weight:400; color:#5a1a35; }
  .gift-bank   { font-size:.7rem; letter-spacing:.2em; text-transform:uppercase; color:var(--p400); }
  .gift-qr { width:152px; height:152px; border-radius:10px; overflow:hidden; border:2px solid var(--p100); background:var(--p50); display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  .gift-qr img { width:100%; height:100%; object-fit:contain; display:block; }
  .gift-qr-ph { display:flex; flex-direction:column; align-items:center; gap:6px; color:var(--p300); font-size:.68rem; letter-spacing:.08em; text-align:center; padding:.75rem; }
  .gift-qr-ph svg { width:50px; height:50px; stroke:var(--p200); fill:none; stroke-width:1.2; }
  .gift-acc  { font-size:.82rem; font-weight:300; color:#8a5070; }
  .gift-accn { font-size:.78rem; color:#a06080; font-weight:300; }
  .gift-copy { padding:.42rem 1.15rem; border:1px solid var(--p200); border-radius:100px; background:transparent; color:var(--p500); font-family:var(--fb); font-size:.68rem; letter-spacing:.12em; text-transform:uppercase; cursor:pointer; transition:all .2s; }
  .gift-copy:hover { background:var(--p500); color:#fff; border-color:var(--p500); }
  .gift-note { text-align:center; margin-top:2.5rem; font-family:var(--fd); font-style:italic; font-size:1rem; color:#a06080; font-weight:300; }

  /* ===== WISHES ===== */
  .wis-sec { padding:6rem 2rem; }
  .wis-lay { max-width:1100px; margin:0 auto; display:grid; grid-template-columns:1fr 1fr; gap:3rem; align-items:start; }
  .wis-form { background:#FFF; border-radius:16px; padding:2.5rem; border:1px solid var(--p100); box-shadow:var(--sh); }
  .fg  { margin-bottom:1.25rem; }
  .fl  { display:block; font-size:.72rem; letter-spacing:.15em; text-transform:uppercase; color:#a06080; margin-bottom:.5rem; font-weight:400; }
  .fi, .fta { width:100%; padding:.75rem 1rem; border:1px solid var(--p100); border-radius:8px; font-family:var(--fb); font-size:.9rem; color:#3a2030; background:#FFFAFB; outline:none; font-weight:300; transition:border-color .2s,box-shadow .2s; }
  .fi:focus, .fta:focus { border-color:var(--p300); box-shadow:0 0 0 3px rgba(238,122,155,.12); }
  .fta  { min-height:120px; resize:vertical; }
  .fsub { width:100%; padding:.9rem; background:var(--p500); color:#fff; border:none; border-radius:8px; font-family:var(--fb); font-size:.82rem; font-weight:400; letter-spacing:.15em; text-transform:uppercase; cursor:pointer; margin-top:.5rem; transition:background .2s,transform .2s; }
  .fsub:hover:not(:disabled) { background:var(--p600); transform:translateY(-1px); }
  .fsub:disabled { opacity:.6; cursor:default; }
  .fok  { text-align:center; padding:1.5rem; color:var(--p500); font-family:var(--fd); font-size:1.2rem; font-style:italic; }
  .wis-feed { display:flex; flex-direction:column; gap:1rem; max-height:580px; overflow-y:auto; padding-right:.5rem; }
  .wis-feed::-webkit-scrollbar { width:4px; }
  .wis-feed::-webkit-scrollbar-track { background:var(--p50); border-radius:4px; }
  .wis-feed::-webkit-scrollbar-thumb { background:var(--p200); border-radius:4px; }
  .wc   { background:#FFF; border-radius:12px; padding:1.25rem 1.5rem; border:1px solid var(--p100); animation:su .4s ease; }
  @keyframes su { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
  .wch  { display:flex; align-items:center; gap:.75rem; margin-bottom:.75rem; }
  .wca  { width:36px; height:36px; border-radius:50%; background:linear-gradient(135deg,var(--p200),var(--p300)); display:flex; align-items:center; justify-content:center; font-family:var(--fd); font-size:1rem; color:#fff; flex-shrink:0; }
  .wcn  { font-size:.9rem; font-weight:500; color:#5a1a35; }
  .wcf  { font-size:.75rem; color:var(--p400); font-weight:300; }
  .wcm  { font-family:var(--fd); font-style:italic; font-size:1rem; color:#6a3050; line-height:1.65; font-weight:300; }

  /* ===== MUSIC PLAYER ===== */
  .mp   { position:fixed; bottom:1.5rem; right:1.5rem; z-index:200; }
  .mpb  { width:52px; height:52px; border-radius:50%; background:var(--p500); border:none; color:#fff; cursor:pointer; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 20px rgba(193,53,96,.35); transition:transform .2s,background .2s; }
  .mpb:hover { transform:scale(1.08); background:var(--p600); }
  .mpr  { position:absolute; inset:0; border-radius:50%; border:2px solid var(--p400); animation:rpl 2s ease-out infinite; }
  @keyframes rpl { 0%{transform:scale(1);opacity:.6} 100%{transform:scale(1.8);opacity:0} }

  /* ===== FOOTER ===== */
  footer { text-align:center; padding:4rem 2rem; background:#5a1a35; color:rgba(255,255,255,.5); }
  .ft-n  { font-family:var(--fd); font-size:2rem; font-weight:300; color:rgba(255,255,255,.85); margin-bottom:.75rem; }
  .ft-s  { font-size:.75rem; letter-spacing:.15em; text-transform:uppercase; }

  /* ===== SCROLL REVEAL ===== */
  .reveal {
    opacity: 0; transform: translateY(36px);
    transition: opacity 0.75s cubic-bezier(0.22,1,0.36,1), transform 0.75s cubic-bezier(0.22,1,0.36,1);
  }
  .reveal.visible { opacity: 1; transform: translateY(0); }
  .reveal-left  { opacity:0; transform:translateX(-40px); transition: opacity 0.75s cubic-bezier(0.22,1,0.36,1), transform 0.75s cubic-bezier(0.22,1,0.36,1); }
  .reveal-left.visible  { opacity:1; transform:translateX(0); }
  .reveal-right { opacity:0; transform:translateX(40px);  transition: opacity 0.75s cubic-bezier(0.22,1,0.36,1), transform 0.75s cubic-bezier(0.22,1,0.36,1); }
  .reveal-right.visible { opacity:1; transform:translateX(0); }
  .reveal-scale { opacity:0; transform:scale(0.88); transition: opacity 0.7s ease, transform 0.7s cubic-bezier(0.34,1.56,0.64,1); }
  .reveal-scale.visible { opacity:1; transform:scale(1); }
  .d1 { transition-delay: 0.08s; }
  .d2 { transition-delay: 0.18s; }
  .d3 { transition-delay: 0.28s; }
  .d4 { transition-delay: 0.38s; }
  .d5 { transition-delay: 0.48s; }
  .d6 { transition-delay: 0.58s; }

  /* ===== ENHANCED TRANSITIONS ===== */
  /* Hero name shimmer on load */
  @keyframes heroFadeUp {
    from { opacity:0; transform:translateY(30px); }
    to   { opacity:1; transform:translateY(0); }
  }
  .hero-eyebrow { animation: heroFadeUp 0.9s 0.2s both; }
  .hero-names   { animation: heroFadeUp 0.9s 0.45s both; }
  .hero-divider { animation: heroFadeUp 0.7s 0.7s both; }
  .hero-date    { animation: heroFadeUp 0.7s 0.85s both; }
  .verse-block  { animation: heroFadeUp 0.7s 1.0s both; }

  /* Countdown number flip */
  @keyframes numFlip {
    0%   { transform: translateY(-12px); opacity:0; }
    100% { transform: translateY(0);     opacity:1; }
  }
  .cdn { animation: numFlip 0.3s ease both; }

  /* Gallery stagger already uses .d1-.d6 reveal delays */
  .gal-item { transition: transform .4s cubic-bezier(0.34,1.56,0.64,1), box-shadow .4s ease; }
  .gal-item:hover { transform: translateY(-8px) scale(1.02); box-shadow: 0 28px 70px rgba(193,53,96,.2); }

  /* Gift card hover */
  .gift-card { transition: transform .4s cubic-bezier(0.34,1.56,0.64,1), box-shadow .4s ease; }
  .gift-card:hover { transform: translateY(-8px) scale(1.02); box-shadow: 0 28px 70px rgba(193,53,96,.18); }

  /* Map CTA pulse */
  @keyframes pulse-ring {
    0%   { box-shadow: 0 0 0 0 rgba(201,53,96,0.4); }
    70%  { box-shadow: 0 0 0 10px rgba(201,53,96,0); }
    100% { box-shadow: 0 0 0 0 rgba(201,53,96,0); }
  }
  .map-cta { animation: pulse-ring 2.5s ease-out infinite; }

  /* Section divider line draw */
  @keyframes drawLine { from{width:0} to{width:60px} }
  .sl { animation: none; } /* triggered via reveal */
  .visible .sl, .sl { transition: width 0.8s cubic-bezier(0.22,1,0.36,1); }

  /* Wish card slide in */
  @keyframes su { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }

  /* Nav link underline */
  .nav-links a { position: relative; }
  .nav-links a::after {
    content:''; position:absolute; left:0; bottom:-2px;
    width:0; height:1px; background:var(--p500); transition:width 0.25s ease;
  }
  .nav-links a:hover::after { width:100%; }

  /* Overlay open button ripple */
  .inv-btn { position: relative; overflow: hidden; }
  .inv-btn::after {
    content:''; position:absolute; inset:0; border-radius:100px;
    background:rgba(255,255,255,0.2); transform:scale(0); opacity:0;
    transition: transform 0.5s ease, opacity 0.5s ease;
  }
  .inv-btn:active::after { transform:scale(1); opacity:1; }

  /* ===== RESPONSIVE ===== */
  @media(max-width:768px){
    .wis-lay,.gift-grid { grid-template-columns:1fr; }
    .gal-item:first-child { grid-column:auto; }
    .gal-item { height:min(317.63px, calc((100vw - 4rem) * 0.75)); }
    nav { padding:0 1.25rem; }
    .nav-links { gap:1.1rem; }
    .inv-pre {
      display: none;
    }
    .env-flipper { width:248px; height:169px; }
    .env-wrap { margin-top: 0.25rem; }
    .env-letter-wrap {
      left: 80px;
      bottom: 27px;
      width: 148px;
      transform: translateY(60px) rotate(7deg);
    }
    .env-letter-wrap.is-up { transform:translateY(-30px) rotate(7deg); }
    .env-letter-wrap.is-zoom { transform:translateY(-34px) rotate(3deg) scale(4.8); }
    .env-letter-card { min-height: 180px; padding: 19px 9px 14px; }
    .lc-names { font-size: 0.92rem; }
    .lc-date { font-size: 0.34rem; }
    .lc-venue { font-size: 0.3rem; }
    .verse-cover-inner { grid-template-columns:1fr; gap:1.25rem; }
    .notes-inner { grid-template-columns:1fr; }
    .hero { padding-top: 5.5rem; }
    .hero-name-frame {
      width: 88vw;
      min-width: 0;
      max-width: 380px;
    }
    .event-strip { grid-template-columns:1fr; gap:0.75rem; }
    .event-card.left,
    .event-card.right { border-radius:18px; text-align:center; padding:1.2rem 1rem; }
    .event-heart { width:58px; height:58px; margin:-0.45rem auto; font-size:1.8rem; }
    .map-grid { grid-template-columns:1fr; }
  }
`;

// ── Scroll Reveal Hook ─────────────────────────────────────
function useReveal(options = {}) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { el.classList.add("visible"); obs.disconnect(); }
    }, { threshold: 0.15, ...options });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

// ── Petals ─────────────────────────────────────────────────
const PETAL_COLS = ["#F4AABF","#FAD9E3","#EE7A9B","#F7C8D4","#FBEAF0","#F0C0D0"];
function Petals() {
  const items = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left:     `${Math.random() * 100}%`,
    color:    PETAL_COLS[i % PETAL_COLS.length],
    delay:    `${Math.random() * 7}s`,
    duration: `${5 + Math.random() * 7}s`,
    w:        `${8 + Math.random() * 8}px`,
    rot:      `${Math.random() * 360}deg`,
  }));
  return (
    <>
      {items.map(p => (
        <div key={p.id} className="petal" style={{
          left: p.left, top: `-30px`,
          width: p.w, height: `calc(${p.w} * 1.45)`,
          background: p.color,
          animationDelay: p.delay, animationDuration: p.duration,
          transform: `rotate(${p.rot})`,
        }} />
      ))}
    </>
  );
}

// ── Invitation Overlay ─────────────────────────────────────
// phases: idle → flipping → flipped → opening → open → zooming
function InvitationOverlay({ groom, bride, guestName, onEnter }) {
  const [phase, setPhase] = useState('idle');

  const guests = guestName
    ? guestName.split(",").map(s => s.trim()).filter(Boolean)
    : [];
  const guestLabel = guests.length === 0 ? null
    : guests.length === 1 ? guests[0]
    : `${guests[0]} & ${guests[1]}`;

  const trigger = () => {
    if (phase !== 'idle') return;
    setPhase('flipping');
    setTimeout(() => {
      setPhase('flipped');
      setTimeout(() => {
        setPhase('opening');
        setTimeout(() => {
          setPhase('open');
          setTimeout(() => {
            setPhase('zooming');
            setTimeout(onEnter, 320);
          }, 500);
        }, 540);
      }, 90);
    }, 720);
  };

  const isFlipped  = phase !== 'idle';
  const flapOpen   = ['opening', 'open', 'zooming'].includes(phase);
  const letterUp   = ['open', 'zooming'].includes(phase);
  const isZooming  = phase === 'zooming';
  const frontPhaseClass = phase === 'opening'
    ? ' is-opening'
    : phase === 'open'
      ? ' is-open'
      : phase === 'zooming'
        ? ' is-open is-zooming'
        : '';

  return (
    <div className={`inv-overlay${isZooming ? ' out' : ''}`}>
      <Petals />
      <div className="inv-scene">
        <p className="inv-pre">You are cordially invited to the wedding of</p>
        <p className="inv-couple">{bride} &amp; {groom}</p>

        {guestLabel && (
          <div className="inv-dear">
            <p className="inv-dear-label">Dear</p>
            <p className="inv-dear-name">{guestLabel}</p>
          </div>
        )}

        <div className="env-wrap" onClick={trigger} role="button" aria-label="Open invitation envelope">
          <div className={`env-flipper${isFlipped ? ' is-flipped' : ''}`}>

            {/* ── BACK FACE (shown initially) ── */}
            <div className="env-face env-back">
              <div className="env-back-floral" aria-hidden="true">
                <span className="fl-stem" />
                <span className="fl-bloom" />
                <span className="fl-leaf" />
              </div>
              <div className="env-return">
                <span>From</span>
                <span>{bride} &amp; {groom}</span>
              </div>
              <div className="env-back-names">
                <p className="env-back-name">{bride}</p>
                <span className="env-back-amp">&amp;</span>
                <p className="env-back-name">{groom}</p>
              </div>
            </div>

            {/* ── FRONT FACE (after Y-flip) ── */}
            <div className={`env-face env-front${frontPhaseClass}`}>
              <div className="env-front-body">
                <div className="env-inside" />
                <div className="env-side-l" />
                <div className="env-side-r" />
                <div className="env-btm" />
                <div className="env-front-floral" aria-hidden="true">
                  <span className="fl-stem" />
                  <span className="fl-bloom" />
                  <span className="fl-leaf" />
                </div>
                <div className="env-front-floral right" aria-hidden="true">
                  <span className="fl-stem" />
                  <span className="fl-bloom" />
                  <span className="fl-leaf" />
                </div>
              </div>

              {/* Top flap that opens */}
              <div className={`env-flap-wrap${flapOpen ? ' is-open' : ''}`}>
                <div className="env-flap-out" />
                <div className="env-flap-in" />
              </div>

              {/* Wax seal */}
              <div className={`env-seal${flapOpen ? ' gone' : ''}`}>♥</div>

              {/* Mini invite card / letter */}
              <div className={`env-letter-wrap${letterUp ? ' is-up' : ''}${isZooming ? ' is-zoom' : ''}`}>
                <div className="env-letter-card">
                  <div className="lc-petals">✿ ✾ ✿</div>
                  <div className="lc-eyebrow">The Wedding of</div>
                  <div className="lc-names">{bride} <span>&amp;</span> {groom}</div>
                  <div className="lc-divider" />
                  <div className="lc-date">Saturday · 28 February 2026</div>
                  <div className="lc-venue">Plataran Menteng, Jakarta</div>
                  <div className="lc-petals" style={{transform:'rotate(180deg)'}}>✿ ✾ ✿</div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {phase === 'idle' && (
          <>
            <p className="inv-hint">tap the envelope to open</p>
            <button className="inv-btn" onClick={trigger}>Open Invitation</button>
          </>
        )}
      </div>
    </div>
  );
}

// ── Countdown ──────────────────────────────────────────────
function Countdown({ targetDate }) {
  const [t, setT] = useState({ d:0, h:0, m:0, s:0 });
  const ref = useReveal();
  useEffect(() => {
    const tick = () => {
      const diff = new Date(targetDate) - new Date();
      if (diff <= 0) return;
      setT({ d:Math.floor(diff/86400000), h:Math.floor((diff%86400000)/3600000), m:Math.floor((diff%3600000)/60000), s:Math.floor((diff%60000)/1000) });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  const units = [{ v:t.d, l:"Days" },{ v:t.h, l:"Hours" },{ v:t.m, l:"Minutes" },{ v:t.s, l:"Seconds" }];
  return (
    <div className="cds reveal" ref={ref}>
      <p className="sey">counting down to forever</p>
      <div className="cdg">
        {units.map((u, i) => (
          <>
            {i > 0 && <span className="cdsep" key={`sp${i}`}>·</span>}
            <div className="cdu" key={u.l}>
              <span className="cdn">{String(u.v).padStart(2,"0")}</span>
              <span className="cdl">{u.l}</span>
            </div>
          </>
        ))}
      </div>
    </div>
  );
}

// ── Event Strip ────────────────────────────────────────────
function EventStrip({ events, dateText, settlementVenue, receptionVenue }) {
  return (
    <div className="event-strip">
      <div className="event-card left">
        <p className="event-title">{events.settlement.title}</p>
        <p className="event-line">{dateText}</p>
        <p className="event-line">{events.settlement.time}</p>
        <p className="event-venue">{settlementVenue.name}</p>
      </div>
      <div className="event-heart">♥</div>
      <div className="event-card right">
        <p className="event-title">{events.reception.title}</p>
        <p className="event-line">{dateText}</p>
        <p className="event-line">{events.reception.time}</p>
        <p className="event-venue">{receptionVenue.name}</p>
      </div>
    </div>
  );
}

// ── Notes Section ──────────────────────────────────────────
function NotesSection({ verse, verse2 }) {
  const ref = useReveal();
  return (
    <section className="notes-sec">
      <div className="notes-inner reveal" ref={ref}>
        <div className="verse-block">
          <span className="verse-ql">"</span>
          <p className="verse-text">{verse.text}</p>
          <span className="verse-ref">— {verse.reference}</span>
        </div>
        <div className="verse-block">
          <span className="verse-ql">"</span>
          <p className="verse-text">{verse2.text}</p>
          <span className="verse-ref">— {verse2.reference}</span>
        </div>
      </div>
    </section>
  );
}

// ── Gallery ────────────────────────────────────────────────
function GallerySection({ photos }) {
  const [lb, setLb] = useState(null);
  const hRef = useReveal();
  return (
    <section className="gal-sec pink-bg" id="gallery">
      <div className="sh reveal" ref={hRef}>
        <p className="sey">our story</p>
        <h2 className="st">Moments Together</h2>
        <div className="sl" />
      </div>
      <div className="gal-grid">
        {photos.map((p, i) => (
          <div className={`gal-item reveal d${Math.min(i + 1, 6)}`} key={i} onClick={() => setLb(p)} role="button" aria-label={p.caption}>
            <img src={p.src} alt={p.caption} className="gal-img"
              onError={e => { e.target.style.display="none"; e.target.nextSibling.style.display="flex"; }} />
            <div className="gal-ph" style={{ display:"none", position:"absolute", inset:0 }}>
              <svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
              <span>{p.caption}</span>
            </div>
            <div className="gal-ov"><span className="gal-cap">{p.caption}</span></div>
          </div>
        ))}
      </div>
      {lb && (
        <div className="lb" onClick={() => setLb(null)}>
          <img src={lb.src} alt={lb.caption} className="lb-img" />
          <button className="lb-cls" onClick={() => setLb(null)}>✕</button>
          <span className="lb-cap">{lb.caption}</span>
        </div>
      )}
    </section>
  );
}

function MapCard({ kind, venue }) {
  const ref = useReveal();
  const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venue.name + " " + venue.address)}`;
  return (
    <div className="map-wr reveal" ref={ref}>
      <div className="map-inf">
        <div>
          <p className="map-kind">{kind}</p>
          <p className="map-vn">{venue.name}</p>
          <p className="map-ad">{venue.address}</p>
        </div>
        <a href={url} target="_blank" rel="noopener noreferrer" className="map-cta">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          Get Directions
        </a>
      </div>
      <iframe className="map-fr" src={venue.embedUrl} allowFullScreen="" loading="lazy" title={`${kind} location`} />
    </div>
  );
}

// ── Map ────────────────────────────────────────────────────
function MapSection({ settlementVenue, receptionVenue }) {
  const hRef = useReveal();
  return (
    <section className="map-sec" id="location">
      <div className="sh reveal" ref={hRef}>
        <p className="sey">join us</p>
        <h2 className="st">Location</h2>
        <div className="sl" />
      </div>
      <div className="map-grid">
        <MapCard kind="Marriage Settlement" venue={settlementVenue} />
        <MapCard kind="Reception" venue={receptionVenue} />
      </div>
    </section>
  );
}

// ── Digital Envelope ───────────────────────────────────────
function DigitalEnvelopeSection({ accounts }) {
  const [copied, setCopied] = useState({});
  const hRef = useReveal();
  const copy = (text, key) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(c => ({ ...c, [key]: true }));
      setTimeout(() => setCopied(c => ({ ...c, [key]: false })), 2200);
    });
  };
  return (
    <section className="gift-sec pink-bg" id="gift">
      <div className="sh reveal" ref={hRef}>
        <p className="sey">your generous blessing</p>
        <h2 className="st">Wedding Gift</h2>
        <div className="sl" />
        <p className="gift-sub">
          Your presence is already our greatest gift. But if you'd like to bless us further,<br />
          you may scan the QR below or copy the account number.
        </p>
      </div>
      <div className="gift-grid">
        {accounts.map((acc, i) => (
          <div className={`gift-card reveal d${i + 1}`} key={i}>
            <p className="gift-person">{acc.name}</p>
            <p className="gift-bank">{acc.bank}</p>
            <div className="gift-qr">
              <img src={acc.qrSrc} alt={`QR Code for ${acc.name}`}
                onError={e => { e.target.style.display="none"; e.target.nextSibling.style.display="flex"; }} />
              <div className="gift-qr-ph" style={{ display:"none" }}>
                <svg viewBox="0 0 24 24">
                  <rect x="3" y="3" width="7" height="7"/>
                  <rect x="14" y="3" width="7" height="7"/>
                  <rect x="3" y="14" width="7" height="7"/>
                  <rect x="14" y="14" width="3" height="3"/>
                  <rect x="19" y="14" width="2" height="2"/>
                  <rect x="14" y="19" width="2" height="2"/>
                  <rect x="18" y="18" width="3" height="3"/>
                </svg>
                <span>Place your QR<br/>image here</span>
              </div>
            </div>
            <p className="gift-acc">{acc.accountName}</p>
            <p className="gift-accn">{acc.bank} · {acc.accountNumber}</p>
            <button className="gift-copy" onClick={() => copy(acc.accountNumber, i)}>
              {copied[i] ? "✓ Copied!" : "Copy Number"}
            </button>
          </div>
        ))}
      </div>
      <p className="gift-note">"And whatever good you put forward for yourselves — you will find it with Allah." — QS. Al-Baqarah : 110</p>
    </section>
  );
}

// ── Wishes ─────────────────────────────────────────────────
const SAMPLE_WISHES = [
  { name:"Siti Rahma",  from:"Jakarta",  message:"Semoga pernikahan kalian penuh dengan kebahagiaan, cinta, dan berkah selamanya. Selamat menempuh hidup baru!" },
  { name:"Budi & Dewi", from:"Bandung",  message:"Wishing you both a lifetime of love and laughter. May your journey together be filled with beautiful moments." },
  { name:"Anisa Putri", from:"Surabaya", message:"Congratulations to the most beautiful couple! May your love story be the greatest adventure of your lives." },
];

function WishesSection() {
  const [wishes,  setWishes]  = useState(SAMPLE_WISHES);
  const [form,    setForm]    = useState({ name:"", from:"", message:"" });
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = () => {
    if (!form.name.trim() || !form.message.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setWishes([{ ...form }, ...wishes]);
      setForm({ name:"", from:"", message:"" });
      setSuccess(true); setLoading(false);
      setTimeout(() => setSuccess(false), 3000);
    }, 600);
  };

  const hRef = useReveal();
  const fRef = useReveal();
  const lRef = useReveal();
  return (
    <section className="wis-sec pink-bg" id="wishes">
      <div className="sh reveal" ref={hRef}>
        <p className="sey">your love & blessings</p>
        <h2 className="st">Send Your Wishes</h2>
        <div className="sl" />
      </div>
      <div className="wis-lay">
        <div className="wis-form reveal-left" ref={fRef}>
          {success ? (
            <div className="fok">🌸 Thank you for your beautiful wishes!</div>
          ) : (
            <>
              <div className="fg"><label className="fl">Your Name</label><input className="fi" type="text" placeholder="Enter your name" value={form.name} onChange={e => setForm({...form,name:e.target.value})} /></div>
              <div className="fg"><label className="fl">From (City / Country)</label><input className="fi" type="text" placeholder="e.g. Jakarta, Indonesia" value={form.from} onChange={e => setForm({...form,from:e.target.value})} /></div>
              <div className="fg"><label className="fl">Your Message</label><textarea className="fta" placeholder="Write your heartfelt wishes..." value={form.message} onChange={e => setForm({...form,message:e.target.value})} /></div>
              <button className="fsub" onClick={submit} disabled={loading || !form.name.trim() || !form.message.trim()}>
                {loading ? "Sending..." : "Send Wishes ✦"}
              </button>
            </>
          )}
        </div>
        <div className="wis-feed reveal-right" ref={lRef}>
          {wishes.map((w,i) => (
            <div className="wc" key={i}>
              <div className="wch">
                <div className="wca">{w.name.charAt(0).toUpperCase()}</div>
                <div><p className="wcn">{w.name}</p>{w.from && <p className="wcf">from {w.from}</p>}</div>
              </div>
              <p className="wcm">"{w.message}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Music Player ───────────────────────────────────────────
function MusicPlayer({ src, autoplay }) {
  const ref = useRef(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!ref.current || !autoplay) return;
    const go = () => ref.current.play().then(() => setPlaying(true)).catch(() => {});
    document.addEventListener("click", go, { once: true });
    return () => document.removeEventListener("click", go);
  }, [autoplay]);

  const toggle = () => {
    if (!ref.current) return;
    if (playing) { ref.current.pause(); setPlaying(false); }
    else ref.current.play().then(() => setPlaying(true));
  };

  return (
    <div className="mp">
      <audio ref={ref} src={src} loop />
      <button className="mpb" onClick={toggle} aria-label={playing ? "Pause" : "Play"}>
        {playing && <span className="mpr" />}
        {playing
          ? <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>
          : <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>
        }
      </button>
    </div>
  );
}

// ── Root Export ────────────────────────────────────────────
export default function WeddingWebsite({ guestName }) {
  const [showSite, setShowSite] = useState(false);

  const resolved = (() => {
    if (guestName) return guestName;
    try { return new URLSearchParams(window.location.search).get("to") || ""; }
    catch { return ""; }
  })();

  const { groom, bride, weddingDate, weddingTime, venue, receptionVenue, events, music, gallery, verse, verse2, digitalEnvelope } = CONFIG;
  const formattedDate = new Date(weddingDate).toLocaleDateString("en-US", { weekday:"long", year:"numeric", month:"long", day:"numeric" });

  // Global reveal for dynamically-rendered items (gallery cards, gift cards)
  useEffect(() => {
    if (!showSite) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("visible"); obs.unobserve(e.target); } });
    }, { threshold: 0.12 });
    const refresh = () => document.querySelectorAll(".reveal, .reveal-left, .reveal-right, .reveal-scale").forEach(el => obs.observe(el));
    refresh();
    const t = setTimeout(refresh, 300);
    return () => { obs.disconnect(); clearTimeout(t); };
  }, [showSite]);

  return (
    <>
      <style>{css}</style>

      {!showSite && (
        <InvitationOverlay
          groom={groom} bride={bride}
          guestName={resolved}
          onEnter={() => setShowSite(true)}
        />
      )}

      {showSite && (
        <>
          <nav>
            <span className="nav-brand">C&amp;W</span>
            <ul className="nav-links">
              <li><a href="#gallery">Gallery</a></li>
              <li><a href="#location">Location</a></li>
              <li><a href="#gift">Gift</a></li>
              <li><a href="#wishes">Wishes</a></li>
            </ul>
          </nav>

          <section className="hero pink-bg">
            <p className="hero-eyebrow">We're getting married</p>
            <div className="hero-name-frame">
              <div className="hero-name-center">
                <h1 className="hero-names">
                  {bride}
                  <span className="hero-amp">&amp;</span>
                  {groom}
                </h1>
              </div>
            </div>
            <div className="hero-divider" />
            <p className="hero-date">{formattedDate}</p>
            <EventStrip
              events={events}
              dateText={formattedDate}
              settlementVenue={venue}
              receptionVenue={receptionVenue}
            />

            <div className="scroll-hint"><div className="scroll-dot" /></div>
          </section>

          <NotesSection verse={verse} verse2={verse2} />
          <Countdown targetDate={`${weddingDate}T${weddingTime}:00+07:00`} />
          <GallerySection photos={gallery} />
          <MapSection settlementVenue={venue} receptionVenue={receptionVenue} />
          <DigitalEnvelopeSection accounts={digitalEnvelope.accounts} />
          <WishesSection />

          <footer>
            <p className="ft-n">{bride} &amp; {groom}</p>
            <p className="ft-s">Together forever · {new Date(weddingDate).getFullYear()}</p>
          </footer>

          <MusicPlayer src={music.src} autoplay={music.autoplay} />
        </>
      )}
    </>
  );
}
