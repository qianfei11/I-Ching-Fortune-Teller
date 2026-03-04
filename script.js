// ============================================================
// 易经占卜 - I Ching Fortune Teller
// Core I Ching logic and Claude API integration
// ============================================================

// ============ I Ching Data & Constants ============

/**
 * 八卦 (8 Trigrams), indexed by binary value.
 * Binary encoding: line1=LSB, line3=MSB (bottom line is least significant bit)
 * Each trigram has three lines; 1 = yang (solid), 0 = yin (broken).
 */
const TRIGRAMS = {
  7: { name: '乾', symbol: '☰', element: '天', en: 'Qian' }, // 111
  6: { name: '兑', symbol: '☱', element: '泽', en: 'Dui'  }, // 110
  5: { name: '离', symbol: '☲', element: '火', en: 'Li'   }, // 101
  4: { name: '震', symbol: '☳', element: '雷', en: 'Zhen' }, // 100
  3: { name: '巽', symbol: '☴', element: '风', en: 'Xun'  }, // 011
  2: { name: '坎', symbol: '☵', element: '水', en: 'Kan'  }, // 010
  1: { name: '艮', symbol: '☶', element: '山', en: 'Gen'  }, // 001
  0: { name: '坤', symbol: '☷', element: '地', en: 'Kun'  }, // 000
};

/**
 * King Wen (文王) sequence lookup table.
 * Usage: KING_WEN[lowerTrigramIndex][upperTrigramIndex] → hexagram number (1–64)
 *
 * Columns (upper trigram): Qian(7), Dui(6), Li(5), Zhen(4), Xun(3), Kan(2), Gen(1), Kun(0)
 */
const KING_WEN = [
  // lower = Kun (0):  Qian  Dui   Li    Zhen  Xun   Kan   Gen   Kun
                      [12,   45,   35,   16,   20,   8,    23,   2  ],
  // lower = Gen (1):
                      [33,   31,   56,   62,   53,   39,   52,   15 ],
  // lower = Kan (2):
                      [6,    47,   64,   40,   59,   29,   4,    7  ],
  // lower = Xun (3):
                      [44,   28,   50,   32,   57,   48,   18,   46 ],
  // lower = Zhen (4):
                      [25,   17,   21,   51,   42,   3,    27,   24 ],
  // lower = Li (5):
                      [13,   49,   30,   55,   37,   63,   22,   36 ],
  // lower = Dui (6):
                      [10,   58,   38,   54,   61,   60,   41,   19 ],
  // lower = Qian (7):
                      [1,    43,   14,   34,   9,    5,    26,   11 ],
];

/**
 * All 64 hexagrams with name, English romanization, thematic meaning, and classical text.
 * The `desc` field contains the 卦辞 (guaci) — the overall hexagram statement.
 */
