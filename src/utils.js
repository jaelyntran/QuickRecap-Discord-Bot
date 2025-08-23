import { SummarizerManager } from "node-summarizer";

export async function summarizeMessages(text) {
    if (!text || text.trim().length === 0) return "⚠️ No messages to summarize.";

    const summarizer = new SummarizerManager(text, 3);
    const summaryObj = summarizer.getSummaryByFrequency();
    return summaryObj.summary || "⚠️ Couldn't generate a summary.";
}

export async function handleCommand(channel, count) {
    const fetched = await channel.messages.fetch({ limit: count });
    const messages = Array.from(fetched.values());

    const filteredMessages = messages
        .filter(message => !message.author.bot && message.content.trim().length > 0)
        .map(message => message.content)

    const text = filteredMessages.join('\n');
    return summarizeMessages(text);
}