# Slack Bot – Send Message

Send plain-text and Block Kit messages to Slack channels using the official [@slack/web-api](https://www.npmjs.com/package/@slack/web-api) SDK.

---

## Setup

### 1. Create a Slack App

1. Go to [https://api.slack.com/apps](https://api.slack.com/apps) and click **Create New App → From scratch**.
2. Give it a name and pick your workspace.
3. Navigate to **OAuth & Permissions** and add these **Bot Token Scopes**:
   - `chat:write` – send messages as the bot
   - `chat:write.public` – send to public channels without joining (optional)
4. Click **Install to Workspace** and copy the **Bot User OAuth Token** (starts with `xoxb-`).
5. Invite the bot to the channel: `/invite @YourBotName`

### 2. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` and fill in your values:

```
SLACK_BOT_TOKEN=xoxb-your-bot-token-here
SLACK_CHANNEL=#general
```

### 3. Install dependencies

```bash
npm install
```

---

## Usage

### Run the demo

```bash
node sendMessage.js
```

This sends a plain-text message and a Block Kit message to `SLACK_CHANNEL`.

### Use the helpers in your own code

```js
const { sendMessage, sendBlockMessage } = require("./sendMessage");

// Plain text
await sendMessage("#alerts", "Deployment finished successfully!");

// Block Kit
await sendBlockMessage("#alerts", "Fallback text", [
  {
    type: "section",
    text: { type: "mrkdwn", text: "*Hello* from Block Kit!" },
  },
]);
```

---

## Project structure

```
slack bot/
├── sendMessage.js   # Core send helpers + runnable demo
├── .env             # Your credentials (git-ignored)
├── .env.example     # Template for credentials
├── .gitignore
└── package.json
```
