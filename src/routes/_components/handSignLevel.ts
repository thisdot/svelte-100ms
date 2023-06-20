import { hmsStore } from '../hms';
import { selectVideoTrackByPeerID } from '@100mslive/hms-video-store';
import { isTalking } from '../hmsStores';

/**
 * show audio level by creating a box shadow around the peer element when the person speaks
 * @return the unsubscribe function to run on unmount
 */
export function addHandSignBorder(peerId: string, element: HTMLElement) {
	return hmsStore.subscribe((level) => {
		if (!element) {
			return;
		}

		if (level && peerId) {
			isTalking.set(peerId);
		}

		const tile = element.parentNode as any;

		const color = '#f44336';
		if(tile) {
			tile.style.transition = 'box-shadow 0.3s ease-in-out';
			tile.style.boxShadow = level ? `0px 0px ${24}px ${color}, 0px 0px ${16}px ${color}` : '';
		}
	}, selectVideoTrackByPeerID(peerId));
}
