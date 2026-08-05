# HEXfolio — Master Your Emotions Before You Master The Market

When the market turns red, your portfolio should not become your personality.

HEXfolio is a behavioral finance web experience where stocks become emotional 3D pets. It helps beginner investors practice financial literacy by spotting panic, FOMO, loss aversion, anchoring, and revenge trading before those feelings turn into impulsive decisions.

Built for **Hackonomics 2027**, a hackathon about connecting computer science, economics, and financial literacy.

## Live Demo

https://hexfolio.vercel.app/

## Why HEXfolio

Most finance tools assume the user is calm.

Real beginners usually are not.

A stock drops hard. The screen turns red. Someone online says the market is doomed. Another person says this is the perfect dip. Suddenly, the user is not just reading a chart. They are fighting panic, regret, shame, FOMO, and the urge to do something just to feel in control.

That is where financial literacy often breaks. Not because people never learned what a stock is, but because emotion hijacks the moment when the lesson matters most.

HEXfolio was also inspired by seeing sharp moves in Korean stocks like SK Hynix and Samsung. When prices swing, new investors can easily fall into doom-scrolling, revenge trading, or blaming themselves. I wanted to make that moment less lonely and less negative by turning the emotion into something visible, funny, and teachable.

## What It Does

HEXfolio is not a stock-picking app. It does not give buy or sell advice.

It is a financial literacy playground where market stress becomes an interactive lesson.

### Emotion Playground

Each stock becomes a 3D robot pet with its own mood. If the stock falls, the pet may look stressed, dramatic, or overwhelmed. If it rises, the pet can look excited, but still needs rules.

Users can drag emotion tools onto the pet:

| Tool | What It Does |
| --- | --- |
| Curse | Releases panic without pretending the price changed |
| Shield | Separates conviction from risk blindness |
| Candle | Flips the emotional candle, not the real market |
| CEO | Summons silly corporate reassurance and questions narratives |
| Graveyard | Puts a position away temporarily to stop obsessive checking |
| Seal | Starts a cooldown before revenge-clicking |

Sometimes red `ERROR` bubbles appear around a losing pet, saying things like `SELL NOW??`, `WHY DID I BUY THIS`, or `PANIC TAB OPEN`. The Curse tool can seal those bubbles away, turning a stressful reaction into a small moment of relief.

### Time Machine

Users see only part of a historical stock path and must choose **Buy**, **Hold**, or **Sell** before the future is revealed.

After the choice, HEXfolio reveals what happened next and explains the behavioral finance lesson behind the moment. The goal is not to predict perfectly. The goal is to notice the bias before it makes the decision.

### Investor DNA

After enough Time Machine answers, users unlock a shareable-style investor report. It summarizes patterns like FOMO, panic selling, patience, and self-awareness in a format that feels closer to a social media personality report than a finance worksheet.

## Architecture

```mermaid
flowchart TD
  User["User<br/>Beginner investor"] --> UI["React + Vite Frontend<br/>HEXfolio experience"]

  UI --> Playground["Emotion Playground<br/>3D stock pets + emotion tools"]
  UI --> TimeMachine["Time Machine<br/>hidden historical chart decisions"]
  UI --> DNA["Investor DNA<br/>shareable behavior report"]

  Playground --> Three["Three.js Character Engine<br/>procedural expressive robots"]
  Playground --> Rituals["Ritual System<br/>curse, shield, candle, CEO, graveyard, seal"]
  Playground --> Bubbles["Meme + Error Bubble System<br/>emotional feedback layer"]

  TimeMachine --> Cases["Historical Market Cases<br/>bias prompts + reveal paths"]
  DNA --> Patterns["Behavior Pattern Summary<br/>unlocked after enough answers"]

  UI --> Quotes["Market Data Client<br/>sync stock movement"]
  Quotes --> LocalProxy["Local Dev Proxy<br/>/market-api"]
  Quotes --> VercelAPI["Vercel Serverless API<br/>/api/market?ticker=NVDA"]
  VercelAPI --> Yahoo["Yahoo Finance Chart Endpoint"]

  UI --> Deploy["Vercel Static Hosting<br/>dist output + API route"]
```

## Interaction Flow

```mermaid
sequenceDiagram
  participant User
  participant App as HEXfolio UI
  participant Pet as 3D Stock Pet
  participant API as Market API
  participant Market as Yahoo Finance

  User->>App: Opens HEXfolio
  App->>API: Requests latest ticker movement
  API->>Market: Fetches chart data
  Market-->>API: Returns quote metadata
  API-->>App: Returns market JSON
  App->>Pet: Updates mood from stock movement
  Pet-->>User: Shows stress, calm, or hype
  User->>App: Uses an emotion tool
  App->>Pet: Triggers comfort animation
  Pet-->>User: Shows meme bubble feedback
```

## Built With

| Layer | Technology |
| --- | --- |
| Frontend | React, Vite, JavaScript |
| 3D Characters | Three.js |
| Interface | CSS, custom animation, drag-and-drop interactions |
| Icons | Lucide React |
| Market Data | Yahoo Finance chart endpoint |
| API Layer | Vercel Serverless Function |
| Deployment | Vercel |

## Project Structure

```text
HEXfolio/
├── api/
│   └── market.js          # Vercel serverless market-data endpoint
├── public/
│   ├── hexfolio-logo.png  # site logo + favicon
│   └── rituals/           # emotion tool assets
├── src/
│   ├── main.jsx           # app logic, Three.js robots, modes, market sync
│   └── styles.css         # layout, visual system, animation
├── index.html
├── vite.config.js         # local dev proxy
├── vercel.json            # deployed SPA rewrite
└── package.json
```

## Run Locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## What I Learned

Financial literacy is not only about knowing terms like diversification, valuation, or FOMO. It is also about recognizing the exact moment when emotion tries to drive the decision.

Building HEXfolio taught me that education can be more memorable when it has a body, a face, and a reaction. A paragraph saying "avoid panic selling" is easy to ignore. A tiny robot drowning in red error bubbles is harder to forget.

## What's Next

- Add more historical Time Machine cases
- Make Investor DNA more personalized and shareable
- Add richer portfolio import options
- Improve mobile layout
- Expand the emotion tool system with more playful coping mechanics
- Add a real user progress layer for financial literacy growth

## Disclaimer

HEXfolio is for education and financial literacy. It does not provide investment advice, price predictions, or buy/sell recommendations.
