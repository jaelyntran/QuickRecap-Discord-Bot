export async function summarizeMessages(text) {

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