import MarkdownIt from 'markdown-it';

/**
 * @returns {import('vite').PluginOption}
 */
declare function mdxToJS(options?: MarkdownIt.Options): {
    name: string;
    configResolved(resolvedConfig: any): void;
    transform(code: any, id: any): any;
};

export { mdxToJS as default };
