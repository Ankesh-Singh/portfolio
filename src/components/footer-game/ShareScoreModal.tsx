"use client";

import { useState } from 'react';
import Image from 'next/image';
import { FaXTwitter } from 'react-icons/fa6';
import { Check, Copy, X, Trophy, Sparkles, Download } from 'lucide-react';
import { showToast } from '@/components/Toast';

interface ShareScoreModalProps {
  score: number;
  highScore: number;
  isOpen: boolean;
  onClose: () => void;
}

export function ShareScoreModal({
  score,
  highScore,
  isOpen,
  onClose,
}: ShareScoreModalProps) {
  const [copied, setCopied] = useState(false);
  const [isGeneratingImg, setIsGeneratingImg] = useState(false);

  if (!isOpen) return null;

  const siteUrl = 'https://aash7.xyz';
  const isNewRecord = score >= highScore && score > 0;

  const twitterText = `🎮 Just played Bunny Run on Ashirwad's portfolio! 🐰⚡\n\n🏆 Score: ${score} pts\nCan you beat my high score? 👇\n${siteUrl}`;
  const twitterIntentUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    twitterText
  )}`;

  const fullScoreText = `🎮 Bunny Run — Ashirwad Singh Portfolio\n🏆 Score: ${score} pts 🐰\nTry to beat my score: ${siteUrl}`;

  const handleCopyScoreCard = async () => {
    try {
      await navigator.clipboard.writeText(fullScoreText);
      setCopied(true);
      showToast('Scorecard copied to clipboard!');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      showToast('Failed to copy', 'error');
    }
  };

  const handleDownloadScoreCard = () => {
    setIsGeneratingImg(true);
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 630;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setIsGeneratingImg(false);
      return;
    }

    const bgImg = new window.Image();
    bgImg.crossOrigin = 'anonymous';
    bgImg.src = '/open-graph.png';

    const bunnyImg = new window.Image();
    bunnyImg.crossOrigin = 'anonymous';
    bunnyImg.src = '/games/bunny.png';

    let loadedCount = 0;
    const onAssetLoad = () => {
      loadedCount++;
      if (loadedCount < 2) return;

      // 1. Draw Background OpenGraph Image
      ctx.drawImage(bgImg, 0, 0, 1200, 630);

      // Subtle bottom gradient vignette for text contrast
      const gradient = ctx.createLinearGradient(0, 350, 0, 630);
      gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0.7)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 1200, 630);

      // 2. Draw Bottom Left: BUNNY RUNNER & Score
      ctx.save();
      // "BUNNY RUNNER" label
      ctx.fillStyle = '#a1a1aa';
      ctx.font = 'bold 26px monospace';
      ctx.fillText('✦  BUNNY RUNNER', 60, 500);

      // Score (e.g. 31)
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 68px sans-serif';
      const scoreStr = score.toLocaleString();
      ctx.fillText(scoreStr, 60, 570);

      const scoreWidth = ctx.measureText(scoreStr).width;

      // "PTS" suffix
      ctx.fillStyle = '#84cc16';
      ctx.font = 'bold 34px sans-serif';
      ctx.fillText('PTS', 60 + scoreWidth + 16, 568);
      ctx.restore();

      // 3. Draw Bottom Right: Circular Bunny Avatar with Green Ring
      const avatarRadius = 55;
      const avatarX = 1140 - avatarRadius - 20;
      const avatarY = 570 - avatarRadius;

      ctx.save();
      // Outer green ring
      ctx.strokeStyle = '#84cc16';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(avatarX, avatarY, avatarRadius + 3, 0, Math.PI * 2);
      ctx.stroke();

      // Clip circle for avatar
      ctx.beginPath();
      ctx.arc(avatarX, avatarY, avatarRadius, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(
        bunnyImg,
        avatarX - avatarRadius,
        avatarY - avatarRadius,
        avatarRadius * 2,
        avatarRadius * 2
      );
      ctx.restore();

      // Download snapshot
      const link = document.createElement('a');
      link.download = `bunny-runner-score-${score}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      setIsGeneratingImg(false);
      showToast('Scorecard image downloaded!');
    };

    bgImg.onload = onAssetLoad;
    bunnyImg.onload = onAssetLoad;

    bgImg.onerror = () => {
      setIsGeneratingImg(false);
      handleCopyScoreCard();
    };
    bunnyImg.onerror = () => {
      setIsGeneratingImg(false);
      handleCopyScoreCard();
    };
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-sm bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 rounded-2xl p-5 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-lime-500/10 text-lime-600 dark:text-lime-400 border border-lime-500/20 text-xs font-semibold">
            <Trophy size={13} />
            <span>{isNewRecord ? 'New High Score Record!' : 'Game Finished'}</span>
          </div>
          <h3 className="text-lg font-bold text-neutral-900 dark:text-white">Share Your Score</h3>
        </div>

        {/* Exact Premium Share Card Preview */}
        <div className="relative overflow-hidden rounded-2xl border border-neutral-200 dark:border-zinc-800/90 bg-neutral-950 text-white shadow-lg">
          <div className="relative aspect-[1200/630] w-full">
            <Image
              src="/open-graph.png"
              alt="Ashirwad Singh Portfolio"
              fill
              className="object-cover"
            />
            {/* Soft gradient bottom shading */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Bottom Content Overlay */}
            <div className="absolute inset-x-4 bottom-4 flex items-end justify-between">
              <div>
                <p className="text-[11px] text-zinc-400 font-mono flex items-center gap-1">
                  <Sparkles size={12} className="text-lime-500 fill-lime-500" />
                  <span>BUNNY RUNNER</span>
                </p>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="text-2xl font-black text-white font-mono tracking-tight">
                    {score.toLocaleString()}
                  </span>
                  <span className="text-xs font-bold text-lime-500 font-mono">
                    PTS
                  </span>
                </div>
              </div>

              {/* Bunny Avatar with Green Ring */}
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-lime-500 relative shrink-0 shadow-md">
                <Image
                  src="/games/bunny.png"
                  alt="Bunny"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-1">
          <a
            href={twitterIntentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-2.5 px-4 bg-black dark:bg-white text-white dark:text-black font-medium text-xs rounded-xl hover:opacity-90 transition-opacity w-full shadow-sm"
          >
            <FaXTwitter size={15} />
            <span>Share on X</span>
          </a>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleCopyScoreCard}
              className="flex items-center justify-center gap-2 py-2.5 px-3 bg-neutral-100 dark:bg-zinc-800 text-neutral-800 dark:text-neutral-200 font-medium text-xs rounded-xl hover:bg-neutral-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer border border-neutral-200 dark:border-zinc-700"
            >
              {copied ? <Check size={14} className="text-lime-500" /> : <Copy size={14} />}
              <span>{copied ? 'Copied!' : 'Copy Score'}</span>
            </button>

            <button
              onClick={handleDownloadScoreCard}
              disabled={isGeneratingImg}
              className="flex items-center justify-center gap-2 py-2.5 px-3 bg-neutral-100 dark:bg-zinc-800 text-neutral-800 dark:text-neutral-200 font-medium text-xs rounded-xl hover:bg-neutral-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer border border-neutral-200 dark:border-zinc-700 disabled:opacity-50"
            >
              <Download size={14} />
              <span>Save Card</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ShareScoreModal;
