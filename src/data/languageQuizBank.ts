import { QuizFormatKind, QuizLanguageId, QuizProficiencyTier } from '../types/game';

export interface QuizLanguageMeta {
  id: QuizLanguageId;
  flag: string;
  nameVi: string;
  academyVi: string;
  nativeName: string;
  ttsLang: string;
  phoneticLabel: string;
  tierLabels: Record<QuizProficiencyTier, string>;
}

export interface QuizVocabNote {
  word: string;
  phonetic: string;
  posVi: string;
  meaningVi: string;
}

export interface CuratedQuizItem {
  id: string;
  lang: QuizLanguageId;
  tier: QuizProficiencyTier;
  levelBand: number; // 1..10 (maps to Park Levels 1..100: band 1 = Lv 1-10 ... band 10 = Lv 91-100)
  format: 'grammar_cloze' | 'dialogue_reply' | 'sentence_builder';
  promptVi: string;
  /** Shown on board: sentence with ____ for cloze, speaker A line for dialogue, or hint for sentence_builder */
  stemText: string;
  stemPhonetic?: string;
  /** Full correct native sentence read aloud by TTS & shown in explanation */
  fullSentence: string;
  fullPhonetic: string;
  translationVi: string;
  /** For grammar_cloze & dialogue_reply (4 choices, index 0..3) */
  choices?: string[];
  choicePhonetics?: string[];
  correctIndex?: number;
  /** For sentence_builder: ordered tokens that form fullSentence (shuffled at runtime) */
  orderedTokens?: string[];
  distractorTokens?: string[];
  grammarTitleVi: string;
  grammarExplainVi: string;
  vocabNotes: QuizVocabNote[];
}

export interface QuizLexiconEntry {
  id: string;
  lang: QuizLanguageId;
  tier: QuizProficiencyTier;
  levelBand: number; // 1..10 (Lv 1..100)
  word: string;
  phonetic: string;
  posVi: string;
  meaningVi: string;
  exampleSentence: string;
  examplePhonetic: string;
  exampleVi: string;
  grammarNoteVi: string;
}

export interface CurriculumChapterMeta {
  band: number; // 1..10
  minLevel: number;
  maxLevel: number;
  tier: QuizProficiencyTier;
  titleVi: string;
}

export const QUIZ_LANGUAGES: Record<QuizLanguageId, QuizLanguageMeta> = {
  en: {
    id: 'en',
    flag: '🇬🇧',
    nameVi: 'Chú Ngữ Anh',
    academyVi: 'Chú Ngữ Hogwarts (Tiếng Anh)',
    nativeName: 'English',
    ttsLang: 'en-US',
    phoneticLabel: 'IPA',
    tierLabels: {
      beginner: 'Phù Thủy Tập Sự (A1–A2)',
      intermediate: 'Pháp Thần O.W.L. (B1–B2)',
      advanced: 'Bậc Thầy N.E.W.T. (C1–C2)',
    },
  },
  ko: {
    id: 'ko',
    flag: '🇰🇷',
    nameVi: 'Cổ Ngữ Hàn',
    academyVi: 'Cổ Ngữ Bạch Sơn (Tiếng Hàn)',
    nativeName: '한국어',
    ttsLang: 'ko-KR',
    phoneticLabel: 'Romaja',
    tierLabels: {
      beginner: 'Phù Thủy Tập Sự (TOPIK 1–2)',
      intermediate: 'Pháp Thần O.W.L. (TOPIK 3–4)',
      advanced: 'Bậc Thầy N.E.W.T. (TOPIK 5–6)',
    },
  },
  zh: {
    id: 'zh',
    flag: '🇨🇳',
    nameVi: 'Phù Chú Hoa',
    academyVi: 'Phù Chú Phương Đông (Tiếng Trung)',
    nativeName: '中文',
    ttsLang: 'zh-CN',
    phoneticLabel: 'Pinyin',
    tierLabels: {
      beginner: 'Phù Thủy Tập Sự (HSK 1–2)',
      intermediate: 'Pháp Thần O.W.L. (HSK 3–4)',
      advanced: 'Bậc Thầy N.E.W.T. (HSK 5–6)',
    },
  },
  es: {
    id: 'es',
    flag: '🇪🇸',
    nameVi: 'Mật Ngữ TBN',
    academyVi: 'Mật Ngữ Hỏa Long (Tây Ban Nha)',
    nativeName: 'Español',
    ttsLang: 'es-ES',
    phoneticLabel: 'Phiên âm',
    tierLabels: {
      beginner: 'Phù Thủy Tập Sự (DELE A1–A2)',
      intermediate: 'Pháp Thần O.W.L. (DELE B1–B2)',
      advanced: 'Bậc Thầy N.E.W.T. (DELE C1–C2)',
    },
  },
  ja: {
    id: 'ja',
    flag: '🇯🇵',
    nameVi: 'Bí Thuật Nhật',
    academyVi: 'Bí Thuật Mahoutokoro (Tiếng Nhật)',
    nativeName: '日本語',
    ttsLang: 'ja-JP',
    phoneticLabel: 'Furigana • Romaji',
    tierLabels: {
      beginner: 'Phù Thủy Tập Sự (JLPT N5)',
      intermediate: 'Pháp Thần O.W.L. (JLPT N4–N3)',
      advanced: 'Bậc Thầy N.E.W.T. (JLPT N2–N1)',
    },
  },
};

export const QUIZ_FORMAT_LABELS: Record<'all' | QuizFormatKind, { icon: string; labelVi: string }> = {
  all: { icon: '🎲', labelVi: 'Tất Cả Trò' },
  vocab_context: { icon: '🖼️', labelVi: 'Chạm Hình' },
  grammar_cloze: { icon: '🔊', labelVi: 'Nhìn Tranh' },
  dialogue_reply: { icon: '🫧', labelVi: 'Đập Bóng' },
  sentence_builder: { icon: '🧩', labelVi: 'Ghép Chữ' },
  match_pairs: { icon: '🃏', labelVi: 'Nối Tranh' },
};

export const CURRICULUM_CHAPTERS: CurriculumChapterMeta[] = [
  { band: 1, minLevel: 1, maxLevel: 10, tier: 'beginner', titleVi: 'Quyển 1 (Cấp 1–10): Nhập Học Hang Sóc & Lời Chào Phép Thuật' },
  { band: 2, minLevel: 11, maxLevel: 20, tier: 'beginner', titleVi: 'Quyển 2 (Cấp 11–20): Tiệc Đại Sảnh Đường & Phiên Chợ Hẻm Xéo' },
  { band: 3, minLevel: 21, maxLevel: 30, tier: 'beginner', titleVi: 'Quyển 3 (Cấp 21–30): Xoay Thời Gian & Thời Tiết Hogsmeade' },
  { band: 4, minLevel: 31, maxLevel: 40, tier: 'intermediate', titleVi: 'Quyển 4 (Cấp 31–40): Bản Đồ Đạo Tặc, Ước Nguyện & So Sánh' },
  { band: 5, minLevel: 41, maxLevel: 50, tier: 'intermediate', titleVi: 'Quyển 5 (Cấp 41–50): Tàu Tốc Hành Hogwarts & Nhân Quả' },
  { band: 6, minLevel: 51, maxLevel: 60, tier: 'intermediate', titleVi: 'Quyển 6 (Cấp 51–60): Bùa Điều Kiện, Bị Động & Nghi Thức Pháp Sư' },
  { band: 7, minLevel: 61, maxLevel: 70, tier: 'intermediate', titleVi: 'Quyển 7 (Cấp 61–70): Quả Cầu Tiên Tri & Khẩu Ngữ Phù Thủy' },
  { band: 8, minLevel: 71, maxLevel: 80, tier: 'advanced', titleVi: 'Quyển 8 (Cấp 71–80): Giả Định Thức Thần Sáng & Biện Luận Cổ Ngữ' },
  { band: 9, minLevel: 81, maxLevel: 90, tier: 'advanced', titleVi: 'Quyển 9 (Cấp 81–90): Ngạn Ngữ Cụ Dumbledore & Bộ Pháp Thuật' },
  { band: 10, minLevel: 91, maxLevel: 100, tier: 'advanced', titleVi: 'Quyển 10 (Cấp 91–100): Bí Truyền Đảo Ngữ & Cảnh Giới Đại Pháp Sư' },
];

// ============================================================================
// CURATED MULTI-FORMAT LESSONS (100 LESSONS ACROSS 5 LANGUAGES × BANDS 1..10)
// ============================================================================

