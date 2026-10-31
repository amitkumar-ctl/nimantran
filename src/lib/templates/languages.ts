/*
 * Languages and wedding traditions. A styled design is (look × tradition ×
 * colours); the tradition decides the language of the top line, the
 * ceremonies a new invite starts with and the sample names and venue.
 *
 * Wording is kept short and conventional: the opening line a printed card in
 * that language would carry, a word for "programme of functions", and a
 * welcome line shown under the RSVP heading.
 */
import type { EventSet } from './types';

export type LangCode = 'en' | 'hi' | 'mr' | 'gu' | 'pa' | 'bn' | 'as' | 'or' | 'ta' | 'te' | 'kn' | 'ml' | 'ur';

export type Language = {
  code: LangCode;
  name: string;
  /** The language's name in its own script (shown on the filter chips). */
  native: string;
  /** Heading word for the list of functions, in the language (English designs have none). */
  events?: string;
  /** A short welcome line under the RSVP heading. */
  welcome?: string;
  /** Respectful form of address before a family's name ("आदरणीय", "Respected"…). */
  salutation: string;
  /** "You and your family are cordially invited", for personal invites. */
  invited: string;
  /** Words people search for. */
  words: string[];
};

export const LANGUAGES: Language[] = [
  { code: 'en', name: 'English', native: 'English', salutation: 'Respected', invited: 'You and your family are cordially invited', words: ['english'] },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी', events: 'मांगलिक कार्यक्रम', welcome: 'आपकी उपस्थिति प्रार्थनीय है', salutation: 'आदरणीय', invited: 'आप सपरिवार सादर आमंत्रित हैं', words: ['hindi', 'devanagari'] },
  { code: 'mr', name: 'Marathi', native: 'मराठी', events: 'कार्यक्रम', welcome: 'आपली उपस्थिती प्रार्थनीय आहे', salutation: 'आदरणीय', invited: 'सहकुटुंब सहपरिवार आग्रहाचे निमंत्रण', words: ['marathi', 'maharashtrian'] },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી', events: 'શુભ પ્રસંગો', welcome: 'આપ સૌને ભાવભર્યું આમંત્રણ', salutation: 'આદરણીય', invited: 'આપ સૌને સહકુટુંબ ભાવભર્યું આમંત્રણ', words: ['gujarati'] },
  { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ', events: 'ਸਮਾਗਮ', welcome: 'ਜੀ ਆਇਆਂ ਨੂੰ', salutation: 'ਸਤਿਕਾਰਯੋਗ', invited: 'ਆਪ ਜੀ ਨੂੰ ਪਰਿਵਾਰ ਸਮੇਤ ਸਨਿਮਰ ਸੱਦਾ', words: ['punjabi', 'gurmukhi', 'sikh'] },
  { code: 'bn', name: 'Bengali', native: 'বাংলা', events: 'অনুষ্ঠান', welcome: 'আপনার উপস্থিতি একান্ত কাম্য', salutation: 'শ্রদ্ধেয়', invited: 'সপরিবারে আপনাদের সাদর আমন্ত্রণ', words: ['bengali', 'bangla'] },
  { code: 'as', name: 'Assamese', native: 'অসমীয়া', events: 'অনুষ্ঠানসূচী', welcome: 'সাদৰ নিমন্ত্ৰণ', salutation: 'শ্ৰদ্ধাৰ', invited: 'সপৰিয়ালে সাদৰ নিমন্ত্ৰণ', words: ['assamese', 'axomiya'] },
  { code: 'or', name: 'Odia', native: 'ଓଡ଼ିଆ', events: 'କାର୍ଯ୍ୟକ୍ରମ', welcome: 'ସାଦର ନିମନ୍ତ୍ରଣ', salutation: 'ଶ୍ରଦ୍ଧେୟ', invited: 'ସପରିବାର ସାଦର ନିମନ୍ତ୍ରଣ', words: ['odia', 'oriya'] },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்', events: 'நிகழ்ச்சிகள்', welcome: 'அனைவரும் வருக', salutation: 'மதிப்பிற்குரிய', invited: 'தங்களை குடும்பத்துடன் அன்புடன் அழைக்கிறோம்', words: ['tamil'] },
  { code: 'te', name: 'Telugu', native: 'తెలుగు', events: 'కార్యక్రమాలు', welcome: 'అందరికీ ఆహ్వానం', salutation: 'గౌరవనీయులైన', invited: 'సకుటుంబ సపరివార సమేతంగా ఆహ్వానిస్తున్నాము', words: ['telugu'] },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ', events: 'ಕಾರ್ಯಕ್ರಮಗಳು', welcome: 'ಆತ್ಮೀಯ ಸ್ವಾಗತ', salutation: 'ಗೌರವಾನ್ವಿತ', invited: 'ತಮಗೆ ಸಕುಟುಂಬ ಸಮೇತ ಆದರದ ಆಹ್ವಾನ', words: ['kannada'] },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം', events: 'ചടങ്ങുകൾ', welcome: 'ഏവർക്കും സ്വാഗതം', salutation: 'ബഹുമാനപ്പെട്ട', invited: 'കുടുംബസമേതം സ്നേഹപൂർവ്വം ക്ഷണിക്കുന്നു', words: ['malayalam', 'malayali', 'kerala'] },
  { code: 'ur', name: 'Urdu', native: 'اردو', events: 'تقریبات', welcome: 'آپ کی شرکت باعثِ مسرت ہوگی', salutation: 'محترم', invited: 'آپ کو مع اہل و عیال شرکت کی دعوت ہے', words: ['urdu'] },
];

