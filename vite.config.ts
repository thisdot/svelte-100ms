import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';
import { searchForWorkspaceRoot } from 'vite'

const config: UserConfig = {
	plugins: [sveltekit()]
	,server: {
		fs: {
			allow: [ searchForWorkspaceRoot(process.cwd()) + "/static"]
		}
	}
};

export default config;