export const CURATED_QUIZ_BANK: CuratedQuizItem[] = [
  // ======================== 1. TIẾNG ANH (EN) — Lv 1..100 ========================
  {
    id: 'en_b1_cloze_1',
    lang: 'en',
    tier: 'beginner',
    levelBand: 1,
    format: 'grammar_cloze',
    promptVi: 'Chọn động từ đúng để hoàn thành câu thói quen hằng sáng:',
    stemText: 'Every morning, Molly ____ fresh bread in the kitchen.',
    stemPhonetic: '/ˈɛvri ˈmɔːrnɪŋ, ˈmɒli ____ frɛʃ brɛd ɪn ðə ˈkɪtʃɪn/',
    fullSentence: 'Every morning, Molly bakes fresh bread in the kitchen.',
    fullPhonetic: '/ˈɛvri ˈmɔːrnɪŋ, ˈmɒli beɪks frɛʃ brɛd ɪn ðə ˈkɪtʃɪn/',
    translationVi: 'Mỗi buổi sáng, bà Molly nướng bánh mì tươi trong bếp.',
    choices: ['bake', 'bakes', 'baking', 'to bake'],
    choicePhonetics: ['/beɪk/', '/beɪks/', '/ˈbeɪkɪŋ/', '/tə beɪk/'],
    correctIndex: 1,
    grammarTitleVi: 'Hiện tại đơn với chủ ngữ ngôi thứ 3 số ít (He/She/It + V-s/es)',
    grammarExplainVi: 'Cụm "Every morning" chỉ thói quen lặp lại nên dùng Hiện tại đơn. Chủ ngữ "Molly" là ngôi thứ 3 số ít nên động từ "bake" thêm "-s" thành "bakes".',
    vocabNotes: [
      { word: 'every morning', phonetic: '/ˈɛvri ˈmɔːrnɪŋ/', posVi: 'trạng ngữ', meaningVi: 'mỗi buổi sáng' },
      { word: 'bake', phonetic: '/beɪk/', posVi: 'động từ', meaningVi: 'nướng (bánh bằng lò)' },
      { word: 'fresh bread', phonetic: '/frɛʃ brɛd/', posVi: 'cụm danh từ', meaningVi: 'bánh mì tươi mới ra lò' },
    ],
  },
  {
    id: 'en_b1_sent_2',
    lang: 'en',
    tier: 'beginner',
    levelBand: 1,
    format: 'sentence_builder',
    promptVi: 'Sắp xếp các thẻ từ để diễn đạt: "Những quả bí ngô này rất ngọt."',
    stemText: 'Những quả bí ngô này rất ngọt.',
    fullSentence: 'These pumpkins are very sweet.',
    fullPhonetic: '/ðiːz ˈpʌmpkɪnz ɑːr ˈvɛri swiːt/',
    translationVi: 'Những quả bí ngô này rất ngọt.',
    orderedTokens: ['These', 'pumpkins', 'are', 'very', 'sweet.'],
    distractorTokens: ['is'],
    grammarTitleVi: 'Đại từ chỉ định số nhiều: These + Danh từ số nhiều + are + Tính từ',
    grammarExplainVi: '"Pumpkins" là danh từ số nhiều nên đi với "These" (những cái này) và động từ to be "are" (không dùng This/is).',
    vocabNotes: [
      { word: 'these', phonetic: '/ðiːz/', posVi: 'đại từ', meaningVi: 'những cái này (số nhiều của this)' },
      { word: 'pumpkin', phonetic: '/ˈpʌmpkɪn/', posVi: 'danh từ', meaningVi: 'quả bí ngô' },
      { word: 'sweet', phonetic: '/swiːt/', posVi: 'tính từ', meaningVi: 'ngọt ngào' },
    ],
  },
  {
    id: 'en_b2_dial_1',
    lang: 'en',
    tier: 'beginner',
    levelBand: 2,
    format: 'dialogue_reply',
    promptVi: 'Người bán hạt giống hỏi bạn câu sau — chọn lời đáp tự nhiên nhất:',
    stemText: 'Shopkeeper: "How many bags of wheat seeds would you like?"',
    stemPhonetic: '/haʊ ˈmɛni bæɡz əv wiːt siːdz wʊd juː laɪk/',
    fullSentence: 'I would like two bags, please.',
    fullPhonetic: '/aɪ wʊd laɪk tuː bæɡz, pliːz/',
    translationVi: 'Cho tôi lấy hai túi ạ, làm ơn.',
    choices: [
      'I would like two bags, please.',
      'Yes, I like bread very much.',
      'It is on the wooden table.',
      'Yesterday afternoon at five.',
    ],
    correctIndex: 0,
    grammarTitleVi: 'Câu hỏi số lượng đếm được: How many + N(số nhiều) + would you like?',
    grammarExplainVi: '"How many..." hỏi về số lượng cụ thể. Đáp lại lịch sự khi mua hàng bằng cấu trúc "I would like + số lượng + please".',
    vocabNotes: [
      { word: 'how many', phonetic: '/haʊ ˈmɛni/', posVi: 'từ hỏi', meaningVi: 'bao nhiêu (dùng cho danh từ đếm được)' },
      { word: 'wheat seeds', phonetic: '/wiːt siːdz/', posVi: 'danh từ', meaningVi: 'hạt giống lúa mì' },
      { word: 'would like', phonetic: '/wʊd laɪk/', posVi: 'cụm động từ', meaningVi: 'muốn (cách nói lịch sự của want)' },
    ],
  },
  {
    id: 'en_b3_cloze_1',
    lang: 'en',
    tier: 'beginner',
    levelBand: 3,
    format: 'grammar_cloze',
    promptVi: 'Chọn dạng động từ đúng cho hành động đã xảy ra hôm qua:',
    stemText: 'Arthur ____ the old wooden fence yesterday afternoon.',
    stemPhonetic: '/ˈɑːrθər ____ ði oʊld ˈwʊdən fɛns ˈjɛstərdeɪ ˌæftərˈnuːn/',
    fullSentence: 'Arthur repaired the old wooden fence yesterday afternoon.',
    fullPhonetic: '/ˈɑːrθər rɪˈpɛrd ði oʊld ˈwʊdən fɛns ˈjɛstərdeɪ ˌæftərˈnuːn/',
    translationVi: 'Ông Arthur đã sửa hàng rào gỗ cũ vào chiều hôm qua.',
    choices: ['repairs', 'repaired', 'will repair', 'is repairing'],
    correctIndex: 1,
    grammarTitleVi: 'Thì Quá khứ đơn (Past Simple): S + V-ed / V2',
    grammarExplainVi: 'Trạng ngữ "yesterday afternoon" (chiều hôm qua) xác định thời điểm đã kết thúc trong quá khứ nên dùng Quá khứ đơn "repaired".',
    vocabNotes: [
      { word: 'repair', phonetic: '/rɪˈpɛr/', posVi: 'động từ', meaningVi: 'sửa chữa, tu sửa' },
      { word: 'wooden fence', phonetic: '/ˈwʊdən fɛns/', posVi: 'cụm danh từ', meaningVi: 'hàng rào bằng gỗ' },
      { word: 'yesterday', phonetic: '/ˈjɛstərdeɪ/', posVi: 'trạng từ', meaningVi: 'ngày hôm qua' },
    ],
  },
  {
    id: 'en_b4_sent_1',
    lang: 'en',
    tier: 'intermediate',
    levelBand: 4,
    format: 'sentence_builder',
    promptVi: 'Ghép thành câu đúng: "Trồng hoa oải hương dễ hơn trồng nấm phát sáng."',
    stemText: 'Trồng hoa oải hương dễ hơn trồng nấm phát sáng.',
    fullSentence: 'Growing lavender is easier than growing glowing mushrooms.',
    fullPhonetic: '/ˈɡroʊɪŋ ˈlævəndər ɪz ˈiːziər ðæn ˈɡroʊɪŋ ˈɡloʊɪŋ ˈmʌʃruːmz/',
    translationVi: 'Trồng hoa oải hương dễ hơn trồng nấm phát sáng.',
    orderedTokens: ['Growing', 'lavender', 'is', 'easier', 'than', 'growing', 'glowing', 'mushrooms.'],
    grammarTitleVi: 'Danh động từ làm chủ ngữ (V-ing) & So sánh hơn tính từ đuôi -y (easier than)',
    grammarExplainVi: 'Khi động từ đứng đầu câu làm chủ ngữ, ta chuyển sang V-ing ("Growing lavender") và chia động từ số ít ("is"). Tính từ "easy" đổi -y thành -ier + than.',
    vocabNotes: [
      { word: 'lavender', phonetic: '/ˈlævəndər/', posVi: 'danh từ', meaningVi: 'hoa oải hương' },
      { word: 'easier than', phonetic: '/ˈiːziər ðæn/', posVi: 'so sánh', meaningVi: 'dễ hơn so với' },
      { word: 'glowing', phonetic: '/ˈɡloʊɪŋ/', posVi: 'tính từ', meaningVi: 'phát sáng dịu' },
    ],
  },
  {
    id: 'en_b5_cloze_1',
    lang: 'en',
    tier: 'intermediate',
    levelBand: 5,
    format: 'grammar_cloze',
    promptVi: 'Chọn liên từ phù hợp nhất với ngữ cảnh tương phản:',
    stemText: '____ it rained heavily all night, the young strawberries remained unharmed.',
    stemPhonetic: '/____ ɪt reɪnd ˈhɛvɪli ɔːl naɪt, ðə jʌŋ ˈstrɔːbɛriz rɪˈmeɪnd ʌnˈhɑːrmd/',
    fullSentence: 'Although it rained heavily all night, the young strawberries remained unharmed.',
    fullPhonetic: '/ɔːlˈðoʊ ɪt reɪnd ˈhɛvɪli ɔːl naɪt, ðə jʌŋ ˈstrɔːbɛriz rɪˈmeɪnd ʌnˈhɑːrmd/',
    translationVi: 'Mặc dù trời mưa to suốt đêm, những cây dâu tây non vẫn bình yên vô sự.',
    choices: ['Despite', 'Although', 'Because of', 'Therefore'],
    correctIndex: 1,
    grammarTitleVi: 'Phân biệt Although + Mệnh đề (S + V) và Despite / In spite of + Danh từ/V-ing',
    grammarExplainVi: 'Phía sau chỗ trống là một mệnh đề đầy đủ "it rained heavily" (S + V), do đó phải dùng liên từ "Although" (Mặc dù). "Despite" và "Because of" chỉ đi với cụm danh từ hoặc V-ing.',
    vocabNotes: [
      { word: 'although', phonetic: '/ɔːlˈðoʊ/', posVi: 'liên từ', meaningVi: 'mặc dù (+ mệnh đề S + V)' },
      { word: 'heavily', phonetic: '/ˈhɛvɪli/', posVi: 'trạng từ', meaningVi: 'nặng hạt, dữ dội' },
      { word: 'unharmed', phonetic: '/ʌnˈhɑːrmd/', posVi: 'tính từ', meaningVi: 'nguyên vẹn, không hư hại' },
    ],
  },
  {
    id: 'en_b6_cloze_1',
    lang: 'en',
    tier: 'intermediate',
    levelBand: 6,
    format: 'grammar_cloze',
    promptVi: 'Hoàn thành câu điều kiện giả định ở hiện tại (Điều kiện loại 2):',
    stemText: 'If I ____ more sunlit soil right now, I would plant an entire apple orchard.',
    stemPhonetic: '/ɪf aɪ ____ mɔːr ˈsʌnlɪt sɔɪl raɪt naʊ, aɪ wʊd plænt ən ɪnˈtaɪər ˈæpəl ˈɔːrtʃərd/',
    fullSentence: 'If I had more sunlit soil right now, I would plant an entire apple orchard.',
    fullPhonetic: '/ɪf aɪ hæd mɔːr ˈsʌnlɪt sɔɪl raɪt naʊ, aɪ wʊd plænt ən ɪnˈtaɪər ˈæpəl ˈɔːrtʃərd/',
    translationVi: 'Nếu bây giờ tôi có thêm đất đón nắng, tôi sẽ trồng cả một vườn táo.',
    choices: ['have', 'had', 'will have', 'would have'],
    correctIndex: 1,
    grammarTitleVi: 'Câu điều kiện loại 2 (Trái với hiện tại): If + S + V2/ed, S + would + V',
    grammarExplainVi: 'Mệnh đề chính dùng "would plant" kèm dấu hiệu "right now" diễn tả giả định không có thật ở hiện tại, nên mệnh đề If lùi 1 thì về Quá khứ đơn ("had").',
    vocabNotes: [
      { word: 'sunlit soil', phonetic: '/ˈsʌnlɪt sɔɪl/', posVi: 'cụm danh từ', meaningVi: 'đất ngập nắng ấm' },
      { word: 'entire', phonetic: '/ɪnˈtaɪər/', posVi: 'tính từ', meaningVi: 'toàn bộ, trọn vẹn' },
      { word: 'orchard', phonetic: '/ˈɔːrtʃərd/', posVi: 'danh từ', meaningVi: 'vườn cây ăn quả' },
    ],
  },
  {
    id: 'en_b7_dial_1',
    lang: 'en',
    tier: 'intermediate',
    levelBand: 7,
    format: 'dialogue_reply',
    promptVi: 'Chọn câu đáp tự nhiên dùng cấu trúc phỏng đoán quá khứ:',
    stemText: 'Hermione: "All the morning dew on the greenhouse glass has vanished already!"',
    stemPhonetic: '/ɔːl ðə ˈmɔːrnɪŋ djuː ɒn ðə ˈɡriːnhaʊs ɡlæs hæz ˈvænɪʃt ɔːlˈrɛdi/',
    fullSentence: 'The sunrise must have warmed the roof much earlier today.',
    fullPhonetic: '/ðə ˈsʌnraɪz mʌst hæv wɔːrmd ðə ruːf mʌtʃ ˈɜːrliər təˈdeɪ/',
    translationVi: 'Ắt hẳn ánh bình minh hôm nay đã sưởi ấm mái nhà sớm hơn nhiều.',
    choices: [
      'The sunrise must have warmed the roof much earlier today.',
      'You should watering the glass tomorrow night.',
      'Because the dew is going to arrive next week.',
      'I used to vanish the greenhouse every summer.',
    ],
    correctIndex: 0,
    grammarTitleVi: 'Suy luận hợp lý về sự việc trong quá khứ: must have + V3/ed',
    grammarExplainVi: '"Must have + V3/ed" dùng để đưa ra suy luận gần như chắc chắn (ắt hẳn đã...) dựa trên bằng chứng hiện tại (sương sớm đã tan hết).',
    vocabNotes: [
      { word: 'morning dew', phonetic: '/ˈmɔːrnɪŋ djuː/', posVi: 'danh từ', meaningVi: 'sương sớm ban mai' },
      { word: 'vanish', phonetic: '/ˈvænɪʃ/', posVi: 'động từ', meaningVi: 'biến mất, tan biến' },
      { word: 'must have + V3', phonetic: '/mʌst hæv/', posVi: 'cấu trúc', meaningVi: 'ắt hẳn đã (suy đoán có căn cứ)' },
    ],
  },
  {
    id: 'en_b8_cloze_1',
    lang: 'en',
    tier: 'advanced',
    levelBand: 8,
    format: 'grammar_cloze',
    promptVi: 'Chọn dạng thức giả định (Subjunctive) chuẩn học thuật:',
    stemText: 'Professor Sprout insisted that every apprentice ____ protective earmuffs before repotting Mandrakes.',
    stemPhonetic: '/prəˈfɛsər spraʊt ɪnˈsɪstɪd ðæt ˈɛvri əˈprɛntɪs ____ prəˈtɛktɪv ˈɪrmʌfs/',
    fullSentence: 'Professor Sprout insisted that every apprentice wear protective earmuffs before repotting Mandrakes.',
    fullPhonetic: '/prəˈfɛsər spraʊt ɪnˈsɪstɪd ðæt ˈɛvri əˈprɛntɪs wɛr prəˈtɛktɪv ˈɪrmʌfs bɪˈfɔːr riːˈpɒtɪŋ ˈmændreɪks/',
    translationVi: 'Giáo sư Sprout kiên quyết yêu cầu mọi học trò phải đeo chụp tai bảo hộ trước khi thay chậu Mandrake.',
    choices: ['wears', 'wore', 'wear', 'wearing'],
    correctIndex: 2,
    grammarTitleVi: 'Giả định thức hiện tại (Mandative Subjunctive): insist/suggest/demand + that + S + V(nguyên mẫu)',
    grammarExplainVi: 'Sau các động từ mang tính yêu cầu/đề xuất khẩn thiết (insist, recommend, demand, essential) + "that", động từ luôn giữ nguyên mẫu không "to" ("wear") bất kể chủ ngữ số ít hay thì quá khứ.',
    vocabNotes: [
      { word: 'insist that', phonetic: '/ɪnˈsɪst ðæt/', posVi: 'động từ', meaningVi: 'khăng khăng / kiên quyết yêu cầu rằng' },
      { word: 'apprentice', phonetic: '/əˈprɛntɪs/', posVi: 'danh từ', meaningVi: 'người học việc, môn sinh' },
      { word: 'repot', phonetic: '/riːˈpɒt/', posVi: 'động từ', meaningVi: 'thay chậu mới cho cây' },
    ],
  },
  {
    id: 'en_b9_cloze_1',
    lang: 'en',
    tier: 'advanced',
    levelBand: 9,
    format: 'grammar_cloze',
    promptVi: 'Chọn thành ngữ tiếng Anh phù hợp nhất với ngữ cảnh mùa màng bội thu:',
    stemText: 'After months of patient tending, our lavender terrace is finally ____, yielding fragrant oil for the whole valley.',
    stemPhonetic: '/ˈæftər mʌnθs əv ˈpeɪʃənt ˈtɛndɪŋ, aʊər ˈlævəndər ˈtɛrəs ɪz ˈfaɪnəli ____/',
    fullSentence: 'After months of patient tending, our lavender terrace is finally bearing fruit, yielding fragrant oil for the whole valley.',
    fullPhonetic: '/ˈæftər mʌnθs əv ˈpeɪʃənt ˈtɛndɪŋ, aʊər ˈlævəndər ˈtɛrəs ɪz ˈfaɪnəli ˈbɛrɪŋ fruːt/',
    translationVi: 'Sau nhiều tháng kiên nhẫn chăm bẵm, ruộng bậc thang oải hương của chúng ta cuối cùng đã đơm hoa kết trái.',
    choices: ['bearing fruit', 'cutting corners', 'spilling the beans', 'barking up the wrong tree'],
    correctIndex: 0,
    grammarTitleVi: 'Thành ngữ C1: "bear fruit" (đơm hoa kết trái / mang lại thành quả tốt đẹp)',
    grammarExplainVi: '"Bear fruit" vừa mang nghĩa đen (cây kết trái) vừa mang nghĩa bóng trang trọng (nỗ lực sinh ra kết quả tốt). "Cut corners" = làm ẩu đốt cháy giai đoạn; "spill the beans" = lộ bí mật.',
    vocabNotes: [
      { word: 'bear fruit', phonetic: '/bɛr fruːt/', posVi: 'thành ngữ', meaningVi: 'đơm hoa kết trái, thu được thành quả' },
      { word: 'tending', phonetic: '/ˈtɛndɪŋ/', posVi: 'danh từ', meaningVi: 'sự chăm sóc, vun xới' },
      { word: 'yield', phonetic: '/jiːld/', posVi: 'động từ', meaningVi: 'mang lại sản lượng, sinh ra' },
    ],
  },
  {
    id: 'en_b10_sent_1',
    lang: 'en',
    tier: 'advanced',
    levelBand: 10,
    format: 'sentence_builder',
    promptVi: 'Xếp câu Đảo ngữ bậc C2: "Hiếm khi nào chúng tôi chứng kiến một vụ mùa rực rỡ đến thế."',
    stemText: 'Hiếm khi nào chúng tôi chứng kiến một vụ mùa rực rỡ đến thế.',
    fullSentence: 'Seldom have we witnessed such a magnificent harvest.',
    fullPhonetic: '/ˈsɛldəm hæv wiː ˈwɪtnəst sʌtʃ ə mæɡˈnɪfɪsənt ˈhɑːrvɪst/',
    translationVi: 'Hiếm khi nào chúng tôi chứng kiến một vụ mùa rực rỡ đến thế.',
    orderedTokens: ['Seldom', 'have', 'we', 'witnessed', 'such', 'a', 'magnificent', 'harvest.'],
    grammarTitleVi: 'Đảo ngữ với trạng từ phủ định/hiếm gặp: Seldom / Rarely + Trợ động từ + S + V',
    grammarExplainVi: 'Khi đưa trạng từ mang nghĩa phủ định/hiếm ("Seldom", "Rarely", "Never") lên đầu câu để nhấn mạnh sắc thái trang trọng C2, ta đảo trợ động từ "have" lên trước chủ ngữ "we".',
    vocabNotes: [
      { word: 'seldom', phonetic: '/ˈsɛldəm/', posVi: 'trạng từ', meaningVi: 'hiếm khi' },
      { word: 'witness', phonetic: '/ˈwɪtnəs/', posVi: 'động từ', meaningVi: 'chứng kiến tận mắt' },
      { word: 'magnificent', phonetic: '/mæɡˈnɪfɪsənt/', posVi: 'tính từ', meaningVi: 'tráng lệ, rực rỡ tuyệt vời' },
    ],
  },

  // ======================== 2. TIẾNG HÀN (KO) — Lv 1..100 ========================
  {
    id: 'ko_b1_cloze_1',
    lang: 'ko',
    tier: 'beginner',
    levelBand: 1,
    format: 'grammar_cloze',
    promptVi: 'Chọn tiểu từ tân ngữ đúng cho câu tiếng Hàn sơ cấp:',
    stemText: '저는 매일 아침 신선한 우유____ 마셔요.',
    stemPhonetic: 'Jeo-neun mae-il a-chim sin-seon-han u-yu____ ma-syeo-yo.',
    fullSentence: '저는 매일 아침 신선한 우유를 마셔요.',
    fullPhonetic: 'Jeo-neun mae-il a-chim sin-seon-han u-yu-reul ma-syeo-yo.',
    translationVi: 'Mỗi buổi sáng tôi đều uống sữa tươi.',
    choices: ['을', '를', '이', '은'],
    choicePhonetics: ['eul', 'reul', 'i', 'eun'],
    correctIndex: 1,
    grammarTitleVi: 'Tiểu từ tân ngữ 을/를: Danh từ không có patchim + 를, có patchim + 을',
    grammarExplainVi: 'Từ "우유" (sữa) kết thúc bằng nguyên âm "유" (không có phụ âm cuối patchim), và đứng trước ngoại động từ "마셔요" (uống) nên đi với tiểu từ tân ngữ "를".',
    vocabNotes: [
      { word: '매일 아침', phonetic: 'mae-il a-chim', posVi: 'trạng ngữ', meaningVi: 'mỗi buổi sáng' },
      { word: '신선한 우유', phonetic: 'sin-seon-han u-yu', posVi: 'danh từ', meaningVi: 'sữa tươi' },
      { word: '마시다', phonetic: 'ma-si-da', posVi: 'động từ', meaningVi: 'uống' },
    ],
  },
  {
    id: 'ko_b2_dial_1',
    lang: 'ko',
    tier: 'beginner',
    levelBand: 2,
    format: 'dialogue_reply',
    promptVi: 'Chủ tiệm hỏi bạn tại quầy hạt giống — chọn câu trả lời đúng:',
    stemText: '주인: "무엇을 드릴까요?"',
    stemPhonetic: 'Ju-in: "Mu-eo-seul deu-ril-kka-yo?"',
    fullSentence: '딸기 씨앗 두 봉지 주세요.',
    fullPhonetic: 'Ttal-gi ssi-at du bong-ji ju-se-yo.',
    translationVi: 'Cho tôi hai gói hạt giống dâu tây ạ.',
    choices: [
      '딸기 씨앗 두 봉지 주세요.',
      '어제 공원에 갔어요.',
      '날씨가 아주 따뜻해요.',
      '네, 한국어를 공부해요.',
    ],
    choicePhonetics: [
      'Ttal-gi ssi-at du bong-ji ju-se-yo.',
      'Eo-je gong-wo-ne ga-sseo-yo.',
      'Nal-ssi-ga a-ju tta-tteu-thae-yo.',
      'Ne, han-gu-geo-reul gong-bu-hae-yo.',
    ],
    correctIndex: 0,
    grammarTitleVi: 'Mẫu câu mua hàng: Danh từ + Số thuần Hàn + Đơn vị + 주세요 (Cho tôi...)',
    grammarExplainVi: '"무엇을 드릴까요?" nghĩa là "Tôi có thể lấy gì cho quý khách?". Đáp lại bằng "[Món hàng] + [Số lượng] + 주세요" (Vui lòng đưa cho tôi...). Khi đi với từ chỉ đơn vị "봉지" (gói), "둘" rút gọn thành "두".',
    vocabNotes: [
      { word: '딸기 씨앗', phonetic: 'ttal-gi ssi-at', posVi: 'danh từ', meaningVi: 'hạt giống dâu tây' },
      { word: '봉지', phonetic: 'bong-ji', posVi: 'danh từ đơn vị', meaningVi: 'gói, túi nhỏ' },
      { word: '주세요', phonetic: 'ju-se-yo', posVi: 'biểu hiện', meaningVi: 'hãy cho tôi / làm ơn đưa giúp' },
    ],
  },
  {
    id: 'ko_b3_sent_1',
    lang: 'ko',
    tier: 'beginner',
    levelBand: 3,
    format: 'sentence_builder',
    promptVi: 'Sắp xếp thành câu chuẩn: "Hôm qua tôi đã trồng cà rốt ở nông trại."',
    stemText: 'Hôm qua tôi đã trồng cà rốt ở nông trại.',
    fullSentence: '어제 농장에서 당근을 심었어요.',
    fullPhonetic: 'Eo-je nong-jang-e-seo dang-geu-neul si-meo-sseo-yo.',
    translationVi: 'Hôm qua tôi đã trồng cà rốt ở nông trại.',
    orderedTokens: ['어제', '농장에서', '당근을', '심었어요.'],
    distractorTokens: ['농장에'],
    grammarTitleVi: 'Trật tự câu tiếng Hàn (Thời gian + Nơi chốn 에서 + Tân ngữ + Động từ quá khứ)',
    grammarExplainVi: 'Hành động diễn ra TẠI một địa điểm phải dùng tiểu từ "에서" ("농장에서"), không dùng "에". Động từ luôn đứng cuối câu: "심다" chia quá khứ lịch sự thành "심었어요".',
    vocabNotes: [
      { word: '농장에서', phonetic: 'nong-jang-e-seo', posVi: 'trạng ngữ', meaningVi: 'tại nông trại (nơi diễn ra hành động)' },
      { word: '당근', phonetic: 'dang-geun', posVi: 'danh từ', meaningVi: 'củ cà rốt' },
      { word: '심다', phonetic: 'sim-da', posVi: 'động từ', meaningVi: 'gieo trồng' },
    ],
  },
  {
    id: 'ko_b4_cloze_1',
    lang: 'ko',
    tier: 'intermediate',
    levelBand: 4,
    format: 'grammar_cloze',
    promptVi: 'Chọn cấu trúc biểu thị mong muốn ("muốn làm gì"):',
    stemText: '이번 주말에는 달콤한 호박 파이를 ____.',
    stemPhonetic: 'I-beon ju-ma-re-neun dal-kom-han ho-bak pa-i-reul ____.',
    fullSentence: '이번 주말에는 달콤한 호박 파이를 만들고 싶어요.',
    fullPhonetic: 'I-beon ju-ma-re-neun dal-kom-han ho-bak pa-i-reul man-deul-go si-peo-yo.',
    translationVi: 'Cuối tuần này tôi muốn làm bánh nướng bí ngô ngọt ngào.',
    choices: ['만들고 싶어요', '만들지 마세요', '만든 적이 없어요', '만들기 때문이에요'],
    choicePhonetics: ['man-deul-go si-peo-yo', 'man-deul-ji ma-se-yo', 'man-deun jeo-gi eop-seo-yo', 'man-deul-gi ttae-mu-ni-e-yo'],
    correctIndex: 0,
    grammarTitleVi: 'Diễn tả mong muốn của ngôi thứ nhất: V + -고 싶다 (Muốn làm V)',
    grammarExplainVi: 'Gốc động từ "만들다" (làm/chế biến) gắn trực tiếp "-고 싶어요" để diễn tả mong muốn của người nói. ("-지 마세요" = đừng làm; "-ㄴ 적이 없다" = chưa từng).',
    vocabNotes: [
      { word: '이번 주말', phonetic: 'i-beon ju-mal', posVi: 'danh từ', meaningVi: 'cuối tuần này' },
      { word: '달콤하다', phonetic: 'dal-kom-ha-da', posVi: 'tính từ', meaningVi: 'ngọt ngào, thơm ngọt' },
      { word: '만들다', phonetic: 'man-deul-da', posVi: 'động từ', meaningVi: 'làm ra, chế biến' },
    ],
  },
  {
    id: 'ko_b5_cloze_1',
    lang: 'ko',
    tier: 'intermediate',
    levelBand: 5,
    format: 'grammar_cloze',
    promptVi: 'Chọn liên kết nguyên nhân đi được với câu mệnh lệnh/rủ rê phía sau:',
    stemText: '비____ 오니까 창문을 꼭 닫으세요.',
    stemPhonetic: 'Bi____ o-ni-kka chang-mu-neul kkok da-deu-se-yo.',
    fullSentence: '비가 오니까 창문을 꼭 닫으세요.',
    fullPhonetic: 'Bi-ga o-ni-kka chang-mu-neul kkok da-deu-se-yo.',
    translationVi: 'Vì trời đang mưa nên bạn hãy nhớ đóng chặt cửa sổ nhé.',
    choices: ['가', '를', '에', '에서'],
    choicePhonetics: ['ga', 'reul', 'e', 'e-seo'],
    correctIndex: 0,
    grammarTitleVi: 'Cụm cố định "비가 오다" (Trời mưa) + Liên từ -(으)니까 đi với câu mệnh lệnh -(으)세요',
    grammarExplainVi: 'Trong tiếng Hàn, "mưa rơi" luôn dùng chủ ngữ "비가 오다" (tiểu từ chủ ngữ 가 vì 비 không có patchim). Đặc biệt, vế sau có đuôi mệnh lệnh "-으세요" nên vế nguyên nhân bắt buộc dùng "-(으)니까" chứ không dùng "-아서/어서".',
    vocabNotes: [
      { word: '비가 오다', phonetic: 'bi-ga o-da', posVi: 'cụm động từ', meaningVi: 'trời mưa' },
      { word: '창문', phonetic: 'chang-mun', posVi: 'danh từ', meaningVi: 'cửa sổ' },
      { word: '꼭 닫다', phonetic: 'kkok dat-da', posVi: 'động từ', meaningVi: 'đóng kỹ, khép chặt' },
    ],
  },
  {
    id: 'ko_b6_cloze_1',
    lang: 'ko',
    tier: 'intermediate',
    levelBand: 6,
    format: 'grammar_cloze',
    promptVi: 'Chọn cấu trúc thử nghiệm hành động (TOPIK 3):',
    stemText: '직접 기른 허브로 따뜻한 차를 끓여 ____.',
    stemPhonetic: 'Jik-jeop gi-reun heo-beu-ro tta-tteu-than cha-reul kkeu-ryeo ____.',
    fullSentence: '직접 기른 허브로 따뜻한 차를 끓여 봤어요.',
    fullPhonetic: 'Jik-jeop gi-reun heo-beu-ro tta-tteu-than cha-reul kkeu-ryeo bwa-sseo-yo.',
    translationVi: 'Tôi đã thử pha trà ấm bằng thảo mộc tự tay mình trồng.',
    choices: ['봤어요', '버렸어요', '주셨어요', '나갔어요'],
    choicePhonetics: ['bwa-sseo-yo', 'beo-ryeo-sseo-yo', 'ju-syeo-sseo-yo', 'na-ga-sseo-yo'],
    correctIndex: 0,
    grammarTitleVi: 'Trợ động từ trải nghiệm/thử làm: V-아/어 보다 (Thử làm gì / Đã từng trải nghiệm)',
    grammarExplainVi: '"끓이다" (đun/pha trà) chia sang "끓여" + "봤어요" (quá khứ của 보다) mang nghĩa "đã thử pha và trải nghiệm".',
    vocabNotes: [
      { word: '직접 기르다', phonetic: 'jik-jeop gi-reu-da', posVi: 'động từ', meaningVi: 'tự tay nuôi trồng' },
      { word: '허브', phonetic: 'heo-beu', posVi: 'danh từ', meaningVi: 'thảo mộc' },
      { word: '차를 끓이다', phonetic: 'cha-reul kkeu-ri-da', posVi: 'cụm động từ', meaningVi: 'đun / hãm trà' },
    ],
  },
  {
    id: 'ko_b8_cloze_1',
    lang: 'ko',
    tier: 'advanced',
    levelBand: 8,
    format: 'grammar_cloze',
    promptVi: 'Chọn cấu trúc TOPIK 5 diễn tả "Càng... lại càng...":',
    stemText: '외국어는 매일 꾸준히 연습____ 실력이 빠르게 늘어난다.',
    stemPhonetic: 'Oe-gu-geo-neun mae-il kku-ju-ni yeon-seup____ sil-lyeo-gi ppa-reu-ge neu-reo-nan-da.',
    fullSentence: '외국어는 매일 꾸준히 연습할수록 실력이 빠르게 늘어난다.',
    fullPhonetic: 'Oe-gu-geo-neun mae-il kku-ju-ni yeon-seup-hal-su-rok sil-lyeo-gi ppa-reu-ge neu-reo-nan-da.',
    translationVi: 'Ngoại ngữ càng luyện tập đều đặn mỗi ngày thì năng lực càng tiến bộ nhanh chóng.',
    choices: ['할수록', '하느라고', '하더라도', '하자마자'],
    choicePhonetics: ['hal-su-rok', 'ha-neu-ra-go', 'ha-deo-ra-do', 'ha-ja-ma-ja'],
    correctIndex: 0,
    grammarTitleVi: 'Cấu trúc tỉ lệ thuận nâng cao: V-(으)ㄹ수록 (Càng... thì càng...)',
    grammarExplainVi: '"-(으)ㄹ수록" gắn vào gốc động từ/tính từ để nhấn mạnh mức độ tăng tiến song hành. ("-느라고" = mải làm gì nên...; "-더라도" = cho dù; "-자마자" = ngay khi vừa).',
    vocabNotes: [
      { word: '꾸준히', phonetic: 'kku-ju-ni', posVi: 'trạng từ', meaningVi: 'đều đặn, bền bỉ' },
      { word: '실력', phonetic: 'sil-lyeok', posVi: 'danh từ', meaningVi: 'thực lực, trình độ' },
      { word: '늘어나다', phonetic: 'neu-reo-na-da', posVi: 'động từ', meaningVi: 'tăng lên, tiến bộ' },
    ],
  },
  {
    id: 'ko_b10_cloze_1',
    lang: 'ko',
    tier: 'advanced',
    levelBand: 10,
    format: 'grammar_cloze',
    promptVi: 'Chọn tục ngữ Hàn Quốc (TOPIK 6) tương đương "Tích tiểu thành đại":',
    stemText: '작은 씨앗도 정성껏 모으면 큰 수확이 된다. 말 그대로 ____이다.',
    stemPhonetic: 'Ja-geun ssi-at-do jeong-seong-kkeot mo-eu-myeon keun su-hwa-gi doen-da.',
    fullSentence: '작은 씨앗도 정성껏 모으면 큰 수확이 된다. 말 그대로 티끌 모아 태산이다.',
    fullPhonetic: 'Ja-geun ssi-at-do jeong-seong-kkeot mo-eu-myeon keun su-hwa-gi doen-da. Mal geu-dae-ro ti-kkeul mo-a tae-sa-ni-da.',
    translationVi: 'Hạt giống nhỏ gom góp tận tâm cũng thành vụ mùa lớn. Đúng nghĩa góp bụi thành núi Thái Sơn (Tích tiểu thành đại).',
    choices: ['티끌 모아 태산', '그림의 떡', '우물 안 개구리', '식은 죽 먹기'],
    choicePhonetics: ['ti-kkeul mo-a tae-san', 'geu-ri-mui tteok', 'u-mul an gae-gu-ri', 'si-geun juk meok-gi'],
    correctIndex: 0,
    grammarTitleVi: 'Tục ngữ kinh điển TOPIK 6: 티끌 모아 태산 (Góp hạt bụi thành núi Thái Sơn)',
    grammarExplainVi: '"티끌" (hạt bụi nhỏ) + "모아" (gom lại) + "태산" (núi lớn Thái Sơn) = Tích tiểu thành đại. ("그림의 떡" = bánh vẽ; "우물 안 개구리" = ếch ngồi đáy giếng; "식은 죽 먹기" = dễ như ăn cháo nguội).',
    vocabNotes: [
      { word: '정성껏', phonetic: 'jeong-seong-kkeot', posVi: 'trạng từ', meaningVi: 'hết lòng, tận tâm' },
      { word: '수확', phonetic: 'su-hwak', posVi: 'danh từ', meaningVi: 'vụ thu hoạch' },
      { word: '티끌 모아 태산', phonetic: 'ti-kkeul mo-a tae-san', posVi: 'tục ngữ', meaningVi: 'tích tiểu thành đại' },
    ],
  },

  // ======================== 3. TIẾNG TRUNG (ZH) — Lv 1..100 ========================
  {
    id: 'zh_b1_cloze_1',
    lang: 'zh',
    tier: 'beginner',
    levelBand: 1,
    format: 'grammar_cloze',
    promptVi: 'Chọn lượng từ chuẩn trong tiếng Trung HSK 1:',
    stemText: '我想买三____红苹果。',
    stemPhonetic: 'Wǒ xiǎng mǎi sān ____ hóng píngguǒ.',
    fullSentence: '我想买三个红苹果。',
    fullPhonetic: 'Wǒ xiǎng mǎi sān gè hóng píngguǒ.',
    translationVi: 'Tôi muốn mua ba quả táo đỏ.',
    choices: ['个', '本', '张', '条'],
    choicePhonetics: ['gè', 'běn', 'zhāng', 'tiáo'],
    correctIndex: 0,
    grammarTitleVi: 'Cấu trúc Số từ + Lượng từ + Danh từ: 三 + 个 + 苹果',
    grammarExplainVi: 'Trong tiếng Trung, giữa số đếm và danh từ bắt buộc phải có lượng từ. "个 (gè)" dùng cho quả táo; "本" cho sách; "张" cho vật phẳng (giấy/bàn); "条" cho vật thon dài.',
    vocabNotes: [
      { word: '想买', phonetic: 'xiǎng mǎi', posVi: 'động từ', meaningVi: 'muốn mua' },
      { word: '个', phonetic: 'gè', posVi: 'lượng từ', meaningVi: 'cái, quả, người (lượng từ phổ biến nhất)' },
      { word: '红苹果', phonetic: 'hóng píngguǒ', posVi: 'danh từ', meaningVi: 'quả táo đỏ' },
    ],
  },
  {
    id: 'zh_b2_sent_1',
    lang: 'zh',
    tier: 'beginner',
    levelBand: 2,
    format: 'sentence_builder',
    promptVi: 'Xếp các mảnh từ thành câu chuẩn: "Hôm nay thời tiết rất ấm áp."',
    stemText: 'Hôm nay thời tiết rất ấm áp.',
    fullSentence: '今天天气很暖和。',
    fullPhonetic: 'Jīntiān tiānqì hěn nuǎnhuo.',
    translationVi: 'Hôm nay thời tiết rất ấm áp.',
    orderedTokens: ['今天', '天气', '很', '暖和。'],
    distractorTokens: ['是'],
    grammarTitleVi: 'Câu vị ngữ tính từ tiếng Trung: Chủ ngữ + 很 + Tính từ (KHÔNG dùng 是)',
    grammarExplainVi: 'Khi vị ngữ là tính từ ("暖和" - ấm áp), tiếng Trung nối chủ ngữ với tính từ bằng phó từ chỉ mức độ "很 (hěn)", tuyệt đối không dùng "是 (shì)" như tiếng Anh.',
    vocabNotes: [
      { word: '今天', phonetic: 'jīntiān', posVi: 'danh từ', meaningVi: 'hôm nay' },
      { word: '天气', phonetic: 'tiānqì', posVi: 'danh từ', meaningVi: 'thời tiết' },
      { word: '暖和', phonetic: 'nuǎnhuo', posVi: 'tính từ', meaningVi: 'ấm áp dễ chịu' },
    ],
  },
  {
    id: 'zh_b3_dial_1',
    lang: 'zh',
    tier: 'beginner',
    levelBand: 3,
    format: 'dialogue_reply',
    promptVi: 'Chọn câu trả lời tự nhiên nhất cho câu hỏi giá cả ở chợ:',
    stemText: '顾客：“这袋小麦种子多少钱？”',
    stemPhonetic: 'Gùkè: "Zhè dài xiǎomài zhǒngzi duōshao qián?"',
    fullSentence: '一共二十块金币。',
    fullPhonetic: 'Yígòng èrshí kuài jīnbì.',
    translationVi: 'Tổng cộng là hai mươi đồng vàng.',
    choices: [
      '一共二十块金币。',
      '昨天下午三点半。',
      '在果园的北边。',
      '我也很喜欢喝茶。',
    ],
    choicePhonetics: [
      'Yígòng èrshí kuài jīnbì.',
      'Zuótiān xiàwǔ sān diǎn bàn.',
      'Zài guǒyuán de běibiān.',
      'Wǒ yě hěn xǐhuan hē chá.',
    ],
    correctIndex: 0,
    grammarTitleVi: 'Hỏi và báo giá: 多少钱？(Bao nhiêu tiền?) → 一共 + Số tiền + 块 (Tổng cộng...)',
    grammarExplainVi: '"多少钱 (duōshao qián)" hỏi giá tiền. Đáp lại bằng "一共 (yígòng - tổng cộng) + số tiền + 块 (kuài - đồng)".',
    vocabNotes: [
      { word: '种子', phonetic: 'zhǒngzi', posVi: 'danh từ', meaningVi: 'hạt giống' },
      { word: '多少钱', phonetic: 'duōshao qián', posVi: 'cụm từ hỏi', meaningVi: 'bao nhiêu tiền' },
      { word: '一共', phonetic: 'yígòng', posVi: 'phó từ', meaningVi: 'tổng cộng, hết thảy' },
    ],
  },
  {
    id: 'zh_b5_cloze_1',
    lang: 'zh',
    tier: 'intermediate',
    levelBand: 5,
    format: 'grammar_cloze',
    promptVi: 'Hoàn thành câu chữ 把 (HSK 3) diễn tả xử lý tân ngữ kèm kết quả:',
    stemText: '请____这些新鲜的草莓放进篮子里。',
    stemPhonetic: 'Qǐng ____ zhèxiē xīnxiān de cǎoméi fàng jìn lánzi lǐ.',
    fullSentence: '请把这些新鲜的草莓放进篮子里。',
    fullPhonetic: 'Qǐng bǎ zhèxiē xīnxiān de cǎoméi fàng jìn lánzi lǐ.',
    translationVi: 'Xin hãy xếp những quả dâu tây tươi này vào trong giỏ.',
    choices: ['把', '被', '比', '从'],
    choicePhonetics: ['bǎ', 'bèi', 'bǐ', 'cóng'],
    correctIndex: 0,
    grammarTitleVi: 'Câu chữ 把 (Bǎ): S + 把 + Tân ngữ xác định + Động từ + Bổ ngữ kết quả/xu hướng',
    grammarExplainVi: 'Khi muốn nhấn mạnh tác động làm thay đổi vị trí/trạng thái của một vật xác định ("这些草莓" -> "放进篮子里" đặt vào trong giỏ), tiếng Trung dùng giới từ "把" đưa tân ngữ lên trước động từ.',
    vocabNotes: [
      { word: '把', phonetic: 'bǎ', posVi: 'giới từ', meaningVi: 'đem / lấy (dùng trước tân ngữ bị tác động)' },
      { word: '草莓', phonetic: 'cǎoméi', posVi: 'danh từ', meaningVi: 'quả dâu tây' },
      { word: '篮子', phonetic: 'lánzi', posVi: 'danh từ', meaningVi: 'cái giỏ, rổ' },
    ],
  },
  {
    id: 'zh_b6_cloze_1',
    lang: 'zh',
    tier: 'intermediate',
    levelBand: 6,
    format: 'grammar_cloze',
    promptVi: 'Chọn cặp liên từ điều kiện chuẩn HSK 4:',
    stemText: '____坚持每天浇水，胡萝卜很快就能丰收。',
    stemPhonetic: '____ jiānchí měitiān jiāoshuǐ, húluóbo hěn kuài jiù néng fēngshōu.',
    fullSentence: '只要坚持每天浇水，胡萝卜很快就能丰收。',
    fullPhonetic: 'Zhǐyào jiānchí měitiān jiāoshuǐ, húluóbo hěn kuài jiù néng fēngshōu.',
    translationVi: 'Chỉ cần kiên trì tưới nước mỗi ngày thì cà rốt chẳng mấy chốc sẽ bội thu.',
    choices: ['只要', '虽然', '尽管', '不但'],
    choicePhonetics: ['zhǐyào', 'suīrán', 'jǐnguǎn', 'búdàn'],
    correctIndex: 0,
    grammarTitleVi: 'Điều kiện đủ: 只要 …… 就 …… (Chỉ cần... thì sẽ...)',
    grammarExplainVi: 'Vế sau có phó từ "就 (jiù)" sóng đôi với "只要 (zhǐyào)" để diễn tả điều kiện đủ dẫn tới kết quả thuận lợi. ("虽然/尽管" đi với "但是"; "不但" đi với "而且").',
    vocabNotes: [
      { word: '只要…就…', phonetic: 'zhǐyào... jiù...', posVi: 'liên từ', meaningVi: 'chỉ cần... thì liền...' },
      { word: '浇水', phonetic: 'jiāoshuǐ', posVi: 'động từ ly hợp', meaningVi: 'tưới nước' },
      { word: '丰收', phonetic: 'fēngshōu', posVi: 'động từ/danh từ', meaningVi: 'được mùa, bội thu' },
    ],
  },
  {
    id: 'zh_b8_cloze_1',
    lang: 'zh',
    tier: 'advanced',
    levelBand: 8,
    format: 'grammar_cloze',
    promptVi: 'Chọn liên từ nhượng bộ văn viết HSK 5:',
    stemText: '____山谷里的气候变幻莫测，园丁们依然按时完成了播种。',
    stemPhonetic: '____ shāngǔ lǐ de qìhòu biànhuàn mòcè, yuándīngmen yīrán ànshí wánchéng le bōzhǒng.',
    fullSentence: '尽管山谷里的气候变幻莫测，园丁们依然按时完成了播种。',
    fullPhonetic: 'Jǐnguǎn shāngǔ lǐ de qìhòu biànhuàn mòcè, yuándīngmen yīrán ànshí wánchéng le bōzhǒng.',
    translationVi: 'Cho dù khí hậu trong thung lũng biến đổi khôn lường, những người làm vườn vẫn hoàn thành gieo hạt đúng hạn.',
    choices: ['尽管', '既然', '以免', '何况'],
    choicePhonetics: ['jǐnguǎn', 'jìrán', 'yǐmiǎn', 'hékuàng'],
    correctIndex: 0,
    grammarTitleVi: 'Nhượng bộ trang trọng: 尽管 …… 依然/还是 …… (Mặc dù... vẫn cứ...)',
    grammarExplainVi: '"尽管 (jǐnguǎn)" kết hợp với "依然 (yīrán - vẫn như cũ)" ở mệnh đề sau tạo cấu trúc nhượng bộ trang trọng. ("既然" = đã... thì; "以免" = để tránh; "何况" = huống hồ).',
    vocabNotes: [
      { word: '变幻莫测', phonetic: 'biànhuàn mòcè', posVi: 'thành ngữ', meaningVi: 'biến đổi khôn lường' },
      { word: '依然', phonetic: 'yīrán', posVi: 'phó từ', meaningVi: 'vẫn, vẫn cứ như xưa' },
      { word: '播种', phonetic: 'bōzhǒng', posVi: 'động từ', meaningVi: 'gieo hạt giống' },
    ],
  },
  {
    id: 'zh_b10_cloze_1',
    lang: 'zh',
    tier: 'advanced',
    levelBand: 10,
    format: 'grammar_cloze',
    promptVi: 'Chọn thành ngữ 4 chữ (HSK 6) chỉ sự nôn nóng làm hỏng quy luật tự nhiên:',
    stemText: '学习语言和培育作物一样需要循序渐进，切忌____。',
    stemPhonetic: 'Xuéxí yǔyán hé péiyù zuòwù yíyàng xūyào xúnxù jiànjìn, qièjì ____.',
    fullSentence: '学习语言和培育作物一样需要循序渐进，切忌拔苗助长。',
    fullPhonetic: 'Xuéxí yǔyán hé péiyù zuòwù yíyàng xūyào xúnxù jiànjìn, qièjì bámiáo zhùzhǎng.',
    translationVi: 'Học ngôn ngữ cũng giống như ươm trồng mùa vụ, cần tiến từng bước vững chắc, tuyệt đối tránh "nhổ mạ giúp cây mau lớn" (đốt cháy giai đoạn).',
    choices: ['拔苗助长', '锦上添花', '一举两得', '得天独厚'],
    choicePhonetics: ['bámiáo zhùzhǎng', 'jǐnshàng tiānhuā', 'yìjǔ liǎngdé', 'détiān dúhòu'],
    correctIndex: 0,
    grammarTitleVi: 'Thành ngữ điển cố HSK 6: 拔苗助长 (Nhổ mạ giúp cây lớn — dục tốc bất đạt)',
    grammarExplainVi: '"切忌 (qièjì - tối kỵ/tránh)" đòi hỏi thành ngữ mang nghĩa tiêu cực về sự nóng vội: "拔苗助长" (kéo cây mạ lên cho cao nhanh khiến mạ héo chết). Các đáp án kia đều mang nghĩa tích cực.',
    vocabNotes: [
      { word: '循序渐进', phonetic: 'xúnxù jiànjìn', posVi: 'thành ngữ', meaningVi: 'tiến bước tuần tự từ thấp đến cao' },
      { word: '切忌', phonetic: 'qièjì', posVi: 'động từ', meaningVi: 'tuyệt đối kiêng kỵ, chớ có' },
      { word: '拔苗助长', phonetic: 'bámiáo zhùzhǎng', posVi: 'thành ngữ', meaningVi: 'nóng vội đốt cháy giai đoạn làm hỏng việc' },
    ],
  },

  // ======================== 4. TÂY BAN NHA (ES) — Lv 1..100 ========================
  {
    id: 'es_b1_cloze_1',
    lang: 'es',
    tier: 'beginner',
    levelBand: 1,
    format: 'grammar_cloze',
    promptVi: 'Chia động từ "tener" (có) đúng với chủ ngữ "nosotros" (chúng tôi):',
    stemText: 'Nosotros ____ muchas semillas de girasol en el granero.',
    stemPhonetic: 'No-so-tros ____ mu-chas se-mi-yas de hi-ra-sol en el gra-ne-ro.',
    fullSentence: 'Nosotros tenemos muchas semillas de girasol en el granero.',
    fullPhonetic: 'No-so-tros te-ne-mos mu-chas se-mi-yas de hi-ra-sol en el gra-ne-ro.',
    translationVi: 'Chúng tôi có nhiều hạt giống hướng dương trong kho thóc.',
    choices: ['tengo', 'tienes', 'tenemos', 'tienen'],
    choicePhonetics: ['ten-go', 'tie-nes', 'te-ne-mos', 'tie-nen'],
    correctIndex: 2,
    grammarTitleVi: 'Chia động từ Tener ở Hiện tại: yo tengo, tú tienes, él tiene, nosotros tenemos',
    grammarExplainVi: 'Chủ ngữ "Nosotros" (chúng tôi) luôn nhận đuôi "-emos / -imos" ở thì hiện tại -> "tenemos".',
    vocabNotes: [
      { word: 'semillas', phonetic: 'se-mi-yas', posVi: 'danh từ (cái)', meaningVi: 'những hạt giống' },
      { word: 'girasol', phonetic: 'hi-ra-sol', posVi: 'danh từ (đực)', meaningVi: 'hoa hướng dương (quay theo mặt trời)' },
      { word: 'el granero', phonetic: 'el gra-ne-ro', posVi: 'danh từ', meaningVi: 'kho nông sản / kho thóc' },
    ],
  },
  {
    id: 'es_b2_sent_1',
    lang: 'es',
    tier: 'beginner',
    levelBand: 2,
    format: 'sentence_builder',
    promptVi: 'Xếp câu tiếng Tây Ban Nha: "Những quả táo đỏ rất ngon."',
    stemText: 'Những quả táo đỏ rất ngon.',
    fullSentence: 'Las manzanas rojas son muy deliciosas.',
    fullPhonetic: 'Las man-sa-nas ro-has son muy de-li-sio-sas.',
    translationVi: 'Những quả táo đỏ rất ngon.',
    orderedTokens: ['Las', 'manzanas', 'rojas', 'son', 'muy', 'deliciosas.'],
    distractorTokens: ['Los'],
    grammarTitleVi: 'Sự hòa hợp Giống & Số (Concordancia): Danh từ giống cái số nhiều + Tính từ đuôi -as',
    grammarExplainVi: '"Manzanas" là danh từ giống cái số nhiều ("Las"), nên cả tính từ chỉ màu sắc đặt sau danh từ ("rojas") lẫn tính từ vị ngữ ("deliciosas") đều phải đổi đuôi sang "-as".',
    vocabNotes: [
      { word: 'las manzanas', phonetic: 'las man-sa-nas', posVi: 'danh từ (cái)', meaningVi: 'những quả táo' },
      { word: 'rojas', phonetic: 'ro-has', posVi: 'tính từ', meaningVi: 'màu đỏ (giống cái số nhiều)' },
      { word: 'deliciosas', phonetic: 'de-li-sio-sas', posVi: 'tính từ', meaningVi: 'thơm ngon' },
    ],
  },
  {
    id: 'es_b3_dial_1',
    lang: 'es',
    tier: 'beginner',
    levelBand: 3,
    format: 'dialogue_reply',
    promptVi: 'Người hàng xóm hỏi thăm bạn ngoài vườn — chọn câu đáp phù hợp nhất:',
    stemText: 'Vecino: "¿Qué vas a plantar esta tarde en la huerta?"',
    stemPhonetic: 'Be-si-no: "¿Ke bas a plan-tar es-ta tar-de en la uer-ta?"',
    fullSentence: 'Voy a plantar tomates y zanahorias frescas.',
    fullPhonetic: 'Boy a plan-tar to-ma-tes i sa-na-o-rias fres-kas.',
    translationVi: 'Tôi định trồng cà chua và cà rốt tươi.',
    choices: [
      'Voy a plantar tomates y zanahorias frescas.',
      'Ayer comimos sopa de setas.',
      'La biblioteca está cerrada hoy.',
      'Me llamo Carlos y soy médico.',
    ],
    correctIndex: 0,
    grammarTitleVi: 'Tương lai gần: Ir (voy/vas/va...) + a + Động từ nguyên mẫu (Sắp / Định làm gì)',
    grammarExplainVi: 'Câu hỏi dùng "¿Qué vas a plantar?" (Bạn định trồng gì?). Đáp lại ngôi "yo" bằng "Voy a plantar..." (Tôi định trồng...).',
    vocabNotes: [
      { word: 'plantar', phonetic: 'plan-tar', posVi: 'động từ', meaningVi: 'gieo trồng' },
      { word: 'la huerta', phonetic: 'la uer-ta', posVi: 'danh từ', meaningVi: 'vườn rau quả' },
      { word: 'zanahorias', phonetic: 'sa-na-o-rias', posVi: 'danh từ', meaningVi: 'những củ cà rốt' },
    ],
  },
  {
    id: 'es_b5_cloze_1',
    lang: 'es',
    tier: 'intermediate',
    levelBand: 5,
    format: 'grammar_cloze',
    promptVi: 'Phân biệt giới từ "por" và "para" (DELE B1):',
    stemText: 'Preparamos esta tarta de manzana especialmente ____ celebrar la cosecha.',
    stemPhonetic: 'Pre-pa-ra-mos es-ta tar-ta de man-sa-na es-pe-sial-men-te ____ se-le-brar la ko-se-cha.',
    fullSentence: 'Preparamos esta tarta de manzana especialmente para celebrar la cosecha.',
    fullPhonetic: 'Pre-pa-ra-mos es-ta tar-ta de man-sa-na es-pe-sial-men-te pa-ra se-le-brar la ko-se-cha.',
    translationVi: 'Chúng tôi chuẩn bị chiếc bánh táo này đặc biệt để mừng mùa thu hoạch.',
    choices: ['para', 'por', 'desde', 'según'],
    correctIndex: 0,
    grammarTitleVi: 'Phân biệt Para (mục đích / người nhận) và Por (nguyên nhân / phương tiện)',
    grammarExplainVi: 'Khi đứng trước động từ nguyên mẫu để chỉ MỤC ĐÍCH ("để ăn mừng mùa gặt" — celebrar la cosecha), tiếng Tây Ban Nha luôn dùng "para + Infinitivo".',
    vocabNotes: [
      { word: 'tarta de manzana', phonetic: 'tar-ta de man-sa-na', posVi: 'danh từ', meaningVi: 'bánh nướng nhân táo' },
      { word: 'celebrar', phonetic: 'se-le-brar', posVi: 'động từ', meaningVi: 'ăn mừng, kỷ niệm' },
      { word: 'la cosecha', phonetic: 'la ko-se-cha', posVi: 'danh từ', meaningVi: 'vụ mùa thu hoạch' },
    ],
  },
  {
    id: 'es_b7_cloze_1',
    lang: 'es',
    tier: 'intermediate',
    levelBand: 7,
    format: 'grammar_cloze',
    promptVi: 'Chia đúng Giả định thức hiện tại (Presente de Subjuntivo — B2):',
    stemText: 'Te recomiendo que ____ las lavandas antes de que salga el sol.',
    stemPhonetic: 'Te re-ko-mien-do ke ____ las la-ban-das an-tes de ke sal-ga el sol.',
    fullSentence: 'Te recomiendo que riegues las lavandas antes de que salga el sol.',
    fullPhonetic: 'Te re-ko-mien-do ke rie-ges las la-ban-das an-tes de ke sal-ga el sol.',
    translationVi: 'Tôi khuyên bạn nên tưới những luống oải hương trước khi mặt trời mọc.',
    choices: ['riegas', 'riegues', 'regarás', 'regabas'],
    correctIndex: 1,
    grammarTitleVi: 'Khuyên nhủ với Subjuntivo: recomendar que + S + Động từ chia Subjuntivo',
    grammarExplainVi: 'Sau "recomendar que" (khuyên ai làm gì), động từ "regar" (tưới cây, biến đổi nguyên âm e->ie, g->gu trước e) ở ngôi "tú" phải chia ở Subjuntivo là "riegues" (chứ không dùng Hiện tại thường "riegas").',
    vocabNotes: [
      { word: 'recomendar', phonetic: 're-ko-men-dar', posVi: 'động từ', meaningVi: 'khuyên, gợi ý' },
      { word: 'regar', phonetic: 're-gar', posVi: 'động từ', meaningVi: 'tưới nước cho cây' },
      { word: 'salga el sol', phonetic: 'sal-ga el sol', posVi: 'cụm từ', meaningVi: 'mặt trời mọc (salir ở Subjuntivo)' },
    ],
  },
  {
    id: 'es_b9_cloze_1',
    lang: 'es',
    tier: 'advanced',
    levelBand: 9,
    format: 'grammar_cloze',
    promptVi: 'Hoàn thành câu điều kiện không có thật trong quá khứ (DELE C1):',
    stemText: 'Si ____ sabido que helaría anoche, habríamos cubierto el invernadero.',
    stemPhonetic: 'Si ____ sa-bi-do ke e-la-ri-a a-no-che, a-bri-a-mos ku-bier-to el in-ber-na-de-ro.',
    fullSentence: 'Si hubiéramos sabido que helaría anoche, habríamos cubierto el invernadero.',
    fullPhonetic: 'Si u-bie-ra-mos sa-bi-do ke e-la-ri-a a-no-che, a-bri-a-mos ku-bier-to el in-ber-na-de-ro.',
    translationVi: 'Giá như chúng tôi biết đêm qua trời có sương giá thì chúng tôi đã che phủ nhà kính rồi.',
    choices: ['hubiéramos', 'habremos', 'hemos', 'habíamos'],
    correctIndex: 0,
    grammarTitleVi: 'Điều kiện loại 3 tiếng Tây Ban Nha: Si + Pluscuamperfecto de Subjuntivo, Condicional Compuesto',
    grammarExplainVi: 'Mệnh đề Si trái với quá khứ bắt buộc dùng "hubiéramos + phân từ hai (sabido)", kết hợp với "habríamos + phân từ hai (cubierto)" ở mệnh đề chính.',
    vocabNotes: [
      { word: 'helar', phonetic: 'e-lar', posVi: 'động từ', meaningVi: 'đóng băng, có sương giá' },
      { word: 'cubrir', phonetic: 'ku-brir', posVi: 'động từ', meaningVi: 'che chắn (phân từ bất quy tắc: cubierto)' },
      { word: 'el invernadero', phonetic: 'el in-ber-na-de-ro', posVi: 'danh từ', meaningVi: 'nhà kính trồng cây' },
    ],
  },
  {
    id: 'es_b10_sent_1',
    lang: 'es',
    tier: 'advanced',
    levelBand: 10,
    format: 'sentence_builder',
    promptVi: 'Xếp câu C2 với cấu trúc nhượng bộ "Por muy... que + Subjuntivo": "Dù mùa đông có khắc nghiệt đến đâu, hạt giống vẫn nảy mầm."',
    stemText: 'Dù mùa đông có khắc nghiệt đến đâu, hạt giống vẫn nảy mầm.',
    fullSentence: 'Por muy duro que sea el invierno, las semillas brotarán.',
    fullPhonetic: 'Por muy du-ro ke se-a el in-bier-no, las se-mi-yas bro-ta-ran.',
    translationVi: 'Dù mùa đông có khắc nghiệt đến đâu, những hạt giống vẫn sẽ nảy mầm.',
    orderedTokens: ['Por', 'muy', 'duro', 'que', 'sea', 'el', 'invierno,', 'las', 'semillas', 'brotarán.'],
    grammarTitleVi: 'Cấu trúc nhượng bộ bậc C2: Por muy + Tính từ + que + Subjuntivo (sea)',
    grammarExplainVi: '"Por muy + adj + que + Subjuntivo" tương đương "However harsh winter may be" — vì nói về khả năng mang tính giả định ở tương lai nên động từ "ser" chia thành "sea".',
    vocabNotes: [
      { word: 'por muy... que', phonetic: 'por muy... ke', posVi: 'cấu trúc', meaningVi: 'cho dù... đến mức nào đi nữa' },
      { word: 'el invierno', phonetic: 'el in-bier-no', posVi: 'danh từ', meaningVi: 'mùa đông' },
      { word: 'brotar', phonetic: 'bro-tar', posVi: 'động từ', meaningVi: 'nảy mầm, đâm chồi' },
    ],
  },

  // ======================== 5. TIẾNG NHẬT (JA) — Lv 1..100 ========================
  {
    id: 'ja_b1_cloze_1',
    lang: 'ja',
    tier: 'beginner',
    levelBand: 1,
    format: 'grammar_cloze',
    promptVi: 'Chọn trợ từ đúng chỉ công cụ / phương tiện trong tiếng Nhật N5:',
    stemText: '毎日、じょうろ____花に水をやります。',
    stemPhonetic: 'まいにち、じょうろ____はなにみずをやります • Mainichi, jōro ____ hana ni mizu o yarimasu.',
    fullSentence: '毎日、じょうろで花に水をやります。',
    fullPhonetic: 'まいにち、じょうろではなにみずをやります • Mainichi, jōro de hana ni mizu o yarimasu.',
    translationVi: 'Mỗi ngày tôi tưới nước cho hoa bằng bình tưới.',
    choices: ['で', 'を', 'へ', 'が'],
    choicePhonetics: ['de', 'o', 'e', 'ga'],
    correctIndex: 0,
    grammarTitleVi: 'Trợ từ chỉ công cụ / phương tiện: Danh từ + で + Động từ (Bằng cái gì)',
    grammarExplainVi: '"じょうろ" (bình tưới cây) là dụng cụ thực hiện hành động tưới nước nên đi với trợ từ "で (de)". "花に" chỉ đối tượng nhận nước, "水を" là tân ngữ.',
    vocabNotes: [
      { word: 'じょうろ', phonetic: 'jōro', posVi: 'danh từ', meaningVi: 'bình tưới cây có vòi sen' },
      { word: '花 (はな)', phonetic: 'hana', posVi: 'danh từ', meaningVi: 'bông hoa' },
      { word: '水をやる', phonetic: 'mizu o yaru', posVi: 'cụm động từ', meaningVi: 'tưới nước cho cây' },
    ],
  },
  {
    id: 'ja_b2_dial_1',
    lang: 'ja',
    tier: 'beginner',
    levelBand: 2,
    format: 'dialogue_reply',
    promptVi: 'Chọn câu trả lời tự nhiên khi được mời thưởng thức bánh táo:',
    stemText: 'モリー：「焼きたてのりんごパイはいかがですか。」',
    stemPhonetic: 'Morī: "Yakitate no ringo pai wa ikaga desu ka?"',
    fullSentence: 'ありがとうございます。ぜひいただきます。',
    fullPhonetic: 'Arigatō gozaimasu. Zehi itadakimasu.',
    translationVi: 'Xin cảm ơn ạ. Nhất định tôi xin phép được thưởng thức.',
    choices: [
      'ありがとうございます。ぜひいただきます。',
      'いいえ、きのう買いました。',
      '駅まで歩いて十分です。',
      'まだ雨が降っています。',
    ],
    choicePhonetics: [
      'Arigatō gozaimasu. Zehi itadakimasu.',
      'Iie, kinō kaimashita.',
      'Eki made aruite juppun desu.',
      'Mada ame ga futte imasu.',
    ],
    correctIndex: 0,
    grammarTitleVi: 'Lời mời lịch sự: ～はいかがですか (Bạn dùng... nhé?) → ぜひいただきます',
    grammarExplainVi: '"いかがですか" là cách mời lịch sự. Đáp lại niềm nở bằng "ぜひ (nhất định/rất sẵn lòng) + いただきます (xin phép nhận/thưởng thức món ăn)".',
    vocabNotes: [
      { word: '焼きたて (やきたて)', phonetic: 'yakitate', posVi: 'danh từ/tính từ', meaningVi: 'vừa mới nướng ra lò nóng hổi' },
      { word: 'いかがですか', phonetic: 'ikaga desu ka', posVi: 'biểu hiện', meaningVi: 'thế nào ạ / mời bạn dùng nhé' },
      { word: 'ぜひ', phonetic: 'zehi', posVi: 'phó từ', meaningVi: 'nhất định, rất mong được' },
    ],
  },
  {
    id: 'ja_b4_sent_1',
    lang: 'ja',
    tier: 'intermediate',
    levelBand: 4,
    format: 'sentence_builder',
    promptVi: 'Xếp câu tiếng Nhật N4: "Tôi muốn thử trồng dâu tây ngọt."',
    stemText: 'Tôi muốn thử trồng dâu tây ngọt.',
    fullSentence: '甘い苺を育ててみたいです。',
    fullPhonetic: 'あまいいちごをそだててみたいです • Amai ichigo o sodatete mitai desu.',
    translationVi: 'Tôi muốn thử trồng dâu tây ngọt.',
    orderedTokens: ['甘い', '苺を', '育てて', 'みたいです。'],
    distractorTokens: ['みます。'],
    grammarTitleVi: 'Kết hợp thử làm & mong muốn: V-てみる → V-てみたいです (Muốn thử làm V)',
    grammarExplainVi: 'Động từ nhóm 2 "育てる (sodateru - nuôi trồng)" chia thể て thành "育てて", ghép với "みる" (thử) rồi đổi sang đuôi mong muốn "-たいです" → "育ててみたいです".',
    vocabNotes: [
      { word: '甘い (あまい)', phonetic: 'amai', posVi: 'tính từ -i', meaningVi: 'ngọt' },
      { word: '苺 (いちご)', phonetic: 'ichigo', posVi: 'danh từ', meaningVi: 'quả dâu tây' },
      { word: '育てる (そだてる)', phonetic: 'sodateru', posVi: 'động từ', meaningVi: 'ươm mầm, nuôi trồng' },
    ],
  },
  {
    id: 'ja_b6_cloze_1',
    lang: 'ja',
    tier: 'intermediate',
    levelBand: 6,
    format: 'grammar_cloze',
    promptVi: 'Chọn cấu trúc N3 diễn tả mục đích để đạt tới trạng thái khả năng:',
    stemText: '珍しい薬草の名前を忘れない____、ノートに書いておきます。',
    stemPhonetic: 'めずらしいやくそうのなまえをわすれない____、ノートにかいておきます。',
    fullSentence: '珍しい薬草の名前を忘れないように、ノートに書いておきます。',
    fullPhonetic: 'Mezurashii yakusō no namae o wasurenai yō ni, nōto ni kaite okimasu.',
    translationVi: 'Để không quên tên các loài thảo dược quý hiếm, tôi ghi sẵn vào sổ tay.',
    choices: ['ように', 'ために', 'そうに', 'ばかりに'],
    choicePhonetics: ['yō ni', 'tame ni', 'sō ni', 'bakari ni'],
    correctIndex: 0,
    grammarTitleVi: 'Mục đích với động từ phủ định / khả năng: V-ない + ように (Để không...)',
    grammarExplainVi: 'Khi vế mục đích là động từ thể phủ định ("忘れない" - không quên) hoặc động từ khả năng/tự động từ, bắt buộc dùng "ように" chứ không dùng "ために". Ngoài ra "書いておく" nghĩa là ghi chép sẵn để chuẩn bị trước.',
    vocabNotes: [
      { word: '珍しい (めずらしい)', phonetic: 'mezurashii', posVi: 'tính từ -i', meaningVi: 'hiếm có, quý lạ' },
      { word: '薬草 (やくそう)', phonetic: 'yakusō', posVi: 'danh từ', meaningVi: 'thảo dược' },
      { word: '書いておく', phonetic: 'kaite oku', posVi: 'cấu trúc', meaningVi: 'viết sẵn (để chuẩn bị cho sau này)' },
    ],
  },
  {
    id: 'ja_b8_cloze_1',
    lang: 'ja',
    tier: 'advanced',
    levelBand: 8,
    format: 'grammar_cloze',
    promptVi: 'Chọn ngữ pháp JLPT N2 diễn tả "Nhân tiện khi làm A thì làm luôn B":',
    stemText: '町へ小麦粉を買いに行く____、郵便局で手紙を出してきた。',
    stemPhonetic: 'まちへこむぎこをかいにいく____、ゆうびんきょくでてがみをだしてきた。',
    fullSentence: '町へ小麦粉を買いに行くついでに、郵便局で手紙を出してきた。',
    fullPhonetic: 'Machi e komugiko o kai ni iku tsuide ni, yūbinkyoku de tegami o dashite kita.',
    translationVi: 'Nhân tiện ra thị trấn mua bột mì, tôi đã ghé bưu điện gửi thư luôn.',
    choices: ['ついでに', '反面', 'あまり', 'あげく'],
    choicePhonetics: ['tsuide ni', 'hanmen ni', 'amari', 'ageku'],
    correctIndex: 0,
    grammarTitleVi: 'Ngữ pháp N2: V-る / V-た / N の + ついでに (Nhân tiện / Tiện thể...)',
    grammarExplainVi: '"ついでに" dùng khi người nói tận dụng cơ hội thực hiện hành động chính (đi mua bột mì) để làm kèm một việc phụ tiện đường (gửi thư).',
    vocabNotes: [
      { word: '小麦粉 (こむぎこ)', phonetic: 'komugiko', posVi: 'danh từ', meaningVi: 'bột mì' },
      { word: 'ついでに', phonetic: 'tsuide ni', posVi: 'ngữ pháp', meaningVi: 'nhân tiện, tiện thể' },
      { word: '手紙を出す', phonetic: 'tegami o dasu', posVi: 'cụm động từ', meaningVi: 'gửi thư' },
    ],
  },
  {
    id: 'ja_b10_cloze_1',
    lang: 'ja',
    tier: 'advanced',
    levelBand: 10,
    format: 'grammar_cloze',
    promptVi: 'Chọn cấu trúc văn viết trang trọng JLPT N1 ("Xứng danh với / Không hổ danh là"):',
    stemText: '百年の歴史を持つ果樹園____、どの果実も香り高く極上の味わいだ。',
    stemPhonetic: 'ひゃくねんのれきしをもつかりゅえん____、どのかじつもかおりたかくごくじょうのあじわいだ。',
    fullSentence: '百年の歴史を持つ果樹園だけあって、どの果実も香り高く極上の味わいだ。',
    fullPhonetic: 'Hyakunen no rekishi o motsu kajuen dake atte, dono kajitsu mo kaoritakaku gokujō no ajiwai da.',
    translationVi: 'Quả không hổ danh là vườn cây ăn trái có lịch sử trăm năm, trái nào cũng thơm lừng và mang hương vị thượng hạng.',
    choices: ['だけあって', 'ともなると', 'をよそに', 'はおろか'],
    choicePhonetics: ['dake atte', 'tomo naru to', 'o yoso ni', 'wa oroka'],
    correctIndex: 0,
    grammarTitleVi: 'Ngữ pháp N2–N1: ～だけあって (Quả xứng danh với / Nhờ có nền tảng đó nên...)',
    grammarExplainVi: '"だけあって" dùng để khen ngợi một kết quả xuất sắc hoàn toàn tương xứng với danh tiếng hoặc bề dày kinh nghiệm ở vế trước.',
    vocabNotes: [
      { word: '果樹園 (かじゅえん)', phonetic: 'kajuen', posVi: 'danh từ', meaningVi: 'vườn cây ăn quả' },
      { word: '香り高い (かおりたかい)', phonetic: 'kaoritakai', posVi: 'tính từ', meaningVi: 'ngát hương thơm' },
      { word: '極上 (ごくじょう)', phonetic: 'gokujō', posVi: 'danh từ', meaningVi: 'thượng hạng, bậc nhất' },
    ],
  },
];

