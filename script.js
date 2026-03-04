// ============ I Ching Data & Constants ============

// 8 Trigrams (arranged by binary index: line1=LSB to line3=MSB)
const TRIGRAMS = {
  7: { name: '乾', symbol: '☰', element: '天', en: 'Qian' },
  6: { name: '兑', symbol: '☱', element: '泽', en: 'Dui' },
  5: { name: '离', symbol: '☲', element: '火', en: 'Li' },
  4: { name: '震', symbol: '☳', element: '雷', en: 'Zhen' },
  3: { name: '巽', symbol: '☴', element: '风', en: 'Xun' },
  2: { name: '坎', symbol: '☵', element: '水', en: 'Kan' },
  1: { name: '艮', symbol: '☶', element: '山', en: 'Gen' },
  0: { name: '坤', symbol: '☷', element: '地', en: 'Kun' },
};

// King Wen Sequence Lookup Table
// KING_WEN[lower_index][upper_index] -> hexagram number
const KING_WEN = [
  [12, 45, 35, 16, 20, 8, 23, 2],     // lower=Kun(0)
  [33, 31, 56, 62, 53, 39, 52, 15],   // lower=Gen(1)
  [6, 47, 64, 40, 59, 29, 4, 7],      // lower=Kan(2)
  [44, 28, 50, 32, 57, 48, 18, 46],   // lower=Xun(3)
  [25, 17, 21, 51, 42, 3, 27, 24],    // lower=Zhen(4)
  [13, 49, 30, 55, 37, 63, 22, 36],   // lower=Li(5)
  [10, 58, 38, 54, 61, 60, 41, 19],   // lower=Dui(6)
  [1, 43, 14, 34, 9, 5, 26, 11],      // lower=Qian(7)
];

