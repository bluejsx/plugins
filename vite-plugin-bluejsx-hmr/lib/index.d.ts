import { PluginOption } from 'vite';

declare const transform: (code: string, path: string) => string;
declare function HMRLoader({ enabled }?: {
    enabled: boolean;
}): PluginOption;

export { HMRLoader as default, transform };
