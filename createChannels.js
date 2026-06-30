require("dotenv").config();
const { WebClient } = require("@slack/web-api");
const fs = require("fs");
const path = require("path");

const client = new WebClient(process.env.SLACK_BOT_TOKEN);

/**
 * Create a single Slack channel and set its description (topic).
 *
 * @param {string} channel_name  Channel name (lowercase, no spaces)
 * @param {string} purpose       Purpose of the channel
 * @param {string} who_posts     Who is expected to post in the channel
 * @returns {Promise<{name: string, id: string, description: string}>}
 */
async function createChannel(channel_name, purpose, who_posts) {
  const name = channel_name.toLowerCase().replace(/\s+/g, "-");
  const description = `Purpose: ${purpose}\n\nWho Posts: ${who_posts}`;

  // Create the channel
  const createRes = await client.conversations.create({ name, is_private: false });
  const channelId = createRes.channel.id;

  // Set the topic (visible description inside the channel header)
  // await client.conversations.setTopic({
  //   channel: channelId,
  //   topic: description,
  // });

  // Set the purpose (shown in channel details / Browse channels)
  await client.conversations.setPurpose({
    channel: channelId,
    purpose: description,
  });

  return { name, id: channelId, description };
}

async function main() {
  const channelsFile = path.join(__dirname, "channels.json");
  const channels = JSON.parse(fs.readFileSync(channelsFile, "utf-8"));

  console.log(`Creating ${channels.length} channel(s)...\n`);

  const results = [];

  for (const entry of channels) {
    const { channel_name, purpose, who_posts } = entry;
    try {
      const result = await createChannel(channel_name, purpose, who_posts);
      console.log(`✅ Created: #${result.name}`);
      console.log(`   ID         : ${result.id}`);
      console.log(`   Description: ${result.description.replace(/\n/g, " | ")}\n`);
      results.push({ ...result, status: "created" });
    } catch (err) {
      const isDuplicate = err.data?.error === "name_taken";
      if (isDuplicate) {
        console.warn(`⚠️  Skipped: #${channel_name} already exists.\n`);
        results.push({ name: channel_name, id: null, status: "already_exists" });
      } else {
        console.error(`❌ Failed: #${channel_name} — ${err.message}\n`);
        results.push({ name: channel_name, id: null, status: "error", error: err.message });
      }
    }
  }

  console.log("=== Summary ===");
  for (const r of results) {
    const id = r.id ? `ID: ${r.id}` : "no ID";
    console.log(`  #${r.name.padEnd(30)} ${id}  [${r.status}]`);
  }
}

main().catch((err) => {
  console.error("Fatal error:", err.message);
  process.exit(1);
});