// 64 Hexagrams Data
const HEXAGRAMS = {
  1: { name: '乾', eng: 'Qian', meaning: 'Heaven', desc: '元亨利贞。潜龙勿用。见龙在田，利见大人。君子终日乾乾，夕惕若。有孚，若无其咎。衣鱼在木，小人勿用。龙战于野，其血玄黄。龙无头，凶。' },
  2: { name: '坤', eng: 'Kun', meaning: 'Earth', desc: '元亨，利牝马之贞。君子有攸往，先迷后得主，利西南得朋，东北丧朋。安贞吉。' },
  3: { name: '屯', eng: 'Zhun', meaning: 'Difficulty', desc: '元亨利贞，勿用有攸往。利建侯。' },
  4: { name: '蒙', eng: 'Meng', meaning: 'Youthful Folly', desc: '亨。匪我求童蒙，童蒙求我。初筮告，再三渎，渎则不告。利贞。' },
  5: { name: '需', eng: 'Xu', meaning: 'Waiting', desc: '有孚，光亨，贞吉。利涉大川。' },
  6: { name: '讼', eng: 'Song', meaning: 'Conflict', desc: '有孚，窒。惕中吉。终凶。利见大人，不利涉大川。' },
  7: { name: '师', eng: 'Shi', meaning: 'The Army', desc: '贞，丈人吉，无咎。' },
  8: { name: '比', eng: 'Bi', meaning: 'Holding Together', desc: '吉。原筮元永贞，无咎。不宁方来，后夫凶。' },
  9: { name: '小畜', eng: 'Xiaoxu', meaning: 'Small Restraint', desc: '亨。密云不雨，自我西郊。' },
  10: { name: '履', eng: 'Lü', meaning: 'Treading', desc: '履虎尾，不咥人，亨。' },
  11: { name: '泰', eng: 'Tai', meaning: 'Peace', desc: '小往大来，吉亨。' },
  12: { name: '否', eng: 'Pi', meaning: 'Standstill', desc: '不利君子贞，大往小来。' },
  13: { name: '同人', eng: 'Tongren', meaning: 'Fellowship', desc: '同人于野，亨。利涉大川，利君子贞。' },
  14: { name: '大有', eng: 'Dayou', meaning: 'Great Possession', desc: '元亨。' },
  15: { name: '谦', eng: 'Qian', meaning: 'Modesty', desc: '亨。君子有终。' },
  16: { name: '豫', eng: 'Yu', meaning: 'Enthusiasm', desc: '利建侯行师。' },
  17: { name: '随', eng: 'Sui', meaning: 'Following', desc: '元亨利贞，无咎。' },
  18: { name: '蛊', eng: 'Gu', meaning: 'Work on Decay', desc: '元亨，利涉大川。先甲三日，后甲三日。' },
  19: { name: '临', eng: 'Lin', meaning: 'Approach', desc: '元亨利贞。至于八月有凶。' },
  20: { name: '观', eng: 'Guan', meaning: 'Contemplation', desc: '盥而不荐，有孚颙若。' },
  21: { name: '噬嗑', eng: 'Shihuo', meaning: 'Biting Through', desc: '亨。利用狱。' },
  22: { name: '贲', eng: 'Bi', meaning: 'Grace', desc: '亨。小利有攸往。' },
  23: { name: '剥', eng: 'Buo', meaning: 'Splitting Apart', desc: '不利有攸往。' },
  24: { name: '复', eng: 'Fu', meaning: 'Return', desc: '亨。出入无疾，朋来无咎。反复之道，七日来复，利有攸往。' },
  25: { name: '无妄', eng: 'Wuwang', meaning: 'Innocence', desc: '元亨利贞。其匪正有眚，不利有攸往。' },
  26: { name: '大畜', eng: 'Daxu', meaning: 'Great Restraint', desc: '利贞。不家食，吉。利涉大川。' },
  27: { name: '颐', eng: 'Yi', meaning: 'Nourishment', desc: '贞吉。观颐，自求口实。' },
  28: { name: '大过', eng: 'Daguo', meaning: 'Great Exceeding', desc: '栋桡。利有攸往，亨。' },
  29: { name: '坎', eng: 'Kan', meaning: 'The Abyss', desc: '习坎，有孚。行有尚，心亨。' },
  30: { name: '离', eng: 'Li', meaning: 'Brightness', desc: '利贞，亨。畜牝牛，吉。' },
  31: { name: '咸', eng: 'Xian', meaning: 'Influence', desc: '亨。利贞。取女吉。' },
  32: { name: '恒', eng: 'Heng', meaning: 'Duration', desc: '亨。无咎。利贞。利有攸往。' },
  33: { name: '遯', eng: 'Tun', meaning: 'Retreat', desc: '亨。小利贞。' },
  34: { name: '大壮', eng: 'Dazhuang', meaning: 'Great Strength', desc: '利贞。' },
  35: { name: '晋', eng: 'Jin', meaning: 'Progress', desc: '康侯用锡马蕃庶，昼日三接。' },
  36: { name: '明夷', eng: 'Mingyi', meaning: 'Darkening', desc: '利艰贞。' },
  37: { name: '家人', eng: 'Jiaren', meaning: 'The Family', desc: '利女贞。' },
  38: { name: '睽', eng: 'Kui', meaning: 'Opposition', desc: '小事吉。' },
  39: { name: '蹇', eng: 'Jian', meaning: 'Obstruction', desc: '利西南，不利东北。利见大人，贞吉。' },
  40: { name: '解', eng: 'Jie', meaning: 'Deliverance', desc: '利西南。无所往，其来复吉。有攸往，夙吉。' },
  41: { name: '损', eng: 'Sun', meaning: 'Decrease', desc: '有孚，元吉。无咎。可贞。利有攸往。二人同心，其利断金。同心之言，其臭如兰。' },
  42: { name: '益', eng: 'Yi', meaning: 'Increase', desc: '元亨利贞。利有攸往，利涉大川。' },
  43: { name: '夬', eng: 'Guai', meaning: 'Breakthrough', desc: '扬于王庭，孚号有厉，告自邑，不利即戎，利有攸往。' },
  44: { name: '姤', eng: 'Gou', meaning: 'Coming to Meet', desc: '女壮，勿用取女。' },
  45: { name: '萃', eng: 'Cui', meaning: 'Gathering', desc: '亨。王假有庙，利见大人，亨，利贞。用大牲吉，利有攸往。' },
  46: { name: '升', eng: 'Sheng', meaning: 'Ascending', desc: '元亨。用见大人，勿恤，南征吉。' },
  47: { name: '困', eng: 'Kun', meaning: 'Exhaustion', desc: '贞，大人吉，无咎。言有尚。' },
  48: { name: '井', eng: 'Jing', meaning: 'The Well', desc: '改邑而不改井，无丧无得。往来井井。汔至亦未绳井。羸其瓶，凶。' },
  49: { name: '革', eng: 'Ge', meaning: 'Revolution', desc: '己日乃孚。元亨利贞，悔亡。' },
  50: { name: '鼎', eng: 'Ding', meaning: 'The Cauldron', desc: '元吉，亨。' },
  51: { name: '震', eng: 'Zhen', meaning: 'The Arousing', desc: '亨。震来虩虩，笑言哑哑。震惊百里，不丧匕鬯。' },
  52: { name: '艮', eng: 'Gen', meaning: 'Keeping Still', desc: '艮其背，不获其身。行其庭，不见其人，无咎。' },
  53: { name: '渐', eng: 'Jian', meaning: 'Development', desc: '女归吉。利贞。' },
  54: { name: '归妹', eng: 'Guimei', meaning: 'The Marrying Maiden', desc: '征凶，无所利。' },
  55: { name: '丰', eng: 'Feng', meaning: 'Abundance', desc: '亨。王假之。勿忧宜日中。' },
  56: { name: '旅', eng: 'Lü', meaning: 'The Wanderer', desc: '小亨。旅贞吉。' },
  57: { name: '巽', eng: 'Xun', meaning: 'The Gentle', desc: '小亨。利有攸往，利见大人。' },
  58: { name: '兑', eng: 'Dui', meaning: 'The Joyous', desc: '亨，利贞。' },
  59: { name: '涣', eng: 'Huan', meaning: 'Dissolution', desc: '亨。王假有庙，利涉大川，利贞。' },
  60: { name: '节', eng: 'Jie', meaning: 'Limitation', desc: '亨。苦节不可贞。' },
  61: { name: '中孚', eng: 'Zhongfu', meaning: 'Inner Truth', desc: '豚鱼，吉。利涉大川，利贞。' },
  62: { name: '小过', eng: 'Xiaoguo', meaning: 'Small Exceeding', desc: '亨，利贞。可小事，不可大事。飞鸟遗之音，不应上，只应下，大吉。' },
  63: { name: '既济', eng: 'Jiji', meaning: 'After Completion', desc: '亨。小利贞。初吉终乱。' },
  64: { name: '未济', eng: 'Weiji', meaning: 'Before Completion', desc: '亨。小狐汔济，濡其尾，无攸利。' },
};