const HEXAGRAMS = {
  1:  { name: '乾',  eng: 'Qian',    meaning: 'Heaven',             desc: '元亨利贞。潜龙勿用。见龙在田，利见大人。君子终日乾乾，夕惕若。龙战于野，其血玄黄。' },
  2:  { name: '坤',  eng: 'Kun',     meaning: 'Earth',              desc: '元亨，利牝马之贞。君子有攸往，先迷后得主，利西南得朋，东北丧朋。安贞吉。' },
  3:  { name: '屯',  eng: 'Zhun',    meaning: 'Difficulty',         desc: '元亨利贞，勿用有攸往。利建侯。' },
  4:  { name: '蒙',  eng: 'Meng',    meaning: 'Youthful Folly',     desc: '亨。匪我求童蒙，童蒙求我。初筮告，再三渎，渎则不告。利贞。' },
  5:  { name: '需',  eng: 'Xu',      meaning: 'Waiting',            desc: '有孚，光亨，贞吉。利涉大川。' },
  6:  { name: '讼',  eng: 'Song',    meaning: 'Conflict',           desc: '有孚，窒。惕中吉。终凶。利见大人，不利涉大川。' },
  7:  { name: '师',  eng: 'Shi',     meaning: 'The Army',           desc: '贞，丈人吉，无咎。' },
  8:  { name: '比',  eng: 'Bi',      meaning: 'Holding Together',   desc: '吉。原筮元永贞，无咎。不宁方来，后夫凶。' },
  9:  { name: '小畜', eng: 'Xiaoxu', meaning: 'Small Restraint',    desc: '亨。密云不雨，自我西郊。' },
  10: { name: '履',  eng: 'Lü',      meaning: 'Treading',           desc: '履虎尾，不咥人，亨。' },
  11: { name: '泰',  eng: 'Tai',     meaning: 'Peace',              desc: '小往大来，吉亨。' },
  12: { name: '否',  eng: 'Pi',      meaning: 'Standstill',         desc: '不利君子贞，大往小来。' },
  13: { name: '同人', eng: 'Tongren', meaning: 'Fellowship',        desc: '同人于野，亨。利涉大川，利君子贞。' },
  14: { name: '大有', eng: 'Dayou',  meaning: 'Great Possession',   desc: '元亨。' },
  15: { name: '谦',  eng: 'Qian',    meaning: 'Modesty',            desc: '亨。君子有终。' },
  16: { name: '豫',  eng: 'Yu',      meaning: 'Enthusiasm',         desc: '利建侯行师。' },
  17: { name: '随',  eng: 'Sui',     meaning: 'Following',          desc: '元亨利贞，无咎。' },
  18: { name: '蛊',  eng: 'Gu',      meaning: 'Work on Decay',      desc: '元亨，利涉大川。先甲三日，后甲三日。' },
  19: { name: '临',  eng: 'Lin',     meaning: 'Approach',           desc: '元亨利贞。至于八月有凶。' },
  20: { name: '观',  eng: 'Guan',    meaning: 'Contemplation',      desc: '盥而不荐，有孚颙若。' },
  21: { name: '噬嗑', eng: 'Shihe',  meaning: 'Biting Through',     desc: '亨。利用狱。' },
  22: { name: '贲',  eng: 'Bi',      meaning: 'Grace',              desc: '亨。小利有攸往。' },
  23: { name: '剥',  eng: 'Bo',      meaning: 'Splitting Apart',    desc: '不利有攸往。' },
  24: { name: '复',  eng: 'Fu',      meaning: 'Return',             desc: '亨。出入无疾，朋来无咎。反复之道，七日来复，利有攸往。' },
  25: { name: '无妄', eng: 'Wuwang', meaning: 'Innocence',          desc: '元亨利贞。其匪正有眚，不利有攸往。' },
  26: { name: '大畜', eng: 'Daxu',   meaning: 'Great Restraint',    desc: '利贞。不家食，吉。利涉大川。' },
  27: { name: '颐',  eng: 'Yi',      meaning: 'Nourishment',        desc: '贞吉。观颐，自求口实。' },
  28: { name: '大过', eng: 'Daguo',  meaning: 'Great Exceeding',    desc: '栋桡。利有攸往，亨。' },
  29: { name: '坎',  eng: 'Kan',     meaning: 'The Abyss',          desc: '习坎，有孚。行有尚，心亨。' },
  30: { name: '离',  eng: 'Li',      meaning: 'Brightness',         desc: '利贞，亨。畜牝牛，吉。' },
  31: { name: '咸',  eng: 'Xian',    meaning: 'Influence',          desc: '亨。利贞。取女吉。' },
  32: { name: '恒',  eng: 'Heng',    meaning: 'Duration',           desc: '亨。无咎。利贞。利有攸往。' },
  33: { name: '遯',  eng: 'Tun',     meaning: 'Retreat',            desc: '亨。小利贞。' },
  34: { name: '大壮', eng: 'Dazhuang', meaning: 'Great Strength',   desc: '利贞。' },
  35: { name: '晋',  eng: 'Jin',     meaning: 'Progress',           desc: '康侯用锡马蕃庶，昼日三接。' },
  36: { name: '明夷', eng: 'Mingyi', meaning: 'Darkening',          desc: '利艰贞。' },
  37: { name: '家人', eng: 'Jiaren', meaning: 'The Family',         desc: '利女贞。' },
  38: { name: '睽',  eng: 'Kui',     meaning: 'Opposition',         desc: '小事吉。' },
  39: { name: '蹇',  eng: 'Jian',    meaning: 'Obstruction',        desc: '利西南，不利东北。利见大人，贞吉。' },
  40: { name: '解',  eng: 'Jie',     meaning: 'Deliverance',        desc: '利西南。无所往，其来复吉。有攸往，夙吉。' },
  41: { name: '损',  eng: 'Sun',     meaning: 'Decrease',           desc: '有孚，元吉。无咎，可贞，利有攸往。' },
  42: { name: '益',  eng: 'Yi',      meaning: 'Increase',           desc: '元亨利贞。利有攸往，利涉大川。' },
  43: { name: '夬',  eng: 'Guai',    meaning: 'Breakthrough',       desc: '扬于王庭，孚号有厉，告自邑，不利即戎，利有攸往。' },
  44: { name: '姤',  eng: 'Gou',     meaning: 'Coming to Meet',     desc: '女壮，勿用取女。' },
  45: { name: '萃',  eng: 'Cui',     meaning: 'Gathering',          desc: '亨。王假有庙，利见大人，亨，利贞。用大牲吉，利有攸往。' },
  46: { name: '升',  eng: 'Sheng',   meaning: 'Ascending',          desc: '元亨。用见大人，勿恤，南征吉。' },
  47: { name: '困',  eng: 'Kun',     meaning: 'Exhaustion',         desc: '贞，大人吉，无咎。言有尚。' },
  48: { name: '井',  eng: 'Jing',    meaning: 'The Well',           desc: '改邑而不改井，无丧无得。往来井井。汔至亦未绳井，羸其瓶，凶。' },
  49: { name: '革',  eng: 'Ge',      meaning: 'Revolution',         desc: '己日乃孚。元亨利贞，悔亡。' },
  50: { name: '鼎',  eng: 'Ding',    meaning: 'The Cauldron',       desc: '元吉，亨。' },
  51: { name: '震',  eng: 'Zhen',    meaning: 'The Arousing',       desc: '亨。震来虩虩，笑言哑哑。震惊百里，不丧匕鬯。' },
  52: { name: '艮',  eng: 'Gen',     meaning: 'Keeping Still',      desc: '艮其背，不获其身。行其庭，不见其人，无咎。' },
  53: { name: '渐',  eng: 'Jian',    meaning: 'Development',        desc: '女归吉。利贞。' },
  54: { name: '归妹', eng: 'Guimei', meaning: 'The Marrying Maiden',desc: '征凶，无所利。' },
  55: { name: '丰',  eng: 'Feng',    meaning: 'Abundance',          desc: '亨。王假之。勿忧宜日中。' },
  56: { name: '旅',  eng: 'Lü',      meaning: 'The Wanderer',       desc: '小亨。旅贞吉。' },
  57: { name: '巽',  eng: 'Xun',     meaning: 'The Gentle',         desc: '小亨。利有攸往，利见大人。' },
  58: { name: '兑',  eng: 'Dui',     meaning: 'The Joyous',         desc: '亨，利贞。' },
  59: { name: '涣',  eng: 'Huan',    meaning: 'Dissolution',        desc: '亨。王假有庙，利涉大川，利贞。' },
  60: { name: '节',  eng: 'Jie',     meaning: 'Limitation',         desc: '亨。苦节不可贞。' },
  61: { name: '中孚', eng: 'Zhongfu', meaning: 'Inner Truth',       desc: '豚鱼，吉。利涉大川，利贞。' },
  62: { name: '小过', eng: 'Xiaoguo', meaning: 'Small Exceeding',   desc: '亨，利贞。可小事，不可大事。飞鸟遗之音，不应上，只应下，大吉。' },
  63: { name: '既济', eng: 'Jiji',   meaning: 'After Completion',   desc: '亨。小利贞。初吉终乱。' },
  64: { name: '未济', eng: 'Weiji',  meaning: 'Before Completion',  desc: '亨。小狐汔济，濡其尾，无攸利。' },
};

