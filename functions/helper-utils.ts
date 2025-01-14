export const generateKeywords = (title: string, author: string): string[] => {
    const combinedKeywords: Set<string> = new Set();
    const titleWords: string[] = title.toLowerCase().split(" ");
    const authorWords: string[] = author.toLowerCase().split(" ");

    // Generate substrings from all consecutive words in title + author
    [...titleWords, ...authorWords].forEach((_, i, words) => {
        let keyword = "";
        for (let j = i; j < words.length; j++) {
            keyword = `${keyword} ${words[j]}`.trim();
            combinedKeywords.add(keyword);
        }
    });

    // Generate cross-combinations of title words with author words
    titleWords.forEach((titleWord: string) => {
        authorWords.forEach((_, j: number) => {
            combinedKeywords.add(`${titleWord} ${authorWords[j]}`);
            combinedKeywords.add(`${titleWord} ${authorWords.slice(j).join(" ")}`);
        });
    });

    return Array.from(combinedKeywords);
};