// ============ Global State ============
let currentQuestion = '';
let currentLineValues = []; // 6 values: 6, 7, 8, or 9
let currentHexagramNumber = 0;
let changedHexagramNumber = 0;
let currentRound = 0;

// ============ Core I Ching Logic ============

function tossCoin() {
  // Returns 2 (tails) or 3 (heads)
  return Math.random() > 0.5 ? 3 : 2;
}

function tossThreeCoins() {
  // Returns 6, 7, 8, or 9
  // Sum of 3 coins: 6, 7, 8, or 9
  const coin1 = tossCoin();
  const coin2 = tossCoin();
  const coin3 = tossCoin();
  return coin1 + coin2 + coin3;
}

function lineType(value) {
  // Determine line type based on coin sum
  switch(value) {
    case 6: return 'old-yin';    // Changing yin (breaks in middle with marker)
    case 7: return 'young-yang'; // Yang line
    case 8: return 'young-yin';  // Yin line (broken)
    case 9: return 'old-yang';   // Changing yang (marker in middle)
    default: return 'unknown';
  }
}

function generateHexagram() {
  // Generates 6 random line values
  const lines = [];
  for (let i = 0; i < 6; i++) {
    lines.push(tossThreeCoins());
  }
  return lines;
}

function calculateTrigrams(lines) {
  // lines is array of 6 values
  // Lower trigram: lines[0-2], Upper trigram: lines[3-5]
  // Binary representation: line as 1 if yang (7,9), 0 if yin (6,8)

  let lowerBinary = 0;
  let upperBinary = 0;

  // Lower trigram from lines 0, 1, 2 (line1=LSB)
  lowerBinary |= (lines[0] >= 7 ? 1 : 0) << 0;
  lowerBinary |= (lines[1] >= 7 ? 1 : 0) << 1;
  lowerBinary |= (lines[2] >= 7 ? 1 : 0) << 2;

  // Upper trigram from lines 3, 4, 5 (line4=LSB)
  upperBinary |= (lines[3] >= 7 ? 1 : 0) << 0;
  upperBinary |= (lines[4] >= 7 ? 1 : 0) << 1;
  upperBinary |= (lines[5] >= 7 ? 1 : 0) << 2;

  return { lower: lowerBinary, upper: upperBinary };
}

