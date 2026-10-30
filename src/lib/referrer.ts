export function parseReferrer(refererHeader: string | null | undefined): string {
  if (!refererHeader) return 'direct';
  
  const lowerRef = refererHeader.toLowerCase();

  if (lowerRef.includes('t.co') || lowerRef.includes('x.com') || lowerRef.includes('twitter.com')) {
    return 'x';
  }
  if (lowerRef.includes('google.')) return 'google';
  if (lowerRef.includes('substack.com')) return 'substack';
  if (lowerRef.includes('instagram.com')) return 'instagram';
  if (lowerRef.includes('youtube.com')) return 'youtube';
  if (lowerRef.includes('github.com')) return 'github';
  if (lowerRef.includes('linkedin.com')) return 'linkedin';
  if (lowerRef.includes('facebook.com')) return 'facebook';
  if (lowerRef.includes('discord.gg') || lowerRef.includes('discord.com')) return 'discord';
  if (lowerRef.includes('t.me')) return 'telegram';
  if (lowerRef.includes('medium.com')) return 'medium';
  if (lowerRef.includes('reddit.com')) return 'reddit';

  return 'other';
}
