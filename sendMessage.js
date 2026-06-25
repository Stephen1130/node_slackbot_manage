require("dotenv").config();
const { WebClient } = require("@slack/web-api");

const client = new WebClient(process.env.SLACK_BOT_TOKEN);

/**
 * Send a plain-text message to a Slack channel.
 *
 * @param {string} channel  Channel name (#general) or ID (C01234567)
 * @param {string} text     Message text to send
 * @returns {Promise<object>} Slack API response
 */
async function sendMessage(channel, text) {
  const response = await client.chat.postMessage({ channel, text });
  console.log(`Message sent successfully to ${channel} (ts: ${response.ts})`);
  return response;
}

/**
 * Send a rich message using Slack Block Kit.
 *
 * @param {string}   channel  Channel name or ID
 * @param {string}   text     Fallback text (shown in notifications)
 * @param {object[]} blocks   Block Kit blocks array
 * @returns {Promise<object>} Slack API response
 */
async function sendBlockMessage(channel, text, blocks) {
  const response = await client.chat.postMessage({ channel, text, blocks });
  console.log(`Block message sent successfully to ${channel} (ts: ${response.ts})`);
  return response;
}

// ---------------------------------------------------------------------------
// Demo – runs when this file is executed directly: node sendMessage.js
// ---------------------------------------------------------------------------
async function main() {
  const channel = process.env.SLACK_CHANNEL || "#general";

  // 1. Simple text message
  await sendMessage(channel, "Hello from Slack Bot! 👋");

  // 2. Rich Block Kit message
  await sendBlockMessage(
    channel,
    "Block Kit demo message",
    [
      {
        type: "header",
        text: { type: "plain_text", text: "Slack Bot Notification", emoji: true },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "*Status:* ✅ Everything is running smoothly.\nThis is a *Block Kit* message example.",
        },
      },
      { type: "divider" },
      {
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: `Sent at <!date^${Math.floor(Date.now() / 1000)}^{date_short_pretty} {time}|${new Date().toISOString()}>`,
          },
        ],
      },
    ]
  );
}

main().catch((err) => {
  console.error("Error sending message:", err.message);
  process.exit(1);
});

module.exports = { sendMessage, sendBlockMessage };