function getHexagramNumber(lower, upper) {
  // Look up in King Wen table
  if (lower < 0 || lower > 7 || upper < 0 || upper > 7) {
    return null;
  }
  return KING_WEN[lower][upper];
}

function getCurrentHexagram(lines) {
  const { lower, upper } = calculateTrigrams(lines);
  return getHexagramNumber(lower, upper);
}

function getChangedHexagram(lines) {
  // Find changing lines (6 and 9), flip them, recalculate
  const changedLines = lines.map(val => {
    if (val === 6) return 7; // Old yin becomes young yang
    if (val === 9) return 8; // Old yang becomes young yin
    return val;
  });

  // Check if there are actually changing lines
  const hasChanging = lines.some(val => val === 6 || val === 9);
  if (!hasChanging) return null;

  return getCurrentHexagram(changedLines);
}

function hasChangingLines(lines) {
  return lines.some(val => val === 6 || val === 9);
}

// ============ UI Helper Functions ============

function showSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    section.classList.remove('section-hidden');
    section.classList.add('visible');
  }
}

function hideSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    section.classList.add('section-hidden');
    section.classList.remove('visible');
  }
}

function toggleApiKeyForm() {
  const card = document.getElementById('apiKeyCard');
  const icon = document.getElementById('apiToggleIcon');
  card.classList.toggle('collapsed');
  icon.classList.toggle('rotated');
}

function toggleApiKeyVisibility() {
  const input = document.getElementById('apiKeyInput');
  input.type = input.type === 'password' ? 'text' : 'password';
}

function saveApiKey() {
  const apiKey = document.getElementById('apiKeyInput').value.trim();
  if (!apiKey) {
    showStatus('apiStatus', 'error', '请输入API密钥');
    return;
  }

  if (!apiKey.startsWith('sk-ant-')) {
    showStatus('apiStatus', 'warning', '密钥格式可能不正确');
  }

  localStorage.setItem('iching_api_key', apiKey);
  showStatus('apiStatus', 'success', '✓ API密钥已保存');

  // Collapse the form after 1 second
  setTimeout(() => {
    document.getElementById('apiKeyCard').classList.add('collapsed');
    document.getElementById('apiToggleIcon').classList.add('rotated');
  }, 1000);
}

function showStatus(elementId, type, message) {
  const el = document.getElementById(elementId);
  el.textContent = message;
  el.className = 'status-message ' + type;
}

function updateCharCount() {
  const textarea = document.getElementById('questionInput');
  const count = textarea.value.length;
  document.getElementById('charCount').textContent = count;
}

function loadApiKeyIfExists() {
  const savedKey = localStorage.getItem('iching_api_key');
  if (savedKey) {
    document.getElementById('apiKeyInput').value = savedKey;
    // Keep the form collapsed
    document.getElementById('apiKeyCard').classList.add('collapsed');
    document.getElementById('apiToggleIcon').classList.add('rotated');
  }
}

// ============ Main Interaction Flow ============