// ============ Global Application State ============

let currentQuestion      = '';  // The question the user is asking
let currentLineValues    = [];  // Array of 6 coin-sum values (6|7|8|9), index 0 = bottom line
let currentHexagramNumber = 0;  // Primary hexagram number (1–64)
let changedHexagramNumber = 0;  // Changed hexagram number, 0 if no changing lines
let currentRound         = 0;   // How many coin rounds completed (0–6)
let isAutoTossing        = false; // Guard to prevent double-toss during auto mode

// ============ Core I Ching Logic ============

/**
 * Simulates one coin toss.
 * @returns {number} 3 (heads/yang) or 2 (tails/yin)
 */
function tossCoin() {
  return Math.random() >= 0.5 ? 3 : 2;
}

/**
 * Simulates tossing three coins and returns their sum.
 * Possible sums: 6 (old yin), 7 (young yang), 8 (young yin), 9 (old yang).
 * @returns {number} Sum of three coins in range [6, 9]
 */
function tossThreeCoins() {
  return tossCoin() + tossCoin() + tossCoin();
}

/**
 * Maps a coin-sum value to a symbolic line type.
 * @param {number} value - Coin sum (6, 7, 8, or 9)
 * @returns {string} Line type identifier
 */
function lineType(value) {
  switch (value) {
    case 6: return 'old-yin';    // ╌✕╌  Changes to yang in transformed hexagram
    case 7: return 'young-yang'; // ━━━  Stable yang
    case 8: return 'young-yin';  // ╌ ╌  Stable yin
    case 9: return 'old-yang';   // ━○━  Changes to yin in transformed hexagram
    default: return 'unknown';
  }
}

/**
 * Converts a line type to a human-readable Chinese label.
 * @param {string} type - One of the lineType return values
 * @returns {string} Chinese display name
 */
function lineTypeDisplayName(type) {
  return {
    'young-yang': '少阳（—）',
    'young-yin':  '少阴（-- --）',
    'old-yang':   '老阳（—○—）',
    'old-yin':    '老阴（-- ✕ --）',
  }[type] || type;
}

/**
 * Calculates the lower and upper trigram binary indices from 6 line values.
 * Lower trigram = lines[0..2], upper trigram = lines[3..5].
 * A yang line (value >= 7) contributes 1; yin (value < 7) contributes 0.
 *
 * @param {number[]} lines - Array of 6 coin sums (index 0 = bottom/first line)
 * @returns {{ lower: number, upper: number }} Trigram indices (0–7)
 */
