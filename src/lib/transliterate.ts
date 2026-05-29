const CONSONANTS: Record<string, string> = {
  'क': 'k', 'ख': 'kh', 'ग': 'g', 'घ': 'gh', 'ङ': 'ng',
  'च': 'ch', 'छ': 'chh', 'ज': 'j', 'झ': 'jh', 'ञ': 'ny',
  'ट': 't', 'ठ': 'th', 'ड': 'd', 'ढ': 'dh', 'ण': 'n',
  'त': 't', 'थ': 'th', 'द': 'd', 'ध': 'dh', 'न': 'n',
  'प': 'p', 'फ': 'ph', 'ब': 'b', 'भ': 'bh', 'म': 'm',
  'य': 'y', 'र': 'r', 'ल': 'l', 'व': 'v',
  'श': 'sh', 'ष': 'sh', 'स': 's', 'ह': 'h',
};

const NUKTA_OVERRIDES: Record<string, string> = {
  'क': 'q', 'ख': 'kh', 'ग': 'gh', 'ज': 'z', 'फ': 'f', 'ड': 'r', 'ढ': 'rh',
};

const VOWELS: Record<string, string> = {
  'अ': 'a', 'आ': 'a', 'इ': 'i', 'ई': 'i', 'उ': 'u', 'ऊ': 'u',
  'ए': 'e', 'ऐ': 'ai', 'ओ': 'o', 'औ': 'au', 'ऋ': 'ri',
};

const MATRAS: Record<string, string> = {
  'ा': 'a', 'ि': 'i', 'ी': 'i', 'ु': 'u', 'ू': 'u',
  'े': 'e', 'ै': 'ai', 'ो': 'o', 'ौ': 'au', 'ृ': 'ri',
};

const DIGITS: Record<string, string> = {
  '०': '0', '१': '1', '२': '2', '३': '3', '४': '4',
  '५': '5', '६': '6', '७': '7', '८': '8', '९': '9',
};

const HALANT = '्';
const NUKTA = '़';
const ANUSVARA = 'ं';
const CHANDRABINDU = 'ँ';
const VISARGA = 'ः';

export function devanagariToRoman(text: string): string {
  if (!/[ऀ-ॿ]/.test(text)) return text;

  let result = '';
  let i = 0;

  while (i < text.length) {
    const char = text[i];

    if (DIGITS[char]) {
      result += DIGITS[char];
      i++;
      continue;
    }

    if (VOWELS[char]) {
      result += VOWELS[char];
      i++;
      continue;
    }

    if (CONSONANTS[char]) {
      if (text[i + 1] === NUKTA && NUKTA_OVERRIDES[char]) {
        result += NUKTA_OVERRIDES[char];
        i += 2;
      } else {
        result += CONSONANTS[char];
        i++;
      }

      if (i >= text.length) break;

      if (text[i] === HALANT) {
        i++;
      } else if (MATRAS[text[i]]) {
        result += MATRAS[text[i]];
        i++;
      } else if (text[i] !== ANUSVARA && text[i] !== CHANDRABINDU && text[i] !== VISARGA) {
        result += 'a';
      }
      continue;
    }

    if (char === ANUSVARA || char === CHANDRABINDU) {
      result += 'n';
      i++;
      continue;
    }

    if (char === VISARGA) {
      result += 'h';
      i++;
      continue;
    }

    if (char === NUKTA || char === HALANT) {
      i++;
      continue;
    }

    if (MATRAS[char]) {
      result += MATRAS[char];
      i++;
      continue;
    }

    result += char;
    i++;
  }

  return result;
}