function submitQuestion() {
  const question = document.getElementById('questionInput').value.trim();
  if (!question) {
    alert('请输入您的问题');
    return;
  }

  const apiKey = localStorage.getItem('iching_api_key');
  if (!apiKey) {
    alert('请先设置API密钥');
    document.getElementById('apiKeyInput').focus();
    return;
  }

  currentQuestion = question;
  currentRound = 0;
  currentLineValues = [];

  // Hide question card, show coin toss section
  hideSection('questionCard');
  showSection('coinTossSection');
  hideSection('hexagramSection');
  hideSection('interpretationSection');
  hideSection('resetButtonContainer');

  // Reset coin toss UI
  updateRoundIndicator();
  updateProgressBar();
  document.getElementById('tossBtnText').style.display = 'inline-block';
  document.getElementById('nextRoundBtn').style.display = 'none';
  document.getElementById('autoTossBtn').style.display = 'inline-block';
  document.getElementById('resultDisplay').textContent = '准备投掷...';

  // Scroll to coin section
  document.getElementById('coinTossSection').scrollIntoView({ behavior: 'smooth' });
}

function tossCoinRound() {
  const value = tossThreeCoins();
  currentLineValues.push(value);
  currentRound++;

  // Animate coins
  const coins = document.querySelectorAll('.coin');
  coins.forEach((coin, idx) => {
    coin.classList.add('flipping');
    setTimeout(() => {
      coin.classList.remove('flipping');
    }, 800);
  });

  // Show result after animation
  setTimeout(() => {
    const typeStr = lineTypeDisplayName(lineType(value));
    document.getElementById('resultDisplay').textContent = `第 ${currentRound} 轮: ${value} → ${typeStr}`;

    updateRoundIndicator();
    updateProgressBar();

    if (currentRound < 6) {
      document.getElementById('nextRoundBtn').style.display = 'inline-block';
    } else {
      // All 6 rounds done
      document.getElementById('tossBtnText').style.display = 'none';
      document.getElementById('autoTossBtn').style.display = 'none';
      document.getElementById('nextRoundBtn').textContent = '查看卦象';
      document.getElementById('nextRoundBtn').onclick = showHexagram;
    }
  }, 800);
}

function nextRound() {
  if (currentRound < 6) {
    document.getElementById('resultDisplay').textContent = '准备投掷...';
    tossCoinRound();
  }
}

function autoTossAll() {
  if (currentRound >= 6) return;

  const tossingInterval = setInterval(() => {
    tossCoinRound();

    if (currentRound >= 6) {
      clearInterval(tossingInterval);
      setTimeout(() => {
        showHexagram();
      }, 500);
    }
  }, 1200); // 800ms animation + 400ms pause
}

function lineTypeDisplayName(type) {
  const typeMap = {
    'young-yang': '少阳（—）',
    'young-yin': '少阴（-- --）',
    'old-yang': '老阳（—⃝）',
    'old-yin': '老阴（-- ⃝ --）'
  };
  return typeMap[type] || type;
}

function updateRoundIndicator() {
  document.getElementById('currentRound').textContent = currentRound + 1;
}

function updateProgressBar() {
  const percentage = (currentRound / 6) * 100;
  document.getElementById('progressBar').style.width = percentage + '%';
}

function showHexagram() {
  currentHexagramNumber = getCurrentHexagram(currentLineValues);
  changedHexagramNumber = getChangedHexagram(currentLineValues);

  // Draw hexagram
  renderHexagram();

  // Hide coin section, show hexagram
  hideSection('coinTossSection');
  showSection('hexagramSection');

  // Scroll to hexagram
  setTimeout(() => {
    document.getElementById('hexagramSection').scrollIntoView({ behavior: 'smooth' });
  }, 100);

  // After a delay, fetch and show interpretation
  setTimeout(() => {
    getInterpretation();
  }, 1500);
}

