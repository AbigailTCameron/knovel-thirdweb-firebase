export const generateKeywords = (title: string, author: string): string[] => {
    const combinedKeywords = new Set<string>();
    const words = [...title.toLowerCase().split(" "), ...author.toLowerCase().split(" ")];

    for (let i = 0; i < words.length; i++) {
        let keyword = "";
        for (let j = i; j < words.length; j++) {
            keyword = `${keyword} ${words[j]}`.trim(); // Build substrings and trim any extra spaces
            combinedKeywords.add(keyword);
        }
    }

    return Array.from(combinedKeywords);
};