// ============================================================================
// LEXICON BANK (150 VOCABULARY & EXAMPLE LESSONS ACROSS 5 LANGUAGES × BANDS 1..10)
// Powers dynamic `match_pairs` (3x2 matching cards) & `vocab_context` (listen & pick)!
// ============================================================================

function makeLex(
  lang: QuizLanguageId,
  band: number,
  tier: QuizProficiencyTier,
  rows: Array<[string, string, string, string, string, string, string, string]>
): QuizLexiconEntry[] {
  return rows.map(([slug, word, phonetic, posVi, meaningVi, ex, exPh, exVi]) => ({
    id: `lex_${lang}_b${band}_${slug}`,
    lang,
    tier,
    levelBand: band,
    word,
    phonetic,
    posVi,
    meaningVi,
    exampleSentence: ex,
    examplePhonetic: exPh,
    exampleVi: exVi,
    grammarNoteVi: `Từ vựng trọng tâm ${QUIZ_LANGUAGES[lang].tierLabels[tier]} (Cấp ${(band - 1) * 10 + 1}–${band * 10}) — chú ý cách dùng "${word}" (${posVi}) trong câu thực tế.`,
  }));
}

export const QUIZ_LEXICON_BANK: QuizLexiconEntry[] = [
  // ---------------- ENGLISH LEXICON (Lv 1..100) ----------------
  ...makeLex('en', 1, 'beginner', [
    ['seed', 'seed', '/siːd/', 'danh từ', 'hạt giống', 'Plant each seed gently in warm soil.', '/plænt iːtʃ siːd ˈdʒɛntli ɪn wɔːrm sɔɪl/', 'Hãy gieo từng hạt giống nhẹ nhàng vào đất ấm.'],
    ['harvest', 'harvest', '/ˈhɑːrvɪst/', 'động từ/danh từ', 'thu hoạch, vụ gặt', 'Farmers harvest golden wheat in autumn.', '/ˈfɑːrmərz ˈhɑːrvɪst ˈɡoʊldən wiːt ɪn ˈɔːtəm/', 'Nông dân thu hoạch lúa mì vàng vào mùa thu.'],
    ['water_v', 'water', '/ˈwɔːtər/', 'động từ', 'tưới nước', 'Remember to water the carrots twice a week.', '/rɪˈmɛmbər tə ˈwɔːtər ðə ˈkærəts twaɪs ə wiːk/', 'Hãy nhớ tưới cà rốt hai lần một tuần.'],
  ]),
  ...makeLex('en', 2, 'beginner', [
    ['flour', 'flour', '/ˈflaʊər/', 'danh từ', 'bột mì', 'We knead fine wheat flour for apple pies.', '/wiː niːd faɪn wiːt ˈflaʊər fɔːr ˈæpəl paɪz/', 'Chúng tôi nhào bột mì mịn để làm bánh táo.'],
    ['ripe', 'ripe', '/raɪp/', 'tính từ', 'chín mọng', 'The red strawberries are ripe and juicy.', '/ðə rɛd ˈstrɔːbɛriz ɑːr raɪp ænd ˈdʒuːsi/', 'Những quả dâu đỏ đã chín mọng ngọt nước.'],
    ['basket', 'basket', '/ˈbæskɪt/', 'danh từ', 'cái giỏ mây', 'Carry the eggs carefully in a woven basket.', '/ˈkæri ði ɛɡz ˈkɛrfəli ɪn ə ˈwoʊvən ˈbæskɪt/', 'Hãy xách trứng cẩn thận trong chiếc giỏ đan.'],
  ]),
  ...makeLex('en', 3, 'beginner', [
    ['breeze', 'breeze', '/briːz/', 'danh từ', 'làn gió nhẹ', 'A cool breeze blows across the river.', '/ə kuːl briːz bloʊz əˈkrɔːs ðə ˈrɪvər/', 'Một làn gió mát thổi ngang dòng sông.'],
    ['sunrise', 'sunrise', '/ˈsʌnraɪz/', 'danh từ', 'bình minh', 'We open the barn doors at sunrise.', '/wiː ˈoʊpən ðə bɑːrn dɔːrz æt ˈsʌnraɪz/', 'Chúng tôi mở cửa kho nông sản lúc bình minh.'],
    ['lantern', 'lantern', '/ˈlæntərn/', 'danh từ', 'đèn lồng', 'Hang a warm lantern beside the stone bridge.', '/hæŋ ə wɔːrm ˈlæntərn bɪˈsaɪd ðə stoʊn brɪdʒ/', 'Hãy treo một chiếc đèn lồng ấm cạnh cầu đá.'],
  ]),
  ...makeLex('en', 4, 'intermediate', [
    ['fertile', 'fertile', '/ˈfɜːrtəl/', 'tính từ', 'màu mỡ, phì nhiêu', 'River valleys usually have fertile soil.', '/ˈrɪvər ˈvæliz ˈjuːʒuəli hæv ˈfɜːrtəl sɔɪl/', 'Thung lũng ven sông thường có đất đai màu mỡ.'],
    ['fragrant', 'fragrant', '/ˈfreɪɡrənt/', 'tính từ', 'thơm ngát', 'Dried lavender keeps thelinen cupboard fragrant.', '/draɪd ˈlævəndər kiːps ðə ˈkʌbərd ˈfreɪɡrənt/', 'Oải hương khô giữ cho tủ vải luôn thơm ngát.'],
    ['ingredient', 'ingredient', '/ɪnˈɡriːdiənt/', 'danh từ', 'nguyên liệu nấu ăn', 'Cinnamon is the secret ingredient in this pie.', '/ˈsɪnəmən ɪz ðə ˈsiːkrət ɪnˈɡriːdiənt ɪn ðɪs paɪ/', 'Quế là nguyên liệu bí quyết trong chiếc bánh này.'],
  ]),
  ...makeLex('en', 5, 'intermediate', [
    ['preserve', 'preserve', '/prɪˈzɜːrv/', 'động từ', 'bảo quản, giữ gìn', 'Glass jars preserve berry jam all winter.', '/ɡlæs dʒɑːrz prɪˈzɜːrv ˈbɛri dʒæm ɔːl ˈwɪntər/', 'Hũ thuỷ tinh bảo quản mứt quả mọng suốt mùa đông.'],
    ['cultivate', 'cultivate', '/ˈkʌltɪveɪt/', 'động từ', 'canh tác, trau dồi', 'They cultivate rare herbs inside the greenhouse.', '/ðeɪ ˈkʌltɪveɪt rɛr hɜːrbz ɪnˈsaɪd ðə ˈɡriːnhaʊs/', 'Họ canh tác thảo dược quý bên trong nhà kính.'],
    ['abundant', 'abundant', '/əˈbʌndənt/', 'tính từ', 'dồi dào, phong phú', 'Clean spring water is abundant on the hill.', '/kliːn sprɪŋ ˈwɔːtər ɪz əˈbʌndənt ɒn ðə hɪl/', 'Nguồn nước suối trong lành rất dồi dào trên đồi.'],
  ]),
  ...makeLex('en', 7, 'intermediate', [
    ['thrive', 'thrive', '/θraɪv/', 'động từ', 'phát triển xanh tốt', 'Sunflowers thrive in bright afternoon sunlight.', '/ˈsʌnflaʊərz θraɪv ɪn braɪt ˌæftərˈnuːn ˈsʌnlaɪt/', 'Hoa hướng dương vươn lên rực rỡ dưới nắng chiều.'],
    ['sustainable', 'sustainable', '/səˈsteɪnəbəl/', 'tính từ', 'bền vững', 'Crop rotation is a sustainable farming method.', '/krɒp roʊˈteɪʃən ɪz ə səˈsteɪnəbəl ˈfɑːrmɪŋ ˈmɛθəd/', 'Luân canh cây trồng là phương pháp canh tác bền vững.'],
    ['replenish', 'replenish', '/rɪˈplɛnɪʃ/', 'động từ', 'bổ sung, làm đầy lại', 'Compost helps replenish nutrients in the earth.', '/ˈkɒmpoʊst hɛlps rɪˈplɛnɪʃ ˈnuːtriənts ɪn ði ɜːrθ/', 'Phân ủ hữu cơ giúp bồi đắp lại dưỡng chất cho đất.'],
  ]),
  ...makeLex('en', 9, 'advanced', [
    ['meticulous', 'meticulous', '/məˈtɪkjələs/', 'tính từ', 'tỉ mỉ, kỹ lưỡng', 'Brewing potions requires meticulous attention to timing.', '/ˈbruːɪŋ ˈpoʊʃənz rɪˈkwaɪərz məˈtɪkjələs əˈtɛnʃən/', 'Pha chế dược phẩm đòi hỏi sự tỉ mỉ tuyệt đối về thời gian.'],
    ['resilient', 'resilient', '/rɪˈzɪliənt/', 'tính từ', 'kiên cường, chịu đựng dẻo dai', 'Mountain pines are remarkably resilient against frost.', '/ˈmaʊntən paɪnz ɑːr rɪˈmɑːrkəbli rɪˈzɪliənt əˈɡɛnst frɔːst/', 'Thông núi có sức chống chịu đáng kinh ngạc trước sương giá.'],
    ['bountiful', 'bountiful', '/ˈbaʊntɪfəl/', 'tính từ', 'trù phú, bội thu', 'Villagers gathered to celebrate a bountiful autumn.', '/ˈvɪlɪdʒərz ˈɡæðərd tə ˈsɛləbreɪt ə ˈbaʊntɪfəl ˈɔːtəm/', 'Dân làng quây quần mừng một mùa thu trù phú bội thu.'],
  ]),
  ...makeLex('en', 10, 'advanced', [
    ['perennial', 'perennial', '/pəˈrɛniəl/', 'tính từ', 'lâu năm / quanh năm', 'Lavender is a perennial shrub prized for its aroma.', '/ˈlævəndər ɪz ə pəˈrɛniəl ʃrʌb praɪzd fɔːr ɪts əˈroʊmə/', 'Oải hương là cây bụi lâu năm được trân quý nhờ hương thơm.'],
    ['invigorate', 'invigorate', '/ɪnˈvɪɡəreɪt/', 'động từ', 'tiếp thêm sinh khí', 'Crisp highland air invigorates tired travelers.', '/krɪsp ˈhaɪlənd ɛr ɪnˈvɪɡəreɪts ˈtaɪərd ˈtrævələrz/', 'Không khí trong trẻo vùng cao nguyên tiếp sinh lực cho lữ khách.'],
    ['quintessential', 'quintessential', '/ˌkwɪntɪˈsɛnʃəl/', 'tính từ', 'tinh tuý, điển hình nhất', 'Warm apple pie is the quintessential comfort dessert.', '/wɔːrm ˈæpəl paɪ ɪz ðə ˌkwɪntɪˈsɛnʃəl ˈkʌmfərt dɪˈzɜːrt/', 'Bánh táo ấm là món tráng miệng tinh tuý chuẩn vị quê nhà.'],
  ]),

  // ---------------- KOREAN LEXICON (Lv 1..100) ----------------
  ...makeLex('ko', 1, 'beginner', [
    ['ssiat', '씨앗', 'ssi-at', 'danh từ', 'hạt giống', '작은 씨앗을 밭에 심어요.', 'Ja-geun ssi-a-seul ba-te si-meo-yo.', 'Gieo hạt giống nhỏ xuống ruộng.'],
    ['mul', '물', 'mul', 'danh từ', 'nước', '꽃에 시원한 물을 줘요.', 'Kko-che si-won-han mu-reul jwo-yo.', 'Tưới nước mát cho hoa.'],
    ['ppang', '빵', 'ppang', 'danh từ', 'bánh mì', '따뜻한 빵 냄새가 정말 좋아요.', 'Tta-tteu-than ppang naem-sae-ga jeong-mal jo-a-yo.', 'Mùi bánh mì ấm áp thơm thật đấy.'],
  ]),
  ...makeLex('ko', 2, 'beginner', [
    ['sagwa', '사과', 'sa-gwa', 'danh từ', 'quả táo', '빨간 사과가 아주 달아요.', 'Ppal-gan sa-gwa-ga a-ju da-ra-yo.', 'Quả táo đỏ rất ngọt.'],
    ['gamja', '감자', 'gam-ja', 'danh từ', 'củ khoai tây', '오늘 저녁에는 감자를 구웠어요.', 'O-neul jeo-nyeo-ge-neun gam-ja-reul gu-wo-sseo-yo.', 'Tối nay tôi đã nướng khoai tây.'],
    ['kkul', '꿀', 'kkul', 'danh từ', 'mật ong', '차에 달콤한 꿀을 넣었어요.', 'Cha-e dal-kom-han kku-reul neo-eo-sseo-yo.', 'Tôi đã cho mật ong ngọt vào trà.'],
  ]),
  ...makeLex('ko', 4, 'intermediate', [
    ['suhwak', '수확하다', 'su-hwak-ha-da', 'động từ', 'thu hoạch', '가을에 황금빛 밀을 수확해요.', 'Ga-eu-re hwang-geum-bit mi-reul su-hwak-hae-yo.', 'Thu hoạch lúa mì ánh vàng vào mùa thu.'],
    ['jeongseong', '정성', 'jeong-seong', 'danh từ', 'tấm lòng chân thành, tâm huyết', '정성을 다해 약초를 돌봅니다.', 'Jeong-seong-eul da-hae yak-cho-reul dol-bom-ni-da.', 'Chăm sóc thảo dược bằng cả tấm lòng.'],
    ['hyanggi', '향기', 'hyang-gi', 'danh từ', 'hương thơm', '라벤더 향기가 방 안에 가득해요.', 'Ra-ben-deo hyang-gi-ga bang a-ne ga-deu-khae-yo.', 'Hương oải hương ngập tràn khắp căn phòng.'],
  ]),
  ...makeLex('ko', 6, 'intermediate', [
    ['pungnyon', '풍년', 'pung-nyeon', 'danh từ', 'năm được mùa', '올해는 날씨가 좋아서 풍년이에요.', 'Ol-hae-neun nal-ssi-ga jo-a-seo pung-nyeo-ni-e-yo.', 'Năm nay thời tiết thuận lợi nên được mùa lớn.'],
    ['bogwan', '보관하다', 'bo-gwan-ha-da', 'động từ', 'bảo quản, cất trữ', '열매를 서늘한 창고에 보관하세요.', 'Yeol-mae-reul seo-neul-han chang-go-e bo-gwan-ha-se-yo.', 'Hãy bảo quản trái cây trong kho thoáng mát.'],
    ['geongang', '건강하다', 'geon-gang-ha-da', 'tính từ', 'khoẻ mạnh', '신선한 채소를 먹으면 건강해져요.', 'Sin-seon-han chae-so-reul meo-geu-myeon geon-gang-hae-jyeo-yo.', 'Ăn rau củ tươi giúp cơ thể trở nên khoẻ mạnh.'],
  ]),
  ...makeLex('ko', 9, 'advanced', [
    ['bihyok', '비옥하다', 'bi-ok-ha-da', 'tính từ', 'màu mỡ, trù phú', '강가의 비옥한 토양에서 농작물이 잘 자란다.', 'Gang-ga-ui bi-ok-han to-yang-e-seo nong-jang-mu-ri jal ja-ran-da.', 'Hoa màu sinh trưởng tốt trên đất phù sa màu mỡ ven sông.'],
    ['jogap', '조화롭다', 'jo-hwa-rop-da', 'tính từ', 'hài hoà, cân đối', '자연과 인간이 조화롭게 살아가는 마을이다.', 'Ja-yeon-gwa in-ga-ni jo-hwa-rop-ge sa-ra-ga-neun ma-eu-ri-da.', 'Đó là ngôi làng nơi con người sống hài hoà với thiên nhiên.'],
    ['innae', '인내심', 'in-nae-sim', 'danh từ', 'lòng kiên nhẫn', '농사와 학문은 모두 깊은 인내심을 요구한다.', 'Nong-sa-wa hang-mu-neun mo-du gi-peun in-nae-si-meul yo-gu-han-da.', 'Việc nhà nông và học thuật đều đòi hỏi lòng kiên nhẫn sâu sắc.'],
  ]),

  // ---------------- CHINESE LEXICON (Lv 1..100) ----------------
  ...makeLex('zh', 1, 'beginner', [
    ['zhongzi', '种子', 'zhǒngzi', 'danh từ', 'hạt giống', '这是一颗神奇的南瓜种子。', 'Zhè shì yì kē shénqí de nánguā zhǒngzi.', 'Đây là một hạt giống bí ngô kỳ diệu.'],
    ['mianbao', '面包', 'miànbāo', 'danh từ', 'bánh mì', '妈妈烤的面包真香！', 'Māma kǎo de miànbāo zhēn xiāng!', 'Bánh mì mẹ nướng thơm quá!'],
    ['shuiguo', '水果', 'shuǐguǒ', 'danh từ', 'trái cây, hoa quả', '多吃新鲜水果对身体好。', 'Duō chī xīnxiān shuǐguǒ duì shēntǐ hǎo.', 'Ăn nhiều trái cây tươi rất tốt cho sức khoẻ.'],
  ]),
  ...makeLex('zh', 2, 'beginner', [
    ['huluobo', '胡萝卜', 'húluóbo', 'danh từ', 'củ cà rốt', '小兔子最爱吃甜胡萝卜。', 'Xiǎo tùzi zuì ài chī tián húluóbo.', 'Chú thỏ nhỏ thích ăn cà rốt ngọt nhất.'],
    ['fengmi', '蜂蜜', 'fēngmì', 'danh từ', 'mật ong', '我在热茶里加了一勺蜂蜜。', 'Wǒ zài rè chá lǐ jiā le yì sháo fēngmì.', 'Tôi thêm một thìa mật ong vào tách trà nóng.'],
    ['qingchen', '清晨', 'qīngchén', 'danh từ', 'sáng tinh mơ', '清晨的花园空气十分清新。', 'Qīngchén de huāyuán kōngqì shífēn qīngxīn.', 'Không khí khu vườn buổi tinh mơ vô cùng trong lành.'],
  ]),
  ...makeLex('zh', 5, 'intermediate', [
    ['shouhuo', '收获', 'shōuhuò', 'động từ/danh từ', 'thu hoạch, gặt hái', '秋天是我们收获果实的季节。', 'Qiūtiān shì wǒmen shōuhuò guǒshí de jìjié.', 'Mùa thu là mùa chúng ta thu hoạch trái ngọt.'],
    ['nai_xin', '耐心', 'nàixīn', 'tính từ/danh từ', 'kiên nhẫn, nhẫn nại', '照顾幼苗需要足够的耐心。', 'Zhàogù yòumiáo xūyào zúgòu de nàixīn.', 'Chăm sóc cây non cần có đủ sự kiên nhẫn.'],
    ['xiangwei', '香味', 'xiāngwèi', 'danh từ', 'hương thơm, mùi thơm', '厨房里飘出苹果派的香味。', 'Chúfáng lǐ piāo chū píngguǒpài de xiāngwèi.', 'Từ gian bếp toả ra hương thơm bánh nướng nhân táo.'],
  ]),
  ...makeLex('zh', 7, 'intermediate', [
    ['feiwu', '肥沃', 'féiwò', 'tính từ', 'màu mỡ, phì nhiêu', '河边的土地非常肥沃。', 'Hébiān de tǔdì fēicháng féiwò.', 'Đất đai ven sông vô cùng màu mỡ.'],
    ['chucun', '储存', 'chǔcún', 'động từ', 'tích trữ, bảo quản', '红谷仓里储存着过冬的粮食。', 'Hóng gǔcāng lǐ chǔcún zhe guòdōng de liángshi.', 'Kho đỏ tích trữ lương thực qua mùa đông.'],
    ['maosheng', '茂盛', 'màoshèng', 'tính từ', 'xanh tốt sum suê', '夏天果树长得格外茂盛。', 'Xiàtiān guǒshù zhǎng de géwài màoshèng.', 'Mùa hè cây ăn quả mọc xanh tốt sum suê khác thường.'],
  ]),
  ...makeLex('zh', 9, 'advanced', [
    ['gengyun', '耕耘', 'gēngyún', 'động từ', 'cày xới, dày công vun đắp', '一分耕耘，一分收获。', 'Yì fēn gēngyún, yì fēn shōuhuò.', 'Một phần dày công cày xới, một phần gặt hái thành quả.'],
    ['fuyao', '富饶', 'fùráo', 'tính từ', 'trù phú, giàu đẹp', '这片山谷物产富饶，风景如画。', 'Zhè piàn shāngǔ wùchǎn fùráo, fēngjǐng rú huà.', 'Thung lũng này sản vật trù phú, phong cảnh đẹp như tranh.'],
    ['jingyi', '精益求精', 'jīngyì qiújīng', 'thành ngữ', 'đã tốt lại càng trau chuốt hoàn mỹ hơn', '工匠们对每一件作品都精益求精。', 'Gōngjiàngmen duì měi yí jiàn zuòpǐn dōu jīngyì qiújīng.', 'Những người thợ thủ công trau chuốt hoàn mỹ từng tác phẩm.'],
  ]),

  // ---------------- SPANISH LEXICON (Lv 1..100) ----------------
  ...makeLex('es', 1, 'beginner', [
    ['trigo', 'el trigo', 'el tri-go', 'danh từ', 'lúa mì', 'El trigo dorado crece bajo el sol.', 'El tri-go do-ra-do kre-se ba-ho el sol.', 'Lúa mì vàng óng lớn lên dưới ánh nắng.'],
    ['agua', 'el agua', 'el a-gua', 'danh từ', 'nước', 'El agua del río es muy clara.', 'El a-gua del ri-o es muy kla-ra.', 'Nước sông rất trong trẻo.'],
    ['fresa', 'la fresa', 'la fre-sa', 'danh từ', 'quả dâu tây', 'Esta fresa roja es muy dulce.', 'Es-ta fre-sa ro-ha es muy dul-se.', 'Quả dâu tây đỏ này ngọt lắm.'],
  ]),
  ...makeLex('es', 3, 'beginner', [
    ['miel', 'la miel', 'la miel', 'danh từ', 'mật ong', 'Ponemos miel pura en el té caliente.', 'Po-ne-mos miel pu-ra en el te ka-lien-te.', 'Chúng tôi cho mật ong nguyên chất vào trà nóng.'],
    ['puente', 'el puente', 'el puen-te', 'danh từ', 'cây cầu', 'Cruzamos el puente de piedra al amanecer.', 'Kru-sa-mos el puen-te de pie-dra al a-ma-ne-ser.', 'Chúng tôi băng qua cây cầu đá lúc bình minh.'],
    ['cesta', 'la cesta', 'la ses-ta', 'danh từ', 'chiếc giỏ', 'La cesta está llena de calabazas.', 'La ses-ta es-ta ye-na de ka-la-ba-sas.', 'Chiếc giỏ đựng đầy những quả bí ngô.'],
  ]),
  ...makeLex('es', 5, 'intermediate', [
    ['sembrar', 'sembrar', 'sem-brar', 'động từ', 'gieo hạt', 'En primavera sembramos maíz y lavanda.', 'En pri-ma-be-ra sem-bra-mos ma-is i la-ban-da.', 'Vào mùa xuân chúng tôi gieo bắp và oải hương.'],
    ['aroma', 'el aroma', 'el a-ro-ma', 'danh từ', 'mùi hương quyến rũ', 'El aroma del pan recién horneado llena la casa.', 'El a-ro-ma del pan re-sien or-ne-a-do ye-na la ka-sa.', 'Hương bánh mì mới ra lò lan toả khắp ngôi nhà.'],
    ['cuidar', 'cuidar', 'kui-dar', 'động từ', 'chăm sóc', 'Debemos cuidar la tierra con paciencia.', 'De-be-mos kui-dar la tie-rra kon pa-sien-sia.', 'Chúng ta cần chăm sóc mảnh đất bằng sự kiên nhẫn.'],
  ]),
  ...makeLex('es', 8, 'advanced', [
    ['fertil', 'fértil', 'fer-til', 'tính từ', 'màu mỡ, phì nhiêu', 'El valle cuenta con una tierra sumamente fértil.', 'El ba-ye kuen-ta kon u-na tie-rra su-ma-men-te fer-til.', 'Thung lũng sở hữu vùng đất vô cùng màu mỡ.'],
    ['abundancia', 'la abundancia', 'la a-bun-dan-sia', 'danh từ', 'sự dồi dào, sung túc', 'El otoño trajo abundancia a todas las familias.', 'El o-to-nyo tra-ho a-bun-dan-sia a to-das las fa-mi-lias.', 'Mùa thu mang lại sự sung túc cho mọi gia đình.'],
    ['esmero', 'el esmero', 'el es-me-ro', 'danh từ', 'sự chăm chút tỉ mỉ', 'Cultivan cada hierba mágica con gran esmero.', 'Kul-ti-ban ka-da ier-ba ma-hi-ka kon gran es-me-ro.', 'Họ ươm trồng từng nhánh thảo dược phép thuật với sự chăm chút lớn.'],
  ]),

  // ---------------- JAPANESE LEXICON (Lv 1..100) ----------------
  ...makeLex('ja', 1, 'beginner', [
    ['tane', '種 (たね)', 'tane', 'danh từ', 'hạt giống', '畑に野菜の種をまきます。', 'Hatake ni yasai no tane o makimasu.', 'Tôi gieo hạt giống rau củ xuống ruộng.'],
    ['ringo', '林檎 (りんご)', 'ringo', 'danh từ', 'quả táo', '赤いりんごを二つ買いました。', 'Akai ringo o futatsu kaimashita.', 'Tôi đã mua hai quả táo đỏ.'],
    ['hatake', '畑 (はたけ)', 'hatake', 'danh từ', 'thửa ruộng, nương rau', 'おじいさんの畑はとても広いです。', 'Ojiisan no hatake wa totemo hiroi desu.', 'Thửa ruộng của ông rộng lắm.'],
  ]),
  ...makeLex('ja', 3, 'beginner', [
    ['hachimitsu', '蜂蜜 (はちみつ)', 'hachimitsu', 'danh từ', 'mật ong', 'パンに甘い蜂蜜を塗ります。', 'Pan ni amai hachimitsu o nurimasu.', 'Phết mật ong ngọt lên bánh mì.'],
    ['kabocha', '南瓜 (かぼちゃ)', 'kabocha', 'danh từ', 'quả bí ngô', '温かい南瓜のスープを作りました。', 'Atatakai kabocha no sūpu o tsukurimashita.', 'Tôi đã nấu món súp bí ngô ấm nóng.'],
    ['asa', '朝露 (あさつゆ)', 'asatsuyu', 'danh từ', 'sương sớm', '葉の上に朝露が光っています。', 'Ha no ue ni asatsuyu ga hikatte imasu.', 'Những giọt sương sớm lấp lánh trên mặt lá.'],
  ]),
  ...makeLex('ja', 5, 'intermediate', [
    ['shuukaku', '収穫 (しゅうかく)', 'shūkaku', 'danh từ/động từ', 'thu hoạch', '秋になると小麦を収穫します。', 'Aki ni naru to komugi o shūkaku shimasu.', 'Khi sang thu chúng tôi thu hoạch lúa mì.'],
    ['kaori', '香り (かおり)', 'kaori', 'danh từ', 'hương thơm thanh tao', 'ラベンダーの優しい香りが広がります。', 'Rabendā no yasashii kaori ga hirogarimasu.', 'Hương oải hương dịu nhẹ lan toả.'],
    ['shinsen', '新鮮 (しんせん)', 'shinsen', 'tính từ -na', 'tươi ngon', '毎朝、新鮮な卵を集めます。', 'Maiasa, shinsen na tamago o atsumemasu.', 'Mỗi sáng chúng tôi gom trứng tươi.'],
  ]),
  ...makeLex('ja', 8, 'advanced', [
    ['houjou', '豊穣 (ほうじょう)', 'hōjō', 'danh từ', 'sự trù phú, mùa màng bội thu', '村人たちは秋の豊穣を祝った。', 'Murabitotachi wa aki no hōjō o iwatta.', 'Dân làng đã mở hội mừng mùa thu bội thu.'],
    ['tanensei', '丹念 (たんねん)', 'tannen', 'tính từ -na', 'cẩn trọng, tỉ mỉ từng chút', '職人が丹念に道具を手入れする。', 'Shokunin ga tannen ni dōgu o teire suru.', 'Người nghệ nhân tỉ mỉ bảo dưỡng nông cụ.'],
    ['megumi', '恵み (めぐみ)', 'megumi', 'danh từ', 'ân huệ / lộc lành thiên nhiên', '大地と太陽の恵みに感謝する。', 'Daichi to taiyō no megumi ni kansha suru.', 'Biết ơn lộc lành của đất mẹ và mặt trời.'],
  ]),
];