function renderHexagram() {
  const hexData = HEXAGRAMS[currentHexagramNumber];
  const { lower, upper } = calculateTrigrams(currentLineValues);

  // Update title
  document.getElementById('hexagramTitle').innerHTML = `
    第 ${currentHexagramNumber} 卦 · <span style="font-size: 1.5rem;">${hexData.name}</span>
  `;

  // Draw lines
  const container = document.getElementById('hexagramLineContainer');
  container.innerHTML = '';

  // Lines are stored bottom to top (line 0 is bottom), but we display top to bottom
  // So we iterate from line 5 down to line 0
  for (let i = 5; i >= 0; i--) {
    const value = currentLineValues[i];
    const type = lineType(value);
    const lineNum = i + 1;

    const lineEl = document.createElement('div');
    lineEl.className = 'hexagram-line';
    lineEl.style.animationDelay = `${(5 - i) * 0.15}s`;

    let lineHTML = `<div class="line-content">`;

    if (value === 6 || value === 9) {
      // Has changing line marker
      lineHTML += `<div class="line-marker">${value === 6 ? '六' : '九'}</div>`;
    } else {
      lineHTML += `<div class="line-marker"></div>`;
    }

    if (type === 'young-yang' || type === 'old-yang') {
      lineHTML += `<div class="line-visual line-yang"></div>`;
    } else {
      lineHTML += `<div class="line-visual line-yin"></div>`;
    }

    lineHTML += `<div class="line-label">第${lineNum}爻</div>`;
    lineHTML += `</div>`;

    lineEl.innerHTML = lineHTML;
    container.appendChild(lineEl);
  }

  // Show trigram info
  const lowerTrigram = TRIGRAMS[lower];
  const upperTrigram = TRIGRAMS[upper];

  const trigramHTML = `
    <div class="trigram">
      <div class="trigram-symbol">${upperTrigram.symbol}</div>
      <div class="trigram-name">${upperTrigram.name}</div>
      <div class="trigram-meaning">${upperTrigram.element}</div>
    </div>
    <div style="width: 1px; background: rgba(0,0,0,0.1);"></div>
    <div class="trigram">
      <div class="trigram-symbol">${lowerTrigram.symbol}</div>
      <div class="trigram-name">${lowerTrigram.name}</div>
      <div class="trigram-meaning">${lowerTrigram.element}</div>
    </div>
  `;

  document.getElementById('trigramInfo').innerHTML = trigramHTML;

  // Show changed hexagram if applicable
  if (changedHexagramNumber && changedHexagramNumber !== currentHexagramNumber) {
    const changedData = HEXAGRAMS[changedHexagramNumber];
    const changedLines = currentLineValues.map(val => {
      if (val === 6) return 7;
      if (val === 9) return 8;
      return val;
    });
    const { lower: cLower, upper: cUpper } = calculateTrigrams(changedLines);
    const cLowerTrigram = TRIGRAMS[cLower];
    const cUpperTrigram = TRIGRAMS[cUpper];

    const changedLineContainer = document.getElementById('changedHexagramLineContainer');
    changedLineContainer.innerHTML = '';

    for (let i = 5; i >= 0; i--) {
      const value = changedLines[i];
      const type = lineType(value);
      const lineNum = i + 1;

      const lineEl = document.createElement('div');
      lineEl.className = 'hexagram-line';
      lineEl.style.animationDelay = `${(5 - i) * 0.15 + 0.3}s`;

      let lineHTML = `<div class="line-content">`;
      lineHTML += `<div class="line-marker"></div>`;

      if (type === 'young-yang' || type === 'old-yang') {
        lineHTML += `<div class="line-visual line-yang"></div>`;
      } else {
        lineHTML += `<div class="line-visual line-yin"></div>`;
      }

      lineHTML += `<div class="line-label">第${lineNum}爻</div>`;
      lineHTML += `</div>`;

      lineEl.innerHTML = lineHTML;
      changedLineContainer.appendChild(lineEl);
    }

    const changedTrigramHTML = `
      <div class="trigram">
        <div class="trigram-symbol">${cUpperTrigram.symbol}</div>
        <div class="trigram-name">${cUpperTrigram.name}</div>
        <div class="trigram-meaning">${cUpperTrigram.element}</div>
      </div>
      <div style="width: 1px; background: rgba(0,0,0,0.1);"></div>
      <div class="trigram">
        <div class="trigram-symbol">${cLowerTrigram.symbol}</div>
        <div class="trigram-name">${cLowerTrigram.name}</div>
        <div class="trigram-meaning">${cLowerTrigram.element}</div>
      </div>
    `;

    document.getElementById('changedTrigramInfo').innerHTML = changedTrigramHTML;
    document.getElementById('changedHexagramSection').style.display = 'block';
  } else {
    document.getElementById('changedHexagramSection').style.display = 'none';
  }
}

// ============ Claude API Integration ============