const BY_CODE = new Map(LANGUAGES.map((l) => [l.code, l]));
export const getLanguage = (code: string | undefined) => BY_CODE.get(code as LangCode) ?? LANGUAGES[0];
export const isLangCode = (s: unknown): s is LangCode => typeof s === 'string' && BY_CODE.has(s as LangCode);

export type Culture = {
  id: string;
  /** Shown in design names: "Rajwada Indigo · Tamil". */
  name: string;
  lang: LangCode;
  events: EventSet;
  /** Top-line options; the first is the default. */
  blessings: string[];
  couples: [string, string][];
  places: [string, string][];
  words: string[];
};

export const CULTURES: Culture[] = [
  { id: 'hindu', name: 'Hindi', lang: 'hi', events: 'north', blessings: ['॥ शुभ विवाह ॥', '॥ श्री गणेशाय नमः ॥'],
    couples: [['Aarav', 'Meera'], ['Rohan', 'Isha'], ['Varun', 'Ananya']], places: [['Delhi', 'The Grand Lawns, New Delhi'], ['Lucknow', 'Taj Mahal Lucknow'], ['Varanasi', 'BrijRama Palace, Varanasi']],
    words: ['hindu', 'north indian', 'hindi', 'shaadi', 'vivah'] },
  { id: 'rajasthani', name: 'Rajasthani', lang: 'hi', events: 'north', blessings: ['॥ पधारो म्हारे देस ॥', '॥ श्री गणेशाय नमः ॥'],
    couples: [['Vikram', 'Gayatri'], ['Kunal', 'Aditi']], places: [['Jaipur', 'Rambagh Palace, Jaipur'], ['Udaipur', 'Lake Palace Gardens, Udaipur'], ['Jodhpur', 'Umaid Bhawan, Jodhpur']],
    words: ['rajasthani', 'marwari', 'royal', 'hindi', 'padharo'] },
  { id: 'punjabi', name: 'Punjabi', lang: 'pa', events: 'sikh', blessings: ['ੴ ਸਤਿ ਨਾਮੁ', 'ਅਨੰਦ ਕਾਰਜ'],
    couples: [['Jaskaran', 'Harleen'], ['Gurpreet', 'Simran'], ['Arjun', 'Navneet']], places: [['Amritsar', 'Hyatt Regency, Amritsar'], ['Chandigarh', 'The Lalit, Chandigarh'], ['Ludhiana', 'Park Plaza, Ludhiana']],
    words: ['punjabi', 'sikh', 'anand karaj', 'gurdwara', 'gurmukhi'] },
  { id: 'gujarati', name: 'Gujarati', lang: 'gu', events: 'gujarati', blessings: ['॥ શ્રી ગણેશાય નમઃ ॥', 'શુભ લગ્ન'],
    couples: [['Yash', 'Khushi'], ['Parth', 'Hetal']], places: [['Ahmedabad', 'Courtyard Lawns, Ahmedabad'], ['Vadodara', 'Laxmi Vilas Lawns, Vadodara'], ['Surat', 'Avadh Utopia, Surat']],
    words: ['gujarati', 'garba', 'dandiya', 'lagna'] },
  { id: 'marathi', name: 'Marathi', lang: 'mr', events: 'marathi', blessings: ['॥ शुभमंगल सावधान ॥', '॥ श्री गणेशाय नमः ॥'],
    couples: [['Aditya', 'Sayali'], ['Omkar', 'Mrunal']], places: [['Pune', 'Royal Lawns, Pune'], ['Mumbai', 'Shanmukhananda Hall, Mumbai'], ['Nashik', 'Grape County, Nashik']],
    words: ['marathi', 'maharashtrian', 'lagna', 'shubhmangal'] },
  { id: 'bengali', name: 'Bengali', lang: 'bn', events: 'bengali', blessings: ['শুভ বিবাহ', 'শ্রী শ্রী প্রজাপতয়ে নমঃ'],
    couples: [['Sourav', 'Priyanka'], ['Anirban', 'Tiyasha']], places: [['Kolkata', 'ITC Royal Bengal, Kolkata'], ['Shantiniketan', 'Mark & Meadows, Shantiniketan']],
    words: ['bengali', 'bangla', 'biye', 'sindoor'] },
  { id: 'assamese', name: 'Assamese', lang: 'as', events: 'assamese', blessings: ['শুভ বিবাহ'],
    couples: [['Bhaskar', 'Nilakshi'], ['Pranjal', 'Ankita']], places: [['Guwahati', 'Radisson Blu, Guwahati'], ['Jorhat', 'Heritage Lawn, Jorhat']],
    words: ['assamese', 'axomiya', 'biya', 'north east'] },
  { id: 'odia', name: 'Odia', lang: 'or', events: 'north', blessings: ['ଶୁଭ ବିବାହ', 'ଶ୍ରୀ ଜଗନ୍ନାଥ ସହାୟ'],
    couples: [['Ashutosh', 'Sradha'], ['Debasis', 'Ipsita']], places: [['Bhubaneswar', 'Mayfair Lagoon, Bhubaneswar'], ['Puri', 'Mayfair Heritage, Puri']],
    words: ['odia', 'oriya', 'odisha', 'jagannath'] },
  { id: 'tamil', name: 'Tamil', lang: 'ta', events: 'south', blessings: ['சுப முகூர்த்தம்', 'திருமண அழைப்பிதழ்'],
    couples: [['Arjun', 'Lakshmi'], ['Karthik', 'Divya']], places: [['Chennai', 'Sri Kalyana Mandapam, Chennai'], ['Madurai', 'Meenakshi Mahal, Madurai'], ['Coimbatore', 'Le Méridien, Coimbatore']],
    words: ['tamil', 'south indian', 'muhurtham', 'kalyanam'] },
  { id: 'telugu', name: 'Telugu', lang: 'te', events: 'telugu', blessings: ['శ్రీరస్తు శుభమస్తు', 'శుభ వివాహం'],
    couples: [['Sai', 'Keerthi'], ['Vamsi', 'Sravya']], places: [['Hyderabad', 'N Convention, Hyderabad'], ['Vijayawada', 'Murali Fortune, Vijayawada'], ['Visakhapatnam', 'Novotel, Visakhapatnam']],
    words: ['telugu', 'south indian', 'pelli', 'andhra', 'telangana'] },
  { id: 'kannada', name: 'Kannada', lang: 'kn', events: 'south', blessings: ['ಶುಭ ವಿವಾಹ', '॥ ಶ್ರೀ ಗಣೇಶಾಯ ನಮಃ ॥'],
    couples: [['Prajwal', 'Ananya'], ['Rakshith', 'Spoorthi']], places: [['Bengaluru', 'Palace Grounds, Bengaluru'], ['Mysuru', 'Lalitha Mahal, Mysuru'], ['Mangaluru', 'Goldfinch, Mangaluru']],
    words: ['kannada', 'south indian', 'karnataka', 'muhurtha'] },
  { id: 'malayali', name: 'Malayalam', lang: 'ml', events: 'south', blessings: ['ശുഭവിവാഹം', 'വിവാഹ ക്ഷണം'],
    couples: [['Vishnu', 'Gauri'], ['Nikhil', 'Anjana']], places: [['Kochi', 'Bolgatty Palace, Kochi'], ['Thrissur', 'Lulu Convention, Thrissur'], ['Thiruvananthapuram', 'Kovalam Lawns, Thiruvananthapuram']],
    words: ['malayali', 'malayalam', 'kerala', 'kasavu', 'south indian'] },
  { id: 'southern', name: 'South Indian', lang: 'en', events: 'south', blessings: ['Shubha Muhurtham', 'With the blessings of elders'],
    couples: [['Arjun', 'Lakshmi'], ['Rahul', 'Meenakshi']], places: [['Chennai', 'Sri Kalyana Mandapam, Chennai'], ['Bengaluru', 'Palace Grounds, Bengaluru'], ['Kochi', 'Bolgatty Palace, Kochi']],
    words: ['south indian', 'english', 'temple', 'muhurtham'] },
  { id: 'muslim', name: 'Urdu', lang: 'ur', events: 'nikah', blessings: ['بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ', 'نکاح مبارک'],
    couples: [['Arman', 'Zoya'], ['Rehan', 'Aisha']], places: [['Hyderabad', 'Taj Falaknuma, Hyderabad'], ['Lucknow', 'Awadh Banquets, Lucknow'], ['Bhopal', 'Noor-Us-Sabah Palace, Bhopal']],
    words: ['muslim', 'nikah', 'walima', 'islamic', 'urdu', 'bismillah'] },
  { id: 'nikah', name: 'Nikah', lang: 'en', events: 'nikah', blessings: ['Bismillah', 'Nikah Mubarak'],
    couples: [['Arman', 'Zoya'], ['Faizan', 'Sana']], places: [['Hyderabad', 'Taj Falaknuma, Hyderabad'], ['Mumbai', 'Sea Breeze Lawns, Mumbai']],
    words: ['muslim', 'nikah', 'walima', 'islamic', 'english'] },
  { id: 'christian', name: 'Christian', lang: 'en', events: 'christian', blessings: ['Holy Matrimony', 'Together with their families'],
    couples: [['Samuel', 'Grace'], ['Joel', 'Ruth']], places: [['Goa', 'Se Cathedral, Old Goa'], ['Kochi', 'St. Mary’s Church, Kochi'], ['Shillong', 'Cathedral of Mary, Shillong']],
    words: ['christian', 'church', 'catholic', 'holy matrimony', 'english'] },
  { id: 'parsi', name: 'Parsi', lang: 'en', events: 'parsi', blessings: ['Ushta Te', 'Together with our families'],
    couples: [['Zubin', 'Shirin'], ['Cyrus', 'Freyaan']], places: [['Mumbai', 'Cama Baug, Mumbai'], ['Udvada', 'Globe Hotel, Udvada']],
    words: ['parsi', 'zoroastrian', 'lagan', 'english'] },
  { id: 'jain', name: 'Jain', lang: 'hi', events: 'north', blessings: ['॥ जय जिनेन्द्र ॥', '॥ णमो अरिहंताणं ॥'],
    couples: [['Rishabh', 'Prachi'], ['Moksh', 'Tanvi']], places: [['Indore', 'Sayaji Lawns, Indore'], ['Ahmedabad', 'Courtyard Lawns, Ahmedabad']],
    words: ['jain', 'jai jinendra', 'hindi'] },
  { id: 'buddhist', name: 'Buddhist', lang: 'mr', events: 'marathi', blessings: ['॥ नमो बुद्धाय ॥'],
    couples: [['Siddharth', 'Prajakta'], ['Rahul', 'Sujata']], places: [['Nagpur', 'Deekshabhoomi Lawns, Nagpur'], ['Aurangabad', 'Rama International, Aurangabad']],
    words: ['buddhist', 'bauddha', 'marathi'] },
  { id: 'modern', name: 'English', lang: 'en', events: 'north', blessings: ['Together with our families', 'Save the date'],
    couples: [['Neil', 'Ritika'], ['Kabir', 'Naina'], ['Dev', 'Tara']], places: [['Delhi', 'The Lodhi, New Delhi'], ['Bengaluru', 'The Tamarind Tree, Bengaluru'], ['Goa', 'W Goa, Vagator']],
    words: ['english', 'modern', 'contemporary'] },
];