function calculateTrigrams(lines) {
  let lower = 0;
  let upper = 0;

  // Lower trigram: lines 0–2 (line 1 is LSB)
  lower |= (lines[0] >= 7 ? 1 : 0) << 0;
  lower |= (lines[1] >= 7 ? 1 : 0) << 1;
  lower |= (lines[2] >= 7 ? 1 : 0) << 2;

  // Upper trigram: lines 3–5 (line 4 is LSB relative to upper)
  upper |= (lines[3] >= 7 ? 1 : 0) << 0;
  upper |= (lines[4] >= 7 ? 1 : 0) << 1;
  upper |= (lines[5] >= 7 ? 1 : 0) << 2;

  return { lower, upper };
}

/**
 * Looks up a hexagram number from the King Wen table.
 * @param {number} lower - Lower trigram index (0–7)
 * @param {number} upper - Upper trigram index (0–7)
 * @returns {number|null} Hexagram number (1–64) or null if out of range
 */
function getHexagramNumber(lower, upper) {
  if (lower < 0 || lower > 7 || upper < 0 || upper > 7) return null;
  return KING_WEN[lower][upper];
}

/**
 * Derives the primary hexagram number from 6 line values.
 * @param {number[]} lines
 * @returns {number} Hexagram number (1–64)
 */
function getHexagramFromLines(lines) {
  const { lower, upper } = calculateTrigrams(lines);
  return getHexagramNumber(lower, upper);
}

/**
 * Derives the changed (之卦) hexagram by flipping all changing lines.
 * Old yin (6) → young yang (7); old yang (9) → young yin (8).
 *
 * @param {number[]} lines - Original 6 line values
 * @returns {number|null} Changed hexagram number, or null if no changing lines
 */
function getChangedHexagram(lines) {
  // Only compute if there are changing lines
  const hasChanging = lines.some(v => v === 6 || v === 9);
  if (!hasChanging) return null;

  const flipped = lines.map(v => {
    if (v === 6) return 7; // Old yin → young yang
    if (v === 9) return 8; // Old yang → young yin
    return v;
  });

  return getHexagramFromLines(flipped);
}

// ============ UI Utilities ============

/**
 * Shows a hidden section by toggling CSS classes.
 * @param {string} sectionId - Element ID to show
 */
function showSection(sectionId) {
  const el = document.getElementById(sectionId);
  if (el) {
    el.classList.remove('section-hidden');
    el.classList.add('visible');
  }
}

/**
 * Hides a visible section by toggling CSS classes.
 * @param {string} sectionId - Element ID to hide
 */
function hideSection(sectionId) {
  const el = document.getElementById(sectionId);
  if (el) {
    el.classList.add('section-hidden');
    el.classList.remove('visible');
  }
}

/**
 * Displays a status message with a given type.
 * @param {string} elementId - ID of the status element
 * @param {'success'|'error'|'warning'} type - Message style
 * @param {string} message - Text to display
 */
function showStatus(elementId, type, message) {
  const el = document.getElementById(elementId);
  if (el) {
    el.textContent = message;
    el.className = 'status-message ' + type;
  }
}

// ============ API / Model Configuration ============

/**
 * Preset configurations for common OpenAI-compatible providers.
 * Each entry provides the base URL and default model name.
 */
const PRESETS = {
  openai:   { url: 'https://api.openai.com/v1',               model: 'gpt-4o-mini' },
  deepseek: { url: 'https://api.deepseek.com/v1',             model: 'deepseek-chat' },
  qwen:     { url: 'https://dashscope.aliyuncs.com/compatible-mode/v1', model: 'qwen-turbo' },
  ollama:   { url: 'http://localhost:11434/v1',               model: 'llama3' },
};

/**
 * Fills in the Base URL and Model fields from a preset provider.
 * @param {string} name - Preset key (openai | deepseek | qwen | ollama)
 */
function applyPreset(name) {
  const preset = PRESETS[name];
  if (!preset) return;
  document.getElementById('baseUrlInput').value = preset.url;
  document.getElementById('modelInput').value   = preset.model;
}

/** Collapses or expands the API config form. */
function toggleApiKeyForm() {
  document.getElementById('apiKeyCard').classList.toggle('collapsed');
  document.getElementById('apiToggleIcon').classList.toggle('rotated');
}

/** Toggles the API key input between password and plain text. */
function toggleApiKeyVisibility() {
  const input = document.getElementById('apiKeyInput');
  input.type = input.type === 'password' ? 'text' : 'password';
}

/**
 * Saves Base URL, model name, and API key to localStorage,
 * then collapses the config card and updates the status badge.
 */
function saveApiKey() {
  const baseUrl = document.getElementById('baseUrlInput').value.trim();
  const model   = document.getElementById('modelInput').value.trim();
  const apiKey  = document.getElementById('apiKeyInput').value.trim();

  if (!baseUrl) { showStatus('apiStatus', 'error', '请输入 Base URL'); return; }
  if (!model)   { showStatus('apiStatus', 'error', '请输入模型名称'); return; }
  if (!apiKey)  { showStatus('apiStatus', 'error', '请输入 API Key'); return; }

  localStorage.setItem('iching_base_url', baseUrl);
  localStorage.setItem('iching_model',    model);
  localStorage.setItem('iching_api_key',  apiKey);

  showStatus('apiStatus', 'success', `✓ 已保存：${model} @ ${baseUrl}`);
  updateConfigBadge(model);

  setTimeout(() => {
    document.getElementById('apiKeyCard').classList.add('collapsed');
    document.getElementById('apiToggleIcon').classList.add('rotated');
  }, 1200);
}

