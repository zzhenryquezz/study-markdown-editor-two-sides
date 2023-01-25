import type { IRule, Token } from "../markdown";

export const breakLine: IRule = {
    markdown: {
        test: (markdown: string) => ['', '<br>', '<br/>', '\n', '\n\n'].includes(markdown),
        process: (token: Token) => {}
    },
    token: {
        test: (token) => token.type === 'break-line',
        toMarkdown: (token) =>  '',
        toHtml: (token) => `<br />`
    }
}