const CULTURE_BY_ID = new Map(CULTURES.map((c) => [c.id, c]));
export const getCulture = (id: string) => CULTURE_BY_ID.get(id);

/** Every top line we ever pre-fill, so the editor knows when it's safe to swap it for the new design's. */
export const DEFAULT_BLESSINGS = new Set<string>([
  ...CULTURES.flatMap((c) => c.blessings),
  '॥ शुभ विवाह ॥', '॥ श्री गणेशाय नमः ॥', 'Together with our families', 'Nikah Mubarak', 'Bismillah',
  'With the blessings of Allah', 'Shubha Vivaham', 'Subha Muhurtham', 'With the blessings of elders', 'Save the date', 'Join us by the sea',
]);

/** Suggestions for the editor's top-line field, grouped by language. */
export const BLESSING_SUGGESTIONS: { lang: LangCode; text: string }[] = [
  ...CULTURES.flatMap((c) => c.blessings.map((text) => ({ lang: c.lang, text }))),
  { lang: 'hi' as LangCode, text: '॥ शुभ विवाह ॥' },
].filter((b, i, all) => all.findIndex((x) => x.text === b.text) === i);

/* ------------------------------ scripts ------------------------------ */

export type Script = 'latin' | 'deva' | 'beng' | 'guru' | 'gujr' | 'orya' | 'taml' | 'telu' | 'knda' | 'mlym' | 'arab' | 'urdu';