/**
 * Updates the small badge in the API card header.
 * @param {string|null} model - Model name, or null if not configured
 */
function updateConfigBadge(model) {
  const badge = document.getElementById('apiConfigStatus');
  if (!badge) return;
  if (model) {
    badge.textContent = model;
    badge.classList.add('ok');
  } else {
    badge.textContent = '未配置';
    badge.classList.remove('ok');
  }
}

/**
 * Loads saved configuration from localStorage and pre-fills the form.
 * Collapses the card only if all three fields are present.
 */
function loadApiKeyIfExists() {
  const baseUrl = localStorage.getItem('iching_base_url');
  const model   = localStorage.getItem('iching_model');
  const apiKey  = localStorage.getItem('iching_api_key');

  if (baseUrl) document.getElementById('baseUrlInput').value = baseUrl;
  if (model)   document.getElementById('modelInput').value   = model;
  if (apiKey)  document.getElementById('apiKeyInput').value  = apiKey;

  if (baseUrl && model && apiKey) {
    document.getElementById('apiKeyCard').classList.add('collapsed');
    document.getElementById('apiToggleIcon').classList.add('rotated');
    updateConfigBadge(model);
  }
}

// ============ Question Input Helpers ============

/** Updates the character count display for the question textarea. */
function updateCharCount() {
  const len = document.getElementById('questionInput').value.length;
  document.getElementById('charCount').textContent = len;
}

/**
 * Fills the question textarea with a suggested question from a chip click.
 * @param {string} text - The suggested question text
 */
function fillQuestion(text) {
  const ta = document.getElementById('questionInput');
  ta.value = text;
  ta.focus();
  updateCharCount();
}

// ============ Main Interaction Flow ============

/** Validates the question and API config, then transitions to the coin toss phase. */
function submitQuestion() {
  const question = document.getElementById('questionInput').value.trim();
  if (!question) {
    alert('请输入您的问题后再起卦');
    return;
  }

  const baseUrl = localStorage.getItem('iching_base_url');
  const model   = localStorage.getItem('iching_model');
  const apiKey  = localStorage.getItem('iching_api_key');

  if (!baseUrl || !model || !apiKey) {
    alert('请先完成模型配置（Base URL、模型名称、API Key）');
    document.getElementById('apiKeyCard').classList.remove('collapsed');
    document.getElementById('apiToggleIcon').classList.remove('rotated');
    return;
  }

  // Reset state
  currentQuestion       = question;
  currentRound          = 0;
  currentLineValues     = [];
  currentHexagramNumber = 0;
  changedHexagramNumber = 0;
  isAutoTossing         = false;

  // Reset coin-toss UI to initial state
  document.getElementById('tossBtnText').style.display  = 'inline-block';
  document.getElementById('autoTossBtn').style.display  = 'inline-block';
  document.getElementById('nextRoundBtn').style.display = 'none';
  document.getElementById('nextRoundBtn').textContent   = '下一轮';
  document.getElementById('nextRoundBtn').onclick       = nextRound;
  document.getElementById('resultDisplay').textContent  = '点击「开始投掷」开始第一轮';
  document.getElementById('lineHistory').innerHTML      = '';
  updateRoundIndicator();
  updateProgressBar();
  updateRoundBadge();

  hideSection('hexagramSection');
  hideSection('interpretationSection');
  hideSection('resetButtonContainer');
  hideSection('questionCard');
  showSection('coinTossSection');

  document.getElementById('coinTossSection').scrollIntoView({ behavior: 'smooth' });
}

// ============ Coin Toss ============

/** Updates the "第 N 轮，共 6 轮" progress indicator. Caps display at 6. */
function updateRoundIndicator() {
  const display = Math.min(currentRound + 1, 6);
  document.getElementById('currentRound').textContent = display;
}

/** Updates the thin progress bar based on completed rounds. */
function updateProgressBar() {
  const pct = (currentRound / 6) * 100;
  document.getElementById('progressBar').style.width = pct + '%';
}

/** Updates the "N / 6" badge in the coin card header. */
function updateRoundBadge() {
  const badge = document.getElementById('roundBadge');
  if (badge) badge.textContent = `${Math.min(currentRound, 6)} / 6`;
}

/**
 * Redraws the compact line-history strip below the result display.
 * Each completed round gets a color-coded dot showing yang/yin/changing state.
 */
