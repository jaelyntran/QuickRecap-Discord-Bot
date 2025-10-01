import { SummarizerManager } from "node-summarizer";

function cleanContent(content) {
    return content
    .replace(/<a?:\w+:\d+>/g, '')
    .replace(/<@!?\d+>/g, '')
    .replace(/<#[0-9]+>/g, '')
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .replace(/https?:\/\/\S+/g, '')
    .trim()
    .replace(/^[:?]+\s*/, '')
    .replace(/\s*[:?]+$/, '');
}

function chunkMessages(messages, maxMessages = 20) {
    const chunks = [];
    for (let i = 0; i < messages.length; i += maxMessages) {
        const chunk = messages.slice(i, i + maxMessages);
        chunks.push(chunk.map(m => `${m.username}: ${m.content}`).join("\n"));
    }
    return chunks;
}

function summarizeMessages(text) {
    if (!text || text.trim().length === 0) return "⚠️ No messages to summarize.";

    const summarizer = new SummarizerManager(text, 3);
    const summaryObj = summarizer.getSummaryByFrequency();
    return summaryObj.summary || "⚠️ Couldn't generate a summary.";
}

export async function fetchMessages(channel, count) {
    const limit = Math.min(count, 200)
    let remaining = limit;
    let lastId;
    const allMessages = [];

    while (remaining > 0) {
        const fetchSize = Math.min(remaining, 100);
        const options = { limit: fetchSize };
        if (lastId) options.before = lastId;

        const batch = await channel.messages.fetch(options);
        if (batch.size === 0) break;

        allMessages.push(...batch.values());
        remaining -= batch.size;
        lastId = batch.last().id;
    }

    console.log(`Fetched a total of ${allMessages.length} messages`);
    const filteredAllMessages = allMessages
          .filter(m => !m.author.bot)
          .reverse();
    return filteredAllMessages;
}

export async function handleCommand(allMessages) {
    const filtered = allMessages
            .filter(m => m.content && m.content.trim().length > 0)
            .map(m => ({
              username: m.author.username,
              content: cleanContent(m.content),
            }))
            .filter(m => m.content.length > 0)
    console.log(filtered);

    if (filtered.length === 0) return "⚠️ No messages to summarize.";
    console.log(`After filtering, ${filtered.length} messages remain`);

    const chunks = chunkMessages(filtered);
    console.log("Chunks to summarize:");
    chunks.forEach((chunk, i) => console.log(`--- Chunk ${i + 1} ---\n${chunk}\n`));

    const chunkSummaries = [];
    for (const [index, chunk] of chunks.entries()) {
        const summary = summarizeMessages(chunk);
        const cleanedSummary = summary
            .split("\n")
            .filter(line => /^.+:\s.+$/.test(line))
            .join("\n");
        chunkSummaries.push(cleanedSummary);
        console.log(`--- Summary for chunk ${index + 1} ---\n${cleanedSummary}\n`);
    }

    return chunkSummaries;
}