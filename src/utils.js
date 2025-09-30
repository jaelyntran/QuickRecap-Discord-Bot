import { SummarizerManager } from "node-summarizer";

export async function summarizeMessages(text) {
    if (!text || text.trim().length === 0) return "⚠️ No messages to summarize.";

    const summarizer = new SummarizerManager(text, 3);
    const summaryObj = summarizer.getSummaryByFrequency();
    return summaryObj.summary || "⚠️ Couldn't generate a summary.";
}

export async function handleCommand(channel, count) {
    const limit = Math.min(count, 300)
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
    const filteredMessages = allMessages
        .filter(message => !message.author.bot && message.content.trim().length > 0)
        .map(message => `${message.author.username}: ${message.content}`)

    const text = filteredMessages.reverse().join('\n');
    console.log(text);
    return summarizeMessages(text);
}