function updateLineHistory() {
  const container = document.getElementById('lineHistory');
  if (!container) return;
  container.innerHTML = '';

  currentLineValues.forEach((val, idx) => {
    const dot = document.createElement('div');
    dot.className = 'history-dot';
    dot.title = `第${idx + 1}爻：${lineTypeDisplayName(lineType(val))}`;

    if      (val === 9) { dot.classList.add('old-yang'); dot.textContent = '老阳'; }
    else if (val === 7) { dot.classList.add('yang');     dot.textContent = '少阳'; }
    else if (val === 8) { dot.classList.add('yin');      dot.textContent = '少阴'; }
    else                { dot.classList.add('old-yin');  dot.textContent = '老阴'; }

    container.appendChild(dot);
  });
}

/**
 * Executes one round of three-coin tossing:
 *  1. Rolls coins, stores the result.
 *  2. Plays the flip animation on all three coins.
 *  3. After 800 ms (animation complete), updates the UI.
 */
function tossCoinRound() {
  if (currentRound >= 6) return; // Safety guard

  const value = tossThreeCoins();
  currentLineValues.push(value);
  currentRound++;

  // Trigger flip animation on each coin
  document.querySelectorAll('.coin').forEach(coin => {
    coin.classList.add('flipping');
    setTimeout(() => coin.classList.remove('flipping'), 800);
  });

  // Update UI after the animation finishes (800 ms)
  setTimeout(() => {
    const type    = lineType(value);
    const typeName = lineTypeDisplayName(type);
    document.getElementById('resultDisplay').textContent =
      `第 ${currentRound} 轮：点数 ${value} → ${typeName}`;

    updateRoundIndicator();
    updateProgressBar();
    updateLineHistory();
    updateRoundBadge();

    if (currentRound < 6) {
      // Show "next round" button only if not in auto-toss mode
      if (!isAutoTossing) {
        document.getElementById('nextRoundBtn').style.display = 'inline-block';
      }
    } else {
      // All 6 rounds done — swap button to "view hexagram"
      document.getElementById('tossBtnText').style.display  = 'none';
      document.getElementById('autoTossBtn').style.display  = 'none';
      document.getElementById('nextRoundBtn').style.display = 'inline-block';
      document.getElementById('nextRoundBtn').textContent   = '查看卦象 →';
      document.getElementById('nextRoundBtn').onclick       = showHexagram;
    }
  }, 800);
}

/** Called by the "下一轮" button to advance to the next round. */
function nextRound() {
  if (currentRound >= 6) return;
  document.getElementById('resultDisplay').textContent = '准备投掷…';
  tossCoinRound();
}

/**
 * Automatically tosses all remaining rounds with a 1200 ms interval.
 * Disables buttons during execution to prevent interference.
 * Calls showHexagram() once all 6 rounds are complete (after animation finishes).
 */
function autoTossAll() {
  if (currentRound >= 6 || isAutoTossing) return;

  isAutoTossing = true;

  // Hide buttons during auto-toss
  document.getElementById('tossBtnText').style.display  = 'none';
  document.getElementById('autoTossBtn').style.display  = 'none';
  document.getElementById('nextRoundBtn').style.display = 'none';

  const interval = setInterval(() => {
    tossCoinRound();

    if (currentRound >= 6) {
      clearInterval(interval);
      // Wait for the last animation (800 ms) + a small buffer (200 ms)
      setTimeout(() => {
        isAutoTossing = false;
        showHexagram();
      }, 1000);
    }
  }, 1200); // 800 ms animation + 400 ms pause before next round
}

// ============ Hexagram Rendering ============

/**
 * Renders a set of hexagram lines into the specified container.
 * Lines are drawn from bottom (line 1) to top (line 6):
 *  - The container uses flex-direction: column-reverse so that line 1 appears at the bottom.
 *  - We iterate i = 0 → 5 so the DOM order (0 appended first) maps to the visual bottom.
 *  - Each line gets a staggered animation delay so they appear sequentially from bottom to top.
 *
 * @param {number[]} lines     - 6 coin-sum values (index 0 = bottom line)
 * @param {string}   containerId - ID of the flex container element
 * @param {number}  [baseDelay=0] - Extra delay (seconds) added to all animation timings
 */
function renderHexagramLines(lines, containerId, baseDelay = 0) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';

  // Iterate bottom (i=0, line 1) to top (i=5, line 6)
  // flex-direction:column-reverse will flip the visual order so line 1 is at bottom
  for (let i = 0; i < 6; i++) {
    const value   = lines[i];
    const type    = lineType(value);
    const lineNum = i + 1; // 1-based line number

    const lineEl = document.createElement('div');
    lineEl.className = 'hexagram-line';
    // Stagger: bottom line animates first (delay 0), top line last (delay 0.75s)
    lineEl.style.animationDelay = `${baseDelay + i * 0.15}s`;

    // Determine the CSS class for the line visual
    const isYang = type === 'young-yang' || type === 'old-yang';
    const lineClass = isYang ? 'line-yang' : 'line-yin';

    // Show a marker for changing lines (old yin=六, old yang=九)
    const markerText = value === 6 ? '六' : value === 9 ? '九' : '';

    lineEl.innerHTML = `
      <div class="line-content">
        <div class="line-marker">${markerText}</div>
        <div class="line-visual ${lineClass}"></div>
        <div class="line-label">第${lineNum}爻</div>
      </div>
    `;

    container.appendChild(lineEl);
  }
}