const RANGES: [Script, number, number][] = [
  ['deva', 0x0900, 0x097f], ['beng', 0x0980, 0x09ff], ['guru', 0x0a00, 0x0a7f], ['gujr', 0x0a80, 0x0aff],
  ['orya', 0x0b00, 0x0b7f], ['taml', 0x0b80, 0x0bff], ['telu', 0x0c00, 0x0c7f], ['knda', 0x0c80, 0x0cff],
  ['mlym', 0x0d00, 0x0d7f], ['arab', 0x0600, 0x06ff],
];
// Letters only Urdu uses (ٹ ڈ ڑ ں ہ ھ ی ے …): set those in Nastaliq, Arabic in Naskh.
const URDU_ONLY = /[ٹڈڑںھہیےۓ]/;

/** Which script a line is written in (by its first non-Latin letter). */
export function scriptOf(text: string): Script {
  for (const ch of text) {
    const c = ch.codePointAt(0)!;
    if (c === 0x0964 || c === 0x0965) continue; // danda ॥ is shared by many scripts
    for (const [s, lo, hi] of RANGES) if (c >= lo && c <= hi) return s === 'arab' && URDU_ONLY.test(text) ? 'urdu' : s;
  }
  return 'latin';
}

const SCRIPT_LANG: Record<Script, string | undefined> = {
  latin: undefined, deva: 'hi', beng: 'bn', guru: 'pa', gujr: 'gu', orya: 'or', taml: 'ta', telu: 'te', knda: 'kn', mlym: 'ml', arab: 'ar', urdu: 'ur',
};
/** Tailwind font class per script (see the --font-* tokens in globals.css). */
const SCRIPT_FONT: Record<Script, string> = {
  latin: '', deva: 'font-hindi', beng: 'font-bn', guru: 'font-pa', gujr: 'font-gu', orya: 'font-or', taml: 'font-ta',
  telu: 'font-te', knda: 'font-kn', mlym: 'font-ml', arab: 'font-arabic', urdu: 'font-urdu',
};

