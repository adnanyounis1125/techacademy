# Thal University Bhakkar - Website with AI Assistant

A responsive university website (home, about, 15 departments, fees, transport and van challan, admissions, campus life, contact) with a floating assistant that answers **only** Thal University questions in Urdu or English, by text or voice.

- Frontend: HTML5, CSS3, vanilla JavaScript, Tailwind CSS (CDN)
- Backend: Node.js + Express, used only as a secure proxy for Groq and ElevenLabs
- Assistant: Groq `openai/gpt-oss-120b` (chat) and `whisper-large-v3` (speech to text). Spoken replies use the browser's built-in speech synthesis by default and need no additional API key.

## Quick start (local)

Requires Node.js 18 or newer.

```bash
npm install
npm start
```

Open http://localhost:3000

The website works without any keys. The assistant needs the keys below.

## Add your API keys

All keys live in the `.env` file beside `server.js` (the `thal-university-bhakkar` project folder). The server also checks the parent folder's `.env` when you start it from there. Open the project `.env` and fill in the values after the `=` sign:

```
GROQ_API_KEY=your_groq_key_here
ELEVENLABS_API_KEY=your_elevenlabs_key_here
ELEVENLABS_VOICE_ID=your_voice_id_here
PORT=3000
```

- Groq key: create one at console.groq.com under API Keys, then set `GROQ_API_KEY`. This key is required for chat and speech to text; the assistant cannot work until it is set.
- Optional: ElevenLabs key and Voice ID enable server text-to-speech only on browsers without built-in speech synthesis. Spoken replies normally use the browser and do not need these settings.
- Restart `npm start` after editing `.env`.

If a key is missing the server prints a clear message at startup, and the chatbot shows a friendly error instead of crashing. `.env` is listed in `.gitignore`, so it will not be committed. `.env.example` shows the variable names without values.

If chat reports a Groq request limit, wait briefly and retry; repeated rate limits may mean the model's request/token limit has been reached. If it reports insufficient quota, check API usage and billing in the Groq console. For Vercel deployments, configure the key in Vercel Environment Variables and redeploy.

When the Groq account quota is exhausted, chat falls back to matching facts in `data/data.json`; answers are more limited than AI answers until Groq quota is available again. Ask "answer in Urdu" or "speak in Urdu" to get an Urdu text reply and Urdu speech. Spoken replies use the matching language voice available in the visitor's browser or operating system; available voices vary by device and language.

## Deploy on Vercel

1. Push the project to GitHub (the `.env` file is ignored automatically).
2. In Vercel choose **Add New, Project**, import the repository and keep the default settings (no build command).
3. Open **Settings, then Environment Variables** and add `GROQ_API_KEY`, `ELEVENLABS_API_KEY` and `ELEVENLABS_VOICE_ID` for Production (and Preview if you want).
4. Redeploy. The `public` folder is served as the website, and `/api/*` is handled by `api/index.js`, which reuses `server.js`.

Voice recordings up to about 4 MB work on Vercel (roughly one minute of speech).

## Where to edit data

Everything shown on the site, and everything the assistant knows, comes from **one file: `data/data.json`**. Edit it, save, and refresh (restart the server so the assistant picks up the changes).

| What | Where in `data.json` |
| --- | --- |
| Teachers, designations, qualifications, subjects | `departments[n].faculty` |
| Semester-wise fees (admission, tuition, total) | `departments[n].fees` (keep `total` = admission + tuition) |
| Programs, overview, activities of a department | `departments[n].programs`, `overview`, `activities` |
| Scholarships and installment policy | `scholarships`, `installments` |
| Van routes, pickup points, timings, fees | `transport.routes` |
| Challan bank details, due day, notes | `transport.bank`, `transport.dueDay`, `transport.notes` |
| Admission dates, eligibility, documents, FAQ | `admissions` |
| Hostel, library, societies, sports, exams, calendar, rules, downloads | `info` |
| Address, phone, email, social links, counters | `university` |
| News, events, testimonials, VC message | `news`, `events`, `testimonials`, `about.vc` |

**Important:** all names, fees, phone numbers, emails and bank details in `data.json` are sample data. Replace them with the university's real information before going live. Downloadable forms are in `public/downloads/` (replace the PDFs and keep the file names, or update `info.downloads`).

## How the assistant stays on topic

- `server.js` builds a system prompt that limits answers to Thal University topics, and injects the content of `data/data.json` as the only knowledge base.
- Out-of-scope questions get a short polite refusal in the user's language. Missing information gets "not available, please contact the office".
- The assistant replies in Urdu script when the user writes Urdu or Roman Urdu, and in English otherwise.
- Prompt-based limits are strong but not perfect. Test the bot with your own tricky questions before launch.

## Project structure

```
/public
  index.html            home
  /pages                about, departments, department, fees, transport, admissions, info, contact
  /css/styles.css       theme tokens (light/dark), components, chatbot
  /js/app.js            header, footer, theme toggle, page rendering from data
  /js/chatbot.js        floating assistant (text, mic, speaker)
  /images               logo
  /downloads            sample forms (PDF)
/api/index.js           Vercel entry (re-exports server.js)
/data/data.json         all content
/server.js              Express proxy: /api/chat, /api/stt, /api/tts, /api/data
/.env                   your keys (empty values, not committed)
/.env.example           variable names only
/.gitignore
/package.json
/vercel.json
```

## Security notes

- The browser only calls `/api/chat`, `/api/stt` and `/api/tts` on your own server. Keys are added on the server when it calls Groq and ElevenLabs.
- No key appears in any frontend file, in `server.js`, or in this README.
- Public AI endpoints can be abused by strangers and use up your quota. Before a public launch, consider adding rate limiting (for example `express-rate-limit`) in front of `/api/*`.

## Notes

- Photos are Unsplash links. If one fails to load, a green placeholder is shown instead.
- Tailwind is loaded from its CDN as requested; the site's look is mainly defined in `public/css/styles.css`, with Tailwind available for adding utility classes.
- The contact form opens the visitor's email app (no mail server needed).
- Microphone access needs `https://` or `localhost`. Vercel provides HTTPS automatically.