/**
 * Renders the trigram info (symbol, name, element) below a hexagram display.
 * @param {number} lower - Lower trigram index
 * @param {number} upper - Upper trigram index
 * @param {string} containerId - ID of the trigram info element
 */
function renderTrigramInfo(lower, upper, containerId) {
  const lt = TRIGRAMS[lower];
  const ut = TRIGRAMS[upper];
  document.getElementById(containerId).innerHTML = `
    <div class="trigram">
      <div class="trigram-symbol">${ut.symbol}</div>
      <div class="trigram-name">${ut.name}</div>
      <div class="trigram-meaning">上卦·${ut.element}</div>
    </div>
    <div class="trigram-divider"></div>
    <div class="trigram">
      <div class="trigram-symbol">${lt.symbol}</div>
      <div class="trigram-name">${lt.name}</div>
      <div class="trigram-meaning">下卦·${lt.element}</div>
    </div>
  `;
}

/** Builds and displays the primary and (optionally) changed hexagram. */
function renderHexagram() {
  const hexData = HEXAGRAMS[currentHexagramNumber];
  const { lower, upper } = calculateTrigrams(currentLineValues);

  // Update the card header title
  document.getElementById('hexagramTitle').innerHTML =
    `第 ${currentHexagramNumber} 卦 · <span style="font-size:1.5rem;">${hexData.name}</span>` +
    `<span style="font-size:0.9rem;color:var(--text-light);margin-left:8px;">${hexData.meaning}</span>`;

  // Show the classical hexagram text as a blockquote
  const descEl = document.getElementById('hexagramDesc');
  if (descEl) descEl.textContent = `卦辞：${hexData.desc}`;

  // Render the 6 lines and trigram info for the primary hexagram
  renderHexagramLines(currentLineValues, 'hexagramLineContainer');
  renderTrigramInfo(lower, upper, 'trigramInfo');

  // Render changed hexagram only if there are changing lines that produce a different hexagram
  if (changedHexagramNumber && changedHexagramNumber !== currentHexagramNumber) {
    const changedHexData = HEXAGRAMS[changedHexagramNumber];
    const changedLines   = currentLineValues.map(v => (v === 6 ? 7 : v === 9 ? 8 : v));
    const { lower: cL, upper: cU } = calculateTrigrams(changedLines);

    document.getElementById('changedHexagramTitle').textContent =
      `第 ${changedHexagramNumber} 卦《${changedHexData.name}》`;

    renderHexagramLines(changedLines, 'changedHexagramLineContainer', 0.3);
    renderTrigramInfo(cL, cU, 'changedTrigramInfo');
    document.getElementById('changedHexagramSection').style.display = 'block';
  } else {
    document.getElementById('changedHexagramSection').style.display = 'none';
  }
}

/** Transitions from the coin-toss phase to the hexagram display phase. */
function showHexagram() {
  currentHexagramNumber = getHexagramFromLines(currentLineValues);
  changedHexagramNumber = getChangedHexagram(currentLineValues);

  renderHexagram();

  hideSection('coinTossSection');
  showSection('hexagramSection');

  // Scroll to hexagram, then start fetching the AI interpretation
  setTimeout(() => {
    document.getElementById('hexagramSection').scrollIntoView({ behavior: 'smooth' });
  }, 100);

  setTimeout(() => {
    getInterpretation();
  }, 1500);
}

// ============ Reset ============

/** Resets all state and returns to the question input form. */
function resetAll() {
  currentQuestion       = '';
  currentLineValues     = [];
  currentHexagramNumber = 0;
  changedHexagramNumber = 0;
  currentRound          = 0;
  isAutoTossing         = false;

  document.getElementById('questionInput').value = '';
  document.getElementById('charCount').textContent = '0';
  document.getElementById('lineHistory').innerHTML = '';
  updateRoundBadge();

  showSection('questionCard');
  hideSection('coinTossSection');
  hideSection('hexagramSection');
  hideSection('interpretationSection');
  hideSection('resetButtonContainer');

  document.getElementById('questionCard').scrollIntoView({ behavior: 'smooth' });
}

// ============ Claude API Integration ============

/**
 * System prompt for the I Ching sage persona.
 * Instructs Claude to respond in structured Chinese with classical yet accessible language.
 */
const SYSTEM_PROMPT = `你是一位精通周易的智慧占卜师，拥有深厚的易学造诣。请用温和、神秘而充满智慧的语气给予指引，语言古朴典雅而不晦涩，结合现代理解。

请按以下结构回应（每节保持简洁）：

【卦象含义】
简介本卦的核心象征与精神（2-3句）

【问题解读】
结合用户的具体问题，解读卦象对当前处境的指示（3-4句）

【变卦指引】（仅在有变爻时出现）
解读变卦的含义与潜在转机（2-3句）

【行动建议】
给出3-4条具体、实际、可操作的指引

总字数约400-500字。`;