/** Props for an element holding text in any script: right font, lang and direction. */
export function scriptProps(text: string, langHint?: string) {
  const s = scriptOf(text);
  if (s === 'latin') return { script: s, className: '', lang: undefined as string | undefined, dir: undefined as 'rtl' | undefined };
  const lang = s === 'beng' && langHint === 'as' ? 'as' : s === 'deva' && langHint === 'mr' ? 'mr' : SCRIPT_LANG[s];
  return { script: s, className: SCRIPT_FONT[s], lang, dir: s === 'arab' || s === 'urdu' ? ('rtl' as const) : undefined };
}

const SCRIPT_TO_LANG: Partial<Record<Script, LangCode>> = {
  deva: 'hi', beng: 'bn', guru: 'pa', gujr: 'gu', orya: 'or', taml: 'ta', telu: 'te', knda: 'kn', mlym: 'ml', arab: 'ur', urdu: 'ur',
};

/**
 * The language an invite is written in: whatever script the couple's top line
 * (blessing) uses, falling back to the design's language. A Hindi design
 * whose couple wrote an English top line greets families in English.
 */
export function inviteLanguage(blessing: string, designLang: string): LangCode {
  const text = blessing.trim();
  if (!text) return getLanguage(designLang).code;
  const s = scriptOf(text);
  if (s === 'latin') return 'en';
  const design = getLanguage(designLang).code;
  // Same script as the design (Marathi/Hindi, Assamese/Bengali): keep the design's language.
  if (design !== 'en' && scriptOf(getLanguage(design).native) === s) return design;
  return SCRIPT_TO_LANG[s] ?? design;
}
