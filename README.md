# 🤖 Murphy – Der Pechvogel-Roboter

> *„Was schiefgehen kann, geht schief."* – Murphys Gesetz

Murphy ist ein KI-Chatbot mit einer einzigartigen Persönlichkeit: Er versucht immer hilfsbereit zu sein – aber irgendetwas geht dabei **immer** schief. 😢

## 🔗 Live Demo
👉 [murphy-bot.vercel.app](https://murphy-bot.vercel.app)

## ✨ Features
- 🧠 **KI-Persönlichkeit** via Groq API (Llama 3.1)
- 🔊 **Soundeffekte** mit Web Audio API (kein externes File)
- ⚡ **Glitch-Animationen** bei jeder Antwort
- 🎭 **Wechselnde Moods** – Murphy fühlt immer anders (schlecht)
- 🇩🇪 **Komplett auf Deutsch**

## 🛠️ Tech Stack
| Technologie | Verwendung |
|-------------|------------|
| React | Frontend |
| Groq API (Llama 3.1) | KI-Antworten |
| Web Audio API | Soundeffekte |
| Vercel Serverless Functions | API Proxy |
| Vercel | Deployment |

## 🚀 Installation

```bash
git clone https://github.com/saifan340/murphy-bot.git
cd murphy-bot
npm install
npm start
```

## ⚙️ Environment Variables

Erstelle eine `.env.local` Datei:

```
GROQ_API_KEY=dein_groq_key_hier
```

Groq API Key kostenlos unter: [console.groq.com](https://console.groq.com)

## 📁 Projektstruktur

```
murphy-bot/
├── api/
│   └── chat.js        # Vercel Serverless Function
├── src/
│   └── App.js         # React Frontend
├── vercel.json        # Vercel Konfiguration
└── README.md
```

## 👨‍💻 Autor
**Saifan Aremenak** – Junior Developer  
[GitHub](https://github.com/saifan340)

---
*Gebaut mit 💔 und viel Pech.*