/**
 * Builds the user message prompt for the Claude API call.
 * @param {string} question         - User's question
 * @param {number} hexagramNum      - Primary hexagram number
 * @param {number} changedHexNum    - Changed hexagram number (0 if none)
 * @returns {string} Formatted prompt string
 */
function buildPrompt(question, hexagramNum, changedHexNum) {
  const h = HEXAGRAMS[hexagramNum];
  let prompt = `用户问题：${question}\n\n`;
  prompt += `本卦：第 ${hexagramNum} 卦《${h.name}》（${h.eng}）\n`;
  prompt += `卦意：${h.meaning}\n`;
  prompt += `卦辞：${h.desc}\n`;

  if (changedHexNum && changedHexNum !== hexagramNum) {
    const ch = HEXAGRAMS[changedHexNum];
    prompt += `\n之卦：第 ${changedHexNum} 卦《${ch.name}》（${ch.eng}）\n`;
    prompt += `卦意：${ch.meaning}\n`;
    prompt += `卦辞：${ch.desc}\n`;
  }

  prompt += `\n请根据以上卦象，给出深刻的占卜解读与实际指引。`;
  return prompt;
}

/**
 * Converts a subset of Markdown syntax to HTML.
 * Handles bold (**text**), italic (*text*), and paragraph breaks (\n\n).
 * @param {string} text - Raw text (possibly partial, during streaming)
 * @returns {string} HTML string
 */
function markdownToHtml(text) {
  let html = text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>');

  // Wrap in a paragraph if not already
  if (html && !html.startsWith('<p>')) html = '<p>' + html;
  if (html && !html.endsWith('</p>')) html = html + '</p>';

  return html;
}

/**
 * Fetches the AI interpretation via an OpenAI-compatible streaming API.
 * Reads Base URL, model, and API key from localStorage.
 * Streams the response text directly into the interpretation card.
 */
async function getInterpretation() {
  const baseUrl = localStorage.getItem('iching_base_url');
  const model   = localStorage.getItem('iching_model');
  const apiKey  = localStorage.getItem('iching_api_key');

  if (!baseUrl || !model || !apiKey) {
    showInterpretationError('未找到模型配置，请点击右上角「⚙️ 模型配置」完成设置');
    return;
  }

  showSection('interpretationSection');
  document.getElementById('interpretationContent').innerHTML = '';
  document.getElementById('loadingIndicator').classList.add('active');

  const userPrompt = buildPrompt(currentQuestion, currentHexagramNumber, changedHexagramNumber);

  // Endpoint follows OpenAI-compatible convention: <baseUrl>/chat/completions
  const endpoint = baseUrl.replace(/\/$/, '') + '/chat/completions';

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type':  'application/json',
      },
      body: JSON.stringify({
        model,
        max_tokens: 1024,
        stream:     true,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user',   content: userPrompt    },
        ],
      }),
    });

    // Surface API-level errors (401 invalid key, 429 rate limit, etc.)
    if (!response.ok) {
      let errMsg = `HTTP ${response.status}`;
      try {
        const errData = await response.json();
        errMsg = errData.error?.message || errMsg;
      } catch (_) { /* response body wasn't JSON */ }
      throw new Error(errMsg);
    }

    // Parse the Server-Sent Events (SSE) stream
    const reader  = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer   = '';
    let fullText = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      // Process all complete lines; keep any trailing incomplete fragment in buffer
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;

        const raw = line.slice(6).trim();
        if (raw === '[DONE]') break;

        try {
          const json  = JSON.parse(raw);
          // OpenAI format: choices[0].delta.content
          const chunk = json.choices?.[0]?.delta?.content ?? '';
          if (!chunk) continue;

          fullText += chunk;

          // Re-render the entire accumulated text on each chunk
          const contentEl = document.getElementById('interpretationContent');
          contentEl.innerHTML = markdownToHtml(fullText);
        } catch (_) {
          // Malformed SSE chunk — skip silently
        }
      }
    }

    document.getElementById('loadingIndicator').classList.remove('active');
    showSection('resetButtonContainer');

  } catch (err) {
    console.error('[I Ching] API error:', err);
    showInterpretationError(`解读失败：${err.message}`);
  }
}

/**
 * Displays an error message in the interpretation card and shows the reset button.
 * @param {string} message - Error text to display
 */
function showInterpretationError(message) {
  document.getElementById('loadingIndicator').classList.remove('active');
  document.getElementById('interpretationContent').innerHTML =
    `<p style="color:#C62828;text-align:center;">${message}</p>`;
  showSection('resetButtonContainer');
}

// ============ Initialization ============

document.addEventListener('DOMContentLoaded', () => {
  loadApiKeyIfExists();
  document.getElementById('questionInput').addEventListener('input', updateCharCount);
});
