# 易经占卜 - I Ching Fortune Teller

An elegant, interactive online I Ching (易经六爻八卦) divination system powered by AI.

🌐 **Live Demo**: [https://qianfei11.github.io/I-Ching-Fortune-Teller/](https://qianfei11.github.io/I-Ching-Fortune-Teller/)

---

## Features

✨ **Beautiful UI Design**
- Kawaii + Minimalist Zen aesthetic
- Soft pastel colors (mint green, peach pink, cream white)
- Smooth animations and intuitive interactions
- Mobile-responsive design, cute fortune-telling cat mascot

🔮 **Authentic I Ching Logic**
- Three-coin toss simulation (6 rounds, 3 coins each)
- Full 64 hexagram database with traditional names and classical text (卦辞)
- Automatic calculation of primary and changed hexagrams (之卦)
- King Wen (文王) sequence ordering

🤖 **OpenAI-Compatible AI Integration**
- Works with any OpenAI-compatible API (OpenAI, DeepSeek, Qwen, Ollama, etc.)
- Real-time streaming interpretation
- Wise, mystical tone blending ancient wisdom with modern guidance
- Built-in quick presets for popular providers

🚀 **Easy to Use**
- No installation required — pure static HTML/CSS/JavaScript
- GitHub Pages ready — deploy in minutes
- All configuration stored locally in your browser, nothing uploaded

---

## Quick Start

### 1. Get an API Key

Choose any **OpenAI-compatible** provider:

| Provider | Base URL | Model example |
|----------|----------|---------------|
| [OpenAI](https://platform.openai.com/) | `https://api.openai.com/v1` | `gpt-4o-mini` |
| [DeepSeek](https://platform.deepseek.com/) | `https://api.deepseek.com/v1` | `deepseek-chat` |
| [通义千问](https://dashscope.console.aliyun.com/) | `https://dashscope.aliyuncs.com/compatible-mode/v1` | `qwen-turbo` |
| [Ollama](https://ollama.ai/) (local) | `http://localhost:11434/v1` | `llama3` |

### 2. Open the App

**Option A — Use the live site:**
👉 [https://qianfei11.github.io/I-Ching-Fortune-Teller/](https://qianfei11.github.io/I-Ching-Fortune-Teller/)

**Option B — Run locally:**
```bash
git clone https://github.com/qianfei11/I-Ching-Fortune-Teller.git
# Then open index.html in your browser — no server needed
```

**Option C — Deploy your own copy:**
1. Fork this repository
2. Go to **Settings → Pages**
3. Select **Deploy from a branch** → `main` / root
4. Your site will be live at `https://yourusername.github.io/I-Ching-Fortune-Teller/`

### 3. Configure the Model

Click **⚙️ 模型配置** and fill in:
- **Base URL** — your provider's API endpoint (or click a preset button)
- **模型名称** — the model you want to use
- **API Key** — your provider's API key

Click **保存配置**. Your settings are stored locally in the browser.

### 4. Perform a Reading

1. **提问** — Type your question in the text area (or tap a suggestion chip)
2. **起卦** — Toss coins 6 times (manual or auto)
3. **解卦** — The AI sage streams a personalized interpretation

---

## Technical Details

### Architecture
- **Frontend**: Pure HTML/CSS/JavaScript (no frameworks, no build step)
- **API**: Any OpenAI-compatible `/chat/completions` endpoint with SSE streaming
- **Hosting**: GitHub Pages (static, no backend)

### Files
| File | Purpose |
|------|---------|
| `index.html` | Single-page app structure |
| `styles.css` | Design system + animations |
| `script.js` | I Ching logic + API integration |
| `_config.yml` | GitHub Pages configuration |

### localStorage Keys
| Key | Content |
|-----|---------|
| `iching_base_url` | Provider Base URL |
| `iching_model` | Model name |
| `iching_api_key` | API key |

---

## I Ching Reference

### Line Values (三枚铜币之和)
| Sum | Name | Symbol | Meaning |
|-----|------|--------|---------|
| 6 | 老阴 Old Yin | `╌ ✕ ╌` | Changing — transforms to Yang |
| 7 | 少阳 Young Yang | `━━━━━` | Stable Yang line |
| 8 | 少阴 Young Yin | `╌╌ ╌╌` | Stable Yin line |
| 9 | 老阳 Old Yang | `━━○━━` | Changing — transforms to Yin |

### The 8 Trigrams (八卦)
| Symbol | Name | Element |
|--------|------|---------|
| ☰ | 乾 Qian | 天 Heaven |
| ☷ | 坤 Kun | 地 Earth |
| ☳ | 震 Zhen | 雷 Thunder |
| ☵ | 坎 Kan | 水 Water |
| ☶ | 艮 Gen | 山 Mountain |
| ☲ | 离 Li | 火 Fire |
| ☴ | 巽 Xun | 风 Wind |
| ☱ | 兑 Dui | 泽 Lake |

---

## Customization

### System Prompt
Edit `SYSTEM_PROMPT` in `script.js` to change the AI sage's tone, language, or response structure.

### Colors
Edit CSS variables in `styles.css`:
```css
:root {
  --color-primary:   #7BC8A4;  /* Mint green */
  --color-secondary: #FFB3C1;  /* Peach pink */
  --color-accent:    #F9E4B7;  /* Cream yellow */
}
```

---

## Troubleshooting

**Interpretation doesn't appear / API error**
- Open browser DevTools (F12) → Console tab for detailed error messages
- Verify your Base URL has no trailing slash issues (the app adds `/chat/completions` automatically)
- Confirm the API key is valid and has sufficient credits
- Some providers require CORS to be enabled — check provider documentation

**Coins not animating**
- Ensure JavaScript is enabled in your browser
- Try a hard refresh (Ctrl+Shift+R / Cmd+Shift+R)

**Ollama CORS error**
- Start Ollama with: `OLLAMA_ORIGINS="*" ollama serve`

---

## Privacy

- **Your question** is sent to your configured AI provider for interpretation
- **API credentials** are stored only in your browser's `localStorage`, never uploaded
- **Hexagram generation** happens entirely in your browser
- **No analytics**, no tracking, no external dependencies beyond fonts and the AI API

---

**Made with 🐱 and ✨ for wisdom-seekers everywhere**

*天行健，君子以自强不息。地势坤，君子以厚德载物。*
*(Heaven moves with vigor; the noble one strives without cease.)*
