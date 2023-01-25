import type { IRule, IToken, Token } from "../markdown";

interface Config {
    level: number;
    content: string;
}

export const heading: IRule<Config> = {
    markdown: {
        test: (markdown: string) => markdown.startsWith('#'),
        process: (token: Token) => {
            const length = token.raw.indexOf(' ');

            token.config = {
                level: length,
                content: token.raw.slice(length + 1).trim(),
            }            
        }
    },
    token: {
        test: (token) => token.type === 'heading',
        toMarkdown: (token) => {
            const level = token.config?.level || 1;
            const content = token.config?.content || '';

            return `${'#'.repeat(level)} ${content}`;
        },
        toHtml: (token) => {
            return `<v-heading token-id="${token.id}"></v-heading>`;
        }
    }
}

