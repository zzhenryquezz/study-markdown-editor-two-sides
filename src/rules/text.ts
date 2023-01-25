import type { IRule, Token } from "../markdown";

export const text: IRule = {
    markdown: {
        test: () => true,
        process: (token: Token) => {}
    },
    token: {
        test: (token) => token.type === 'text',
        toMarkdown: (token) =>  token.raw,
        toHtml: (token) => `<p> ${token.raw} </p>`
    }
}

