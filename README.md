# 易经占卜 - I Ching Fortune Teller

An elegant, interactive online I Ching (易经六爻八卦) divination system powered by Claude AI.

## Features

✨ **Beautiful UI Design**
- Kawaii + Minimalist Zen aesthetic
- Soft pastel colors (mint green, peach pink, cream white)
- Smooth animations and intuitive interactions
- Mobile-responsive design
- Cute fortune-telling cat mascot

🔮 **Authentic I Ching Logic**
- Three-coin toss simulation (6 rounds, 3 coins each)
- Full 64 hexagram database with traditional names and meanings
- Automatic calculation of primary and changed hexagrams
- King Wen sequence ordering

🤖 **Claude AI Integration**
- Real-time streaming interpretation using Claude API
- Wise, mystical tone blending ancient wisdom with modern understanding
- Personalized readings based on your specific question

🚀 **Easy to Use**
- No installation required - pure static HTML/CSS/JavaScript
- GitHub Pages ready - deploy in minutes
- Secure - API key stored locally in your browser, never sent to our servers
- No server backend needed

## How to Use

### 1. Get an API Key
1. Visit [Anthropic Console](https://console.anthropic.com/)
2. Sign up or log in
3. Create a new API key
4. Copy your API key (starts with `sk-ant-`)

### 2. Start Using the App

**Option A: Use the Live Demo**
Visit: [https://bea1e.github.io/I-Ching-Fortune-Teller](https://bea1e.github.io/I-Ching-Fortune-Teller)

**Option B: Run Locally**
1. Clone or download this repository
2. Open `index.html` in your web browser
3. Enter your API key in the "配置API密钥" section
4. Ask your question and start divination!

**Option C: Deploy Your Own Copy**
1. Fork this repository to your GitHub account
2. Go to Settings → Pages
3. Select "Deploy from a branch"
4. Choose `main` branch and `/root` folder
5. Your site will be available at `https://yourusername.github.io/I-Ching-Fortune-Teller`

### 3. Using the Divination System

1. **Enter Your Question**: Type a specific question you'd like guidance on
2. **Toss Coins**: Click "开始投掷" to simulate throwing 3 coins 6 times
   - Each throw generates a line of the hexagram
   - Watch the coins flip and see the results
3. **View Hexagram**: After 6 tosses, the complete hexagram is displayed
   - Shows all 6 lines with yin/yang representations
   - Displays upper and lower trigrams
   - Shows changed hexagram if applicable
4. **Read Interpretation**: Claude AI provides a mystical yet practical interpretation
   - Explains the hexagram's meaning
   - Relates it to your specific question
   - Offers guidance for action

## Technical Details

### Architecture
- **Frontend**: Pure HTML/CSS/JavaScript (no frameworks)
- **Styling**: Custom CSS with animations
- **API**: Anthropic Claude API v1 (streaming support)
- **Hosting**: GitHub Pages

### Files
- `index.html` - Main HTML structure
- `styles.css` - All styling and animations
- `script.js` - I Ching logic and Claude API integration
- `_config.yml` - GitHub Pages configuration

### Browser Compatibility
- Chrome/Edge (recommended)
- Firefox
- Safari
- Modern mobile browsers

### Data Storage
- API key stored in browser `localStorage`
- No data sent to external servers except Claude API
- All computation happens in your browser

## I Ching Interpretation Guide

### Line Values
- **6 (Old Yin 老阴)**: Broken line with marker - changing to yang
- **7 (Young Yang 少阳)**: Solid line - stable
- **8 (Young Yin 少阴)**: Broken line - stable
- **9 (Old Yang 老阳)**: Solid line with marker - changing to yin

### The 64 Hexagrams
Each hexagram combines two trigrams (upper and lower):
- **天(Qian)** - Heaven
- **地(Kun)** - Earth
- **雷(Zhen)** - Thunder
- **水(Kan)** - Water
- **山(Gen)** - Mountain
- **火(Li)** - Fire
- **风(Xun)** - Wind
- **泽(Dui)** - Lake

## API Costs

Using Claude API will incur charges based on:
- Input tokens: ~$0.003 per 1K tokens
- Output tokens: ~$0.015 per 1K tokens

Typical I Ching readings use ~300 input tokens and ~400 output tokens = ~$0.01-0.02 per reading

Check [Anthropic Pricing](https://www.anthropic.com/pricing) for current rates.

## Customization

### Change the AI Model
Edit `script.js` line ~650:
```javascript
model: 'claude-opus-4-6', // Change to claude-sonnet-4-6 or claude-haiku-4-5
```

### Modify the System Prompt
Edit the `SYSTEM_PROMPT` constant in `script.js` to change the AI's tone and style.

### Adjust Colors
Edit CSS variables in `styles.css`:
```css
:root {
  --color-primary: #7BC8A4;    /* Change these */
  --color-secondary: #FFB3C1;
  --color-accent: #F9E4B7;
}
```

## Troubleshooting

**"Invalid API Key" Error**
- Make sure your API key starts with `sk-ant-`
- Check that you're using an active API key from Anthropic console
- API keys are stored locally - refresh the page and re-enter if needed

**Coins not animating**
- Check your browser's JavaScript is enabled
- Try a different browser
- Clear browser cache

**Interpretation not showing**
- Check your internet connection
- Verify API key is valid
- Check browser console (F12) for error messages
- API might be rate-limited if used heavily

## Privacy

- **Your Question**: Sent to Claude API for interpretation
- **API Key**: Never shared - only used in your browser for API authentication
- **Hexagram Data**: Generated locally, never sent anywhere
- **No Tracking**: This app contains no analytics or tracking code

## License

This project is provided as-is for personal use. The I Ching is ancient wisdom, adapted here with respect for its tradition.

## Support

For issues or questions:
- Check the Troubleshooting section above
- Review browser console (F12 → Console tab)
- Verify your API key at [Anthropic Console](https://console.anthropic.com/)

---

**Made with 🐱 and ✨ for wisdom-seekers everywhere**

*易经云：观其所礼，则人之邪正可知矣。* (The I Ching teaches that by observing how one conducts oneself, one's true nature becomes clear.)