// ============================================================================
// LAZY-LOADED LANGUAGE PACK REGISTRY (/assets/quiz-<lang>-<hash>.js — SW-safe)
// ============================================================================

const loadedQuizPacks = new Set<QuizLanguageId>();
const inFlightQuizPacks = new Map<QuizLanguageId, Promise<boolean>>();

export function isLanguageQuizPackLoaded(lang: QuizLanguageId): boolean {
  return loadedQuizPacks.has(lang);
}

export function getLanguagePoolStats(lang: QuizLanguageId): {
  lexiconCount: number;
  curatedCount: number;
  totalQuestionsEstimate: number;
  packLoaded: boolean;
} {
  const lexiconCount = QUIZ_LEXICON_BANK.filter((e) => e.lang === lang).length;
  const curatedCount = CURATED_QUIZ_BANK.filter((c) => c.lang === lang).length;
  return {
    lexiconCount,
    curatedCount,
    totalQuestionsEstimate: lexiconCount * 5 + curatedCount,
    packLoaded: loadedQuizPacks.has(lang),
  };
}

export async function loadLanguageQuizPack(lang: QuizLanguageId): Promise<boolean> {
  if (loadedQuizPacks.has(lang)) return true;
  const inflight = inFlightQuizPacks.get(lang);
  if (inflight) return inflight;

  const loader = (async () => {
    try {
      let mod: { EXTRA_LEXICON: QuizLexiconEntry[]; EXTRA_CURATED: CuratedQuizItem[] };
      switch (lang) {
        case 'en':
          mod = await import('./quizPacks/en');
          break;
        case 'ko':
          mod = await import('./quizPacks/ko');
          break;
        case 'zh':
          mod = await import('./quizPacks/zh');
          break;
        case 'es':
          mod = await import('./quizPacks/es');
          break;
        case 'ja':
          mod = await import('./quizPacks/ja');
          break;
      }
      const existingLexIds = new Set(QUIZ_LEXICON_BANK.map((e) => e.id));
      const existingLangWords = new Set(
        QUIZ_LEXICON_BANK.map((e) => `${e.lang}:${e.word.trim().toLowerCase()}`)
      );
      for (const lex of mod.EXTRA_LEXICON) {
        const wordKey = `${lex.lang}:${lex.word.trim().toLowerCase()}`;
        if (!existingLexIds.has(lex.id) && !existingLangWords.has(wordKey)) {
          QUIZ_LEXICON_BANK.push(lex);
          existingLexIds.add(lex.id);
          existingLangWords.add(wordKey);
        }
      }
      const existingCuratedIds = new Set(CURATED_QUIZ_BANK.map((c) => c.id));
      for (const cur of mod.EXTRA_CURATED) {
        if (!existingCuratedIds.has(cur.id)) {
          CURATED_QUIZ_BANK.push(cur);
          existingCuratedIds.add(cur.id);
        }
      }
      loadedQuizPacks.add(lang);
      return true;
    } catch {
      return false;
    } finally {
      inFlightQuizPacks.delete(lang);
    }
  })();

  inFlightQuizPacks.set(lang, loader);
  return loader;
}

