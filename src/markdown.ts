import uniqueId from 'lodash/uniqueId';
import { heading } from './rules/heading';
import { text } from './rules/text';
import { breakLine } from './rules/break-line';

export interface IToken<T = Record<string, any>> {
    id: string;
    type: string;
    raw: string;
    config?: T;
}

export class Token<T = Record<string, any>> {
    public id: string;
    public type = 'unknown';
    public raw = '';
    public config: T = {} as T;

    constructor(id: string){
        this.id = id;
    }
}

export interface IRuleMarkdown {
    test: (markdown: string) => boolean;
    process: (token: Token) => void;
}

export interface IRuleToken<T> {
    test: (token: IToken<T>) => boolean;
    toMarkdown: (token: IToken<T>) => string;
    toHtml: (token: IToken<T>) => string;
}

export interface IRule<T = Record<string, any>> {
    markdown: IRuleMarkdown;
    token: IRuleToken<T>;
}

export function createMarkdownLib() {
    return new MarkdownLib();
}

export default class MarkdownLib {
    public rules = new Map<string, IRule<any>>([
        ['heading', heading],
        ['break-line', breakLine],
        ['text', text]
    ]);

    public markdownToTokens(markdown: string): Token[] {

        const counters = new Map<string, number>();

        const rules = Array.from(this.rules.entries())

        const tokens: Token[] = [];

        const lines = markdown.split('\n');

        for (const line of lines) {


            const search = rules.find(([key, rule]) => rule.markdown.test(line));

            if (!search) continue;

            const [key, rule] = search;

            const id = key + '-' + (counters.get(key) || 0);

            const token = new Token(id);

            token.type = key;
            token.raw = line;

            rule.markdown.process(token)
            
            tokens.push(token);

            counters.set(key, (counters.get(key) || 0) + 1);
        }

        return tokens;
    }

    public tokensToMarkdown(tokens: IToken[]): string {
        let markdown = '';

        for (const token of tokens) {
            const rule = Array.from(this.rules.values()).find(rule => rule.token.test(token));

            if (rule) {
                markdown += rule.token.toMarkdown(token) + '\n';
            }

        }

        markdown = markdown.trim();

        markdown += '\n';
        
        return markdown;
    }

    public tokensToHtml(tokens: IToken[]): string {
        return tokens.map(token => {

            const rule = Array.from(this.rules.values()).find(rule => rule.token.test(token));

            if (rule) {
                return rule.token.toHtml(token);
            }

            return token.raw;
        })
        .join('');
    }

    public markdownToHtml(markdown: string): string {
        const tokens = this.markdownToTokens(markdown);

        return this.tokensToHtml(tokens);
    }
}