"use client";

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function ClickSoundProvider() {
  const pathname = usePathname();
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioBufferRef = useRef<AudioBuffer | null>(null);

  useEffect(() => {
    // Avoid loading or playing audio on admin pages
    if (pathname?.startsWith('/admin')) {
      return;
    }

    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    let ctx = audioContextRef.current;
    if (!ctx) {
      ctx = new AudioContextClass();
      audioContextRef.current = ctx;
    }

    // Preload click sound buffer
    fetch('/universfield-computer-mouse-click-352734.mp3')
      .then(res => res.arrayBuffer())
      .then(ab => ctx?.decodeAudioData(ab))
      .then(decoded => {
        audioBufferRef.current = decoded || null;
      })
      .catch((err) => {
        console.error('Failed to load click sound:', err);
      });

    const playClick = async () => {
      try {
        let currentCtx = audioContextRef.current;
        if (!currentCtx) {
          currentCtx = new AudioContextClass();
          audioContextRef.current = currentCtx;
        }

        if (currentCtx.state === 'suspended') {
          await currentCtx.resume().catch(() => {});
        }

        const buffer = audioBufferRef.current;
        if (!buffer) {
          const res = await fetch('/universfield-computer-mouse-click-352734.mp3');
          const ab = await res.arrayBuffer();
          const decoded = await currentCtx.decodeAudioData(ab);
          audioBufferRef.current = decoded;
          playBuffer(currentCtx, decoded);
        } else {
          playBuffer(currentCtx, buffer);
        }
      } catch (err) {
        console.error('Click sound play error:', err);
      }
    };

    const playBuffer = (c: AudioContext, b: AudioBuffer) => {
      try {
        const source = c.createBufferSource();
        const gainNode = c.createGain();
        source.buffer = b;
        gainNode.gain.value = 0.5;
        source.connect(gainNode);
        gainNode.connect(c.destination);
        source.start(0);
      } catch (err) {
        console.error('Playback error:', err);
      }
    };

    const isInteractive = (el: HTMLElement | null): boolean => {
      if (!el) return false;
      let curr: HTMLElement | null = el;
      while (curr && curr !== document.body && curr !== document.documentElement) {
        const tag = curr.tagName;
        if (
          tag === 'A' ||
          tag === 'BUTTON' ||
          tag === 'INPUT' ||
          tag === 'SELECT' ||
          tag === 'TEXTAREA' ||
          tag === 'SUMMARY' ||
          curr.getAttribute('role') === 'button' ||
          curr.getAttribute('role') === 'tab' ||
          curr.getAttribute('role') === 'link' ||
          curr.hasAttribute('onclick') ||
          curr.classList.contains('cursor-pointer') ||
          window.getComputedStyle(curr).cursor === 'pointer'
        ) {
          return true;
        }
        curr = curr.parentElement;
      }
      return false;
    };

    let lastPlayTime = 0;

    const handlePointerDown = (e: MouseEvent | PointerEvent | TouchEvent) => {
      const now = Date.now();
      if (now - lastPlayTime < 60) return; // Prevent duplicate triggers

      const target = e.target as HTMLElement | null;
      if (!target) return;

      if (isInteractive(target)) {
        lastPlayTime = now;
        playClick();
      }
    };

    window.addEventListener('pointerdown', handlePointerDown, { capture: true, passive: true });

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown, { capture: true });
    };
  }, [pathname]);

  return null;
}
