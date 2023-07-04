import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';
import mediapipe_workaround from './mediapipe_workaround';

const config: UserConfig = {
	plugins: [
		mediapipe_workaround(),
		sveltekit(),
	]
};

export default config;
