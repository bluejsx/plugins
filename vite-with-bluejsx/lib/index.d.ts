import { UserConfig } from 'vite';

declare function withBlueJSX(config: UserConfig & {
    bluejsx?: {
        hmr?: boolean;
    };
}): UserConfig;

export { withBlueJSX as default };
