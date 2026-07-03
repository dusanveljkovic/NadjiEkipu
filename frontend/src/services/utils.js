//
// Napisao Dusan Veljkovic 2023/0417
//
const HOBBY_COLORS = [
  { bg: "#EEEDFE", color: "#534AB7" },
  { bg: "#E1F5EE", color: "#0F6E56" },
  { bg: "#FAECE7", color: "#993C1D" },
  { bg: "#E6F1FB", color: "#185FA5" },
  { bg: "#FBEAF0", color: "#993556" },
  { bg: "#FAEEDA", color: "#854F0B" },
  { bg: "#EAF3DE", color: "#3B6D11" },
  { bg: "#FCEBEB", color: "#A32D2D" },
];

const EMOJI_MAP = {
  1: '⚽', 2: '🏀', 3: '🎾', 4: '🏊', 5: '🏃',
  6: '🧘', 7: '🚴', 8: '🏔️', 9: '♟️', 10: '📸',
  11: '🍳', 12: '💃', 13: '🎮', 14: '📚', 15: '🎨'
};

export function getInterestAvatar(interest) {
  return EMOJI_MAP[interest.avatar_id]
}
export function getRandomColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return HOBBY_COLORS[Math.abs(hash) % HOBBY_COLORS.length];
}

export function formatCount(n) {
  return n >= 1000 ? (n / 1000).toFixed(1).replace(".0", "") + "k" : String(n);
}