const SYSTEM_PROMPT = `你是一位精通周易的智慧占卜师，用温和、神秘而充满智慧的语气给予指引。基于用户的问题和卦象，提供深刻的卦象解读和实际建议。

回答应该包含：
1. 【卦象含义】简介本卦的核心象征（2-3句）
2. 【问题解读】结合用户的具体问题解读卦象指示（3-4句）
3. 【变卦指引】如有变爻，解读变卦的含义和转机（可选，2-3句）
4. 【实际建议】给出3-4条具体可行的建议或指引

语言要求：中文，约400-500字，语言古朴典雅但不晦涩，融合现代理解。`;

function buildPrompt(question, hexagramNum, changedHexagramNum) {
  const hexData = HEXAGRAMS[hexagramNum];
  let prompt = `用户问题：${question}\n\n`;
  prompt += `占得卦象：第 ${hexagramNum} 卦《${hexData.name}》\n`;
  prompt += `卦象含义：${hexData.meaning}\n`;
  prompt += `经文：${hexData.desc}\n`;

  if (changedHexagramNum && changedHexagramNum !== hexagramNum) {
    const changedData = HEXAGRAMS[changedHexagramNum];
    prompt += `\n变卦：第 ${changedHexagramNum} 卦《${changedData.name}》\n`;
    prompt += `变卦含义：${changedData.meaning}\n`;
  }

  prompt += `\n请根据以上卦象和用户的问题，给出智慧的占卜解读和指引。`;

  return prompt;
}

async function getInterpretation() {
  const apiKey = localStorage.getItem('iching_api_key');
  if (!apiKey) {
    showInterpretationError('API密钥缺失，请重新设置');
    return;
  }

  showSection('interpretationSection');
  document.getElementById('interpretationContent').innerHTML = '';
  document.getElementById('loadingIndicator').classList.add('active');

  const prompt = buildPrompt(currentQuestion, currentHexagramNumber, changedHexagramNumber);

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-opus-4-6',
        max_tokens: 1024,
        stream: true,
        system: SYSTEM_PROMPT,
        messages: [
          { role: 'user', content: prompt }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `API Error: ${response.status}`);
    }

    // Handle SSE stream
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let fullText = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');

      // Keep the last incomplete line in buffer
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') break;

          try {
            const json = JSON.parse(data);
            const text = json.delta?.text || '';
            fullText += text;

            // Update display
            const contentEl = document.getElementById('interpretationContent');
            contentEl.innerHTML = markdownToHtml(fullText);
            contentEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          } catch (e) {
            // Ignore parse errors
          }
        }
      }
    }

    document.getElementById('loadingIndicator').classList.remove('active');
    showSection('resetButtonContainer');

  } catch (error) {
    console.error('API Error:', error);
    showInterpretationError(`错误: ${error.message}`);
  }
}

function markdownToHtml(text) {
  // Simple markdown to HTML conversion
  let html = text
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>');

  if (html && !html.startsWith('<p>')) {
    html = '<p>' + html;
  }
  if (html && !html.endsWith('</p>')) {
    html = html + '</p>';
  }

  return html;
}

function showInterpretationError(message) {
  document.getElementById('loadingIndicator').classList.remove('active');
  document.getElementById('interpretationContent').innerHTML = `<p style="color: #C62828; text-align: center;">${message}</p>`;
  showSection('resetButtonContainer');
}

function resetAll() {
  // Clear state
  currentQuestion = '';
  currentLineValues = [];
  currentHexagramNumber = 0;
  changedHexagramNumber = 0;
  currentRound = 0;

  // Reset UI
  document.getElementById('questionInput').value = '';
  document.getElementById('charCount').textContent = '0';

  showSection('questionCard');
  hideSection('coinTossSection');
  hideSection('hexagramSection');
  hideSection('interpretationSection');
  hideSection('resetButtonContainer');

  // Scroll back to top
  document.getElementById('questionCard').scrollIntoView({ behavior: 'smooth' });
}

// ============ Initialization ============

document.addEventListener('DOMContentLoaded', function() {
  loadApiKeyIfExists();

  // Set up event listener for character counter
  document.getElementById('questionInput').addEventListener('input', updateCharCount);
});
