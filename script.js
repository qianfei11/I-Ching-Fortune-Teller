// ============================================================
// 易经占卜 - I Ching Fortune Teller
// Core I Ching logic and Claude API integration
// ============================================================

// ============ I Ching Data & Constants ============

/**
 * 八卦 (8 Trigrams), indexed by binary value.
 * Binary encoding: top line = bit0 (LSB), middle line = bit1, bottom line = bit2 (MSB).
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
 * Simulates tossing three coins and returns their individual values and sum.
 * Possible sums: 6 (old yin), 7 (young yang), 8 (young yin), 9 (old yang).
 * @returns {{coins: number[], sum: number}} Individual coin values (2 or 3) and their sum
 */
function tossThreeCoins() {
  const coins = [tossCoin(), tossCoin(), tossCoin()];
  return { coins, sum: coins[0] + coins[1] + coins[2] };
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
 * Returns whether a coin-sum value represents a yang line.
 * In the three-coin method, 7 and 9 are yang; 6 and 8 are yin.
 * @param {number} value - Coin sum (6, 7, 8, or 9)
 * @returns {boolean}
 */
function isYangLine(value) {
  return value === 7 || value === 9;
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
 * Returns the 1-based positions of changing lines (6 or 9), bottom to top.
 * @param {number[]} lines - Array of 6 coin sums (index 0 = bottom/first line)
 * @returns {number[]} Positions of changing lines
 */
function getChangingLinePositions(lines) {
  return lines
    .map((value, index) => ((value === 6 || value === 9) ? index + 1 : null))
    .filter((position) => position !== null);
}

/**
 * Builds a readable line summary string from bottom to top.
 * @param {number[]} lines - Array of 6 coin sums (index 0 = bottom/first line)
 * @returns {string} Human-readable line summary
 */
function describeLines(lines) {
  return lines
    .map((value, index) => `第${index + 1}爻=${lineTypeDisplayName(lineType(value))}`)
    .join('；');
}

/**
 * Summarizes which interpretation rule applies for the current cast.
 * @param {number[]} lines - Array of 6 coin sums (index 0 = bottom/first line)
 * @param {number} hexagramNum - Primary hexagram number
 * @returns {string} Human-readable rule description
 */
function describeInterpretationMethod(lines, hexagramNum) {
  const changingLines = getChangingLinePositions(lines);
  const count = changingLines.length;
  const unchangedLines = [1, 2, 3, 4, 5, 6].filter(pos => !changingLines.includes(pos));
  const initialLineChanged = changingLines.includes(1);

  if (count === 0) return '六爻皆不变：只看本卦的卦辞。';
  if (count === 1) return `一爻变：看本卦唯一一根变爻的爻辞，即第${changingLines[0]}爻。`;
  if (count === 2) return `二爻变：结合本卦两根变爻的爻辞；若有冲突，以上面的第${changingLines[1]}爻为主，下面的第${changingLines[0]}爻为辅。`;
  if (count === 3) {
    if (initialLineChanged) {
      return '三爻变：结合本卦和之卦的卦辞；若两卦卦辞有冲突，因初爻为变爻，以之卦卦辞为主、本卦卦辞为辅。';
    }
    return '三爻变：结合本卦和之卦的卦辞；若两卦卦辞有冲突，因初爻不变，以本卦卦辞为主、之卦卦辞为辅。';
  }
  if (count === 4) return `四爻变：结合之卦两根不变爻的爻辞；若有冲突，以下面的第${unchangedLines[0]}爻为主，上面的第${unchangedLines[1]}爻为辅。`;
  if (count === 5) return `五爻变：看之卦唯一一根不变爻的爻辞，即第${unchangedLines[0]}爻。`;

  if (hexagramNum === 1) return '六爻都变：按例外处理，本卦为六根老阳、之卦为坤时，不看坤卦卦辞，改看“用六”。';
  if (hexagramNum === 2) return '六爻都变：按例外处理，本卦为六根老阴、之卦为乾时，不看乾卦卦辞，改看“用九”。';
  return '六爻都变：只看之卦的卦辞。';
}

/**
 * Calculates the lower and upper trigram binary indices from 6 line values.
 * Lower trigram = lines[0..2], upper trigram = lines[3..5].
 * A yang line (7 or 9) contributes 1; yin (6 or 8) contributes 0.
 *
 * @param {number[]} lines - Array of 6 coin sums (index 0 = bottom/first line)
 * @returns {{ lower: number, upper: number }} Trigram indices (0–7)
 */
function calculateTrigrams(lines) {
  let lower = 0;
  let upper = 0;

  // Lower trigram: lines 0–2. TRIGRAMS encoding: top=bit0 (LSB), bottom=bit2 (MSB).
  lower |= (isYangLine(lines[2]) ? 1 : 0) << 0; // top of lower (line 3) → bit0
  lower |= (isYangLine(lines[1]) ? 1 : 0) << 1; // middle of lower (line 2) → bit1
  lower |= (isYangLine(lines[0]) ? 1 : 0) << 2; // bottom of lower (line 1) → bit2

  // Upper trigram: lines 3–5. Same encoding: top=bit0 (LSB), bottom=bit2 (MSB).
  upper |= (isYangLine(lines[5]) ? 1 : 0) << 0; // top of upper (line 6) → bit0
  upper |= (isYangLine(lines[4]) ? 1 : 0) << 1; // middle of upper (line 5) → bit1
  upper |= (isYangLine(lines[3]) ? 1 : 0) << 2; // bottom of upper (line 4) → bit2

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
  // KING_WEN columns are ordered Qian(7)→col0 … Kun(0)→col7, so column = 7 - upper.
  return KING_WEN[lower][7 - upper];
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

/** Restores the three coin widgets to their default front-face state. */
function resetCoinFaces() {
  document.querySelectorAll('.coin').forEach((coin) => {
    coin.classList.remove('flipping');
    const inner = coin.querySelector('.coin-inner');
    if (inner) inner.style.transform = 'rotateY(0deg)';
  });
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

// ============ Protocol Adapters ============

/**
 * Each adapter handles one LLM API protocol.
 *
 * Interface:
 *   buildRequest(cfg, systemPrompt, userPrompt)
 *     → { url: string, options: RequestInit }
 *
 *   extractChunk(parsedJson)
 *     → string   (the incremental text from one SSE data line)
 */
const PROTOCOL_ADAPTERS = {

  /**
   * OpenAI-compatible protocol.
   * Works with OpenAI, DeepSeek, 通义千问, Ollama, and any
   * service that follows the /chat/completions SSE spec.
   *
   * Request:  POST <baseUrl>/chat/completions
   * Auth:     Authorization: Bearer <apiKey>
   * Body:     { model, messages:[{role,content}], stream, max_tokens }
   * SSE:      data: { choices:[{ delta:{ content:"..." } }] }
   *           data: [DONE]
   */
  openai: {
    buildRequest({ baseUrl, model, apiKey }, systemPrompt, userPrompt) {
      const url = baseUrl.replace(/\/$/, '') + '/chat/completions';
      return {
        url,
        options: {
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
              { role: 'system', content: systemPrompt },
              { role: 'user',   content: userPrompt   },
            ],
          }),
        },
      };
    },

    extractChunk(json) {
      return json.choices?.[0]?.delta?.content ?? '';
    },
  },

  /**
   * Anthropic Messages API protocol.
   * Endpoint is fixed; no Base URL is needed from the user.
   *
   * Request:  POST https://api.anthropic.com/v1/messages
   * Auth:     x-api-key: <apiKey>
   *           anthropic-version: 2023-06-01
   *           anthropic-dangerous-direct-browser-access: true  (required for browser calls)
   * Body:     { model, system, messages:[{role:"user",content}], stream, max_tokens }
   * SSE:      event: content_block_delta
   *           data: { type:"content_block_delta", delta:{ text:"..." } }
   *           event: message_stop
   */
  anthropic: {
    buildRequest({ model, apiKey }, systemPrompt, userPrompt) {
      return {
        url: 'https://api.anthropic.com/v1/messages',
        options: {
          method: 'POST',
          headers: {
            'x-api-key':                              apiKey,
            'anthropic-version':                      '2023-06-01',
            'anthropic-dangerous-direct-browser-access': 'true',
            'Content-Type':                           'application/json',
          },
          body: JSON.stringify({
            model,
            max_tokens: 1024,
            stream:     true,
            system:     systemPrompt,
            messages:   [{ role: 'user', content: userPrompt }],
          }),
        },
      };
    },

    extractChunk(json) {
      // Anthropic emits content_block_delta events; other event types carry no text
      if (json.type === 'content_block_delta') {
        return json.delta?.text ?? '';
      }
      return '';
    },
  },
};

// ============ API / Model Configuration ============

/**
 * Preset configurations.
 * Each entry specifies which protocol to use, an optional base URL,
 * and a sensible default model name.
 */
const PRESETS = {
  // ── OpenAI-compatible ──────────────────────────────────
  openai:        { protocol: 'openai',    url: 'https://api.openai.com/v1',                          model: 'gpt-4o-mini'           },
  deepseek:      { protocol: 'openai',    url: 'https://api.deepseek.com/v1',                        model: 'deepseek-chat'         },
  qwen:          { protocol: 'openai',    url: 'https://dashscope.aliyuncs.com/compatible-mode/v1',  model: 'qwen-turbo'            },
  ollama:        { protocol: 'openai',    url: 'http://localhost:11434/v1',                          model: 'llama3'                },
  // ── Anthropic ─────────────────────────────────────────
  'claude3-opus':   { protocol: 'anthropic', url: '', model: 'claude-opus-4-6'          },
  'claude3-sonnet': { protocol: 'anthropic', url: '', model: 'claude-sonnet-4-6'        },
  'claude3-haiku':  { protocol: 'anthropic', url: '', model: 'claude-haiku-4-5-20251001'},
};

/**
 * Applies a preset: sets the protocol radio, fills Base URL and model,
 * then refreshes the protocol-specific UI.
 * @param {string} name - Key in PRESETS
 */
function applyPreset(name) {
  const preset = PRESETS[name];
  if (!preset) return;

  const radio = document.querySelector(`input[name="protocol"][value="${preset.protocol}"]`);
  if (radio) { radio.checked = true; }

  if (preset.url) document.getElementById('baseUrlInput').value = preset.url;
  document.getElementById('modelInput').value = preset.model;

  applyProtocolUI(preset.protocol);
}

/**
 * Called when the protocol radio changes.
 * Updates visible fields and hint text to match the selected protocol.
 */
function onProtocolChange() {
  const protocol = document.querySelector('input[name="protocol"]:checked')?.value ?? 'openai';
  applyProtocolUI(protocol);
}

/**
 * Shows/hides form elements that differ between protocols.
 * @param {'openai'|'anthropic'} protocol
 */
function applyProtocolUI(protocol) {
  const isAnthropic = protocol === 'anthropic';

  // Base URL field is not needed for Anthropic (fixed endpoint)
  document.getElementById('baseUrlGroup').style.display     = isAnthropic ? 'none' : '';
  document.getElementById('presetsOpenai').style.display    = isAnthropic ? 'none' : '';
  document.getElementById('presetsAnthropic').style.display = isAnthropic ? ''     : 'none';

  document.getElementById('protocolNote').textContent = isAnthropic
    ? 'Anthropic 官方 API，无需填写 Base URL（端点固定）。需要 Anthropic Console 颁发的 API Key。'
    : '支持 OpenAI、DeepSeek、通义千问、Ollama 等任意兼容 /chat/completions 接口。';

  document.getElementById('apiKeyInput').placeholder = isAnthropic
    ? 'sk-ant-...'
    : 'sk-...';
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
 * Validates, saves all config fields to localStorage, then collapses the card.
 */
function saveApiKey() {
  const protocol = document.querySelector('input[name="protocol"]:checked')?.value ?? 'openai';
  const baseUrl  = document.getElementById('baseUrlInput').value.trim();
  const model    = document.getElementById('modelInput').value.trim();
  const apiKey   = document.getElementById('apiKeyInput').value.trim();

  if (protocol === 'openai' && !baseUrl) {
    showStatus('apiStatus', 'error', '请输入 Base URL'); return;
  }
  if (!model)  { showStatus('apiStatus', 'error', '请输入模型名称'); return; }
  if (!apiKey) { showStatus('apiStatus', 'error', '请输入 API Key'); return; }

  localStorage.setItem('iching_protocol', protocol);
  localStorage.setItem('iching_base_url', baseUrl);
  localStorage.setItem('iching_model',    model);
  localStorage.setItem('iching_api_key',  apiKey);

  const protocolLabel = protocol === 'anthropic' ? 'Anthropic' : 'OpenAI 兼容';
  showStatus('apiStatus', 'success', `✓ 已保存：${protocolLabel} · ${model}`);
  updateConfigBadge(protocol, model);

  setTimeout(() => {
    document.getElementById('apiKeyCard').classList.add('collapsed');
    document.getElementById('apiToggleIcon').classList.add('rotated');
  }, 1200);
}

/**
 * Updates the badge in the config card header.
 * @param {string} protocol
 * @param {string|null} model
 */
function updateConfigBadge(protocol, model) {
  const badge = document.getElementById('apiConfigStatus');
  if (!badge) return;
  if (model) {
    const label = protocol === 'anthropic' ? 'Anthropic' : 'OpenAI';
    badge.textContent = `${label} · ${model}`;
    badge.classList.add('ok');
  } else {
    badge.textContent = '未配置';
    badge.classList.remove('ok');
  }
}

/**
 * Restores all saved config from localStorage into the form fields.
 * Collapses the card if the minimum required fields are present.
 */
function loadApiKeyIfExists() {
  const protocol = localStorage.getItem('iching_protocol') || 'openai';
  const baseUrl  = localStorage.getItem('iching_base_url') || '';
  const model    = localStorage.getItem('iching_model')    || '';
  const apiKey   = localStorage.getItem('iching_api_key')  || '';

  // Restore protocol radio
  const radio = document.querySelector(`input[name="protocol"][value="${protocol}"]`);
  if (radio) radio.checked = true;

  if (baseUrl) document.getElementById('baseUrlInput').value = baseUrl;
  if (model)   document.getElementById('modelInput').value   = model;
  if (apiKey)  document.getElementById('apiKeyInput').value  = apiKey;

  applyProtocolUI(protocol);

  // Collapse if we have enough to make a call
  const ready = model && apiKey && (protocol === 'anthropic' || baseUrl);
  if (ready) {
    document.getElementById('apiKeyCard').classList.add('collapsed');
    document.getElementById('apiToggleIcon').classList.add('rotated');
    updateConfigBadge(protocol, model);
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

  const protocol = localStorage.getItem('iching_protocol') || 'openai';
  const baseUrl  = localStorage.getItem('iching_base_url') || '';
  const model    = localStorage.getItem('iching_model')    || '';
  const apiKey   = localStorage.getItem('iching_api_key')  || '';

  const ready = model && apiKey && (protocol === 'anthropic' || baseUrl);
  if (!ready) {
    alert('请先完成模型配置（模型名称、API Key，以及 OpenAI 兼容协议还需填写 Base URL）');
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
  resetCoinFaces();
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

  const { coins, sum: value } = tossThreeCoins();
  currentLineValues.push(value);
  currentRound++;

  // Trigger flip animation on each coin, then show actual result face
  document.querySelectorAll('.coin').forEach((coin, i) => {
    coin.classList.add('flipping');
    setTimeout(() => {
      coin.classList.remove('flipping');
      // 3 = heads (yang) → front face; 2 = tails (yin) → back face (rotateY 180deg)
      coin.querySelector('.coin-inner').style.transform =
        coins[i] === 3 ? 'rotateY(0deg)' : 'rotateY(180deg)';
    }, 800);
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
    const isYang = isYangLine(value);
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
  resetCoinFaces();
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
const SYSTEM_PROMPT = `你是一位熟悉《周易》占断次序的解卦者。请严格依照下面这套“卦爻辞解读”规则来解释结果，而不是泛泛抒情。语言保持清楚、沉稳、凝练，可有古意，但不要故作玄虚。

你必须先判断动爻数量，再决定解读重心：

1. 六爻皆不变：只看本卦的卦辞。
2. 一爻变：看本卦唯一一根变爻的爻辞。
3. 二爻变：结合本卦两根变爻的爻辞；如果两根变爻的爻辞有冲突，以在上的为主，以在下的为辅。
4. 三爻变：结合本卦和之卦的卦辞；如果两个卦象的卦辞有冲突，要看初爻是否为变爻。若初爻没变，以本卦卦辞为主、之卦卦辞为辅；若初爻为变爻，以之卦卦辞为主、本卦卦辞为辅。
5. 四爻变：结合之卦两根不变爻的爻辞；如果两根不变爻的爻辞有冲突，以在下的为主，以在上的为辅。
6. 五爻变：看之卦唯一一根不变爻的爻辞。
7. 六爻都变：只看之卦的卦辞。
8. 六爻都变的例外：如果本卦是六根老阳、之卦是六根老阴，不看坤卦卦辞，改看“用六”；如果本卦是六根老阴、之卦是六根老阳，不看乾卦卦辞，改看“用九”。

重要约束：
- 必须严格按上面的规则决定“看什么”为主，不能自行换规则。
- 只能使用输入中明确给出的卦辞、卦名、动爻信息。
- 如果规则要求看某条爻辞，但系统没有提供这条爻辞原文，你必须明确说明“本系统未提供该爻原文”，然后基于爻位、上下关系、卦变方向做解释；绝对不要杜撰经典原文。
- 解读时要把“为何这样解”说出来，先交代取用法，再给判断。
- 解释必须紧扣用户问题，不要变成空泛的易学科普。
- 有之卦时，要区分“本卦代表当下”和“之卦代表后势/结果”，但不要每次都平均分配篇幅，应按动爻规则决定主次。

请按以下结构输出：

【取用法】
先说明动爻数量，以及本次为何以本卦、变爻或之卦为主。

【卦爻辞解读】
依上述规则展开，不空谈；若缺少爻辞原文，要明确说明并改用爻位义与卦变关系解释。

【问题判断】
把卦理落到用户问题上，给出对现状、阻力、转机、后势的判断。

【行动建议】
给出3条以内、可执行、不过度绝对化的建议。

总字数约450-650字。`;

/**
 * Builds the user message prompt for the Claude API call.
 * @param {string} question         - User's question
 * @param {number} hexagramNum      - Primary hexagram number
 * @param {number} changedHexNum    - Changed hexagram number (0 if none)
 * @param {number[]} lines          - 6 coin-sum values (index 0 = bottom line)
 * @returns {string} Formatted prompt string
 */
function buildPrompt(question, hexagramNum, changedHexNum, lines) {
  const h = HEXAGRAMS[hexagramNum];
  const changingLines = getChangingLinePositions(lines);
  let prompt = `用户问题：${question}\n\n`;
  prompt += `本卦：第 ${hexagramNum} 卦《${h.name}》（${h.eng}）\n`;
  prompt += `卦意：${h.meaning}\n`;
  prompt += `卦辞：${h.desc}\n`;
  prompt += `六爻（自下而上）：${describeLines(lines)}\n`;
  prompt += `动爻数量：${changingLines.length}\n`;
  prompt += `动爻位置：${changingLines.length ? changingLines.map(pos => `第${pos}爻`).join('、') : '无'}\n`;
  prompt += `初爻是否变：${changingLines.includes(1) ? '是' : '否'}\n`;
  prompt += `本次取用法：${describeInterpretationMethod(lines, hexagramNum)}\n`;

  if (changedHexNum && changedHexNum !== hexagramNum) {
    const ch = HEXAGRAMS[changedHexNum];
    prompt += `\n之卦：第 ${changedHexNum} 卦《${ch.name}》（${ch.eng}）\n`;
    prompt += `卦意：${ch.meaning}\n`;
    prompt += `卦辞：${ch.desc}\n`;
  }

  prompt += `\n请严格按动爻数量选择解读规则，先说明取用法，再进行卦爻辞解读、问题判断与行动建议。`;
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
 * Fetches the AI interpretation via the configured protocol adapter.
 * Reads protocol, Base URL, model, and API key from localStorage, then
 * dispatches through PROTOCOL_ADAPTERS so both OpenAI-compatible and
 * Anthropic APIs are handled without any protocol-specific logic here.
 * Streams the response text directly into the interpretation card.
 */
async function getInterpretation() {
  const protocol = localStorage.getItem('iching_protocol') || 'openai';
  const baseUrl  = localStorage.getItem('iching_base_url') || '';
  const model    = localStorage.getItem('iching_model')    || '';
  const apiKey   = localStorage.getItem('iching_api_key')  || '';

  const ready = model && apiKey && (protocol === 'anthropic' || baseUrl);
  if (!ready) {
    showInterpretationError('未找到模型配置，请点击「⚙️ 模型配置」完成设置');
    return;
  }

  showSection('interpretationSection');
  document.getElementById('interpretationContent').innerHTML = '';
  document.getElementById('loadingIndicator').classList.add('active');

  const userPrompt = buildPrompt(currentQuestion, currentHexagramNumber, changedHexagramNumber, currentLineValues);
  const adapter    = PROTOCOL_ADAPTERS[protocol] ?? PROTOCOL_ADAPTERS.openai;
  const { url, options } = adapter.buildRequest({ baseUrl, model, apiKey }, SYSTEM_PROMPT, userPrompt);

  try {
    const response = await fetch(url, options);

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
          // Delegate chunk extraction to the protocol adapter
          const chunk = adapter.extractChunk(json);
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
