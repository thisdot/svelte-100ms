<script lang="ts">
	import { hmsPeers, isTalking } from '../hmsStores';
	import Peer from '../Peer.svelte';
	import { onMount } from 'svelte';
	import { findBestFitLayout } from './bestFit';

	import {MinimizeIcon} from 'svelte-feather-icons';

	let galleryContainer: HTMLDivElement;

	// The current position of mouse
	let x = 0;
	let y = 0;

	// The dimension of the element
	let w = 0;
	let h = 0;

	let target: HTMLDivElement;

	const arrangeTiles = (parent, peers) => {
		if (!galleryContainer) {
			return;
		}
		const containerWidth = parent.getBoundingClientRect().width;
		const containerHeight = parent.getBoundingClientRect().height;
		const numTiles = peers.length;
		let result = findBestFitLayout({ containerHeight, containerWidth, numTiles });
		galleryContainer.style.setProperty('--width', `${result.width}px`);
		galleryContainer.style.setProperty('--height', `${result.height}px`);
		galleryContainer.style.setProperty('--cols', `${result.cols}`);
	};

	const mouseMoveHandler = function (e) {
		// How far the mouse has been moved
		const dx = e.clientX - x;
		const dy = e.clientY - y;

		// Adjust the dimension of element
		target.style.width = `${w + dx}px`;
		target.style.height = `${h + dy}px`;
	};

	const mouseUpHandler = function () {
    // Remove the handlers of `mousemove` and `mouseup`
    document.removeEventListener('mousemove', mouseMoveHandler);
    document.removeEventListener('mouseup', mouseUpHandler);
};

	const mouseDownHandler = function (e: any) {
		// Get the current mouse position
		target = e.currentTarget.parentNode;
		x = e.clientX;
		y = e.clientY;

		// Calculate the dimension of element
		const styles = window.getComputedStyle(target);
		w = parseInt(styles.width, 10);
		h = parseInt(styles.height, 10);

		// // Attach the listeners to `document`
		if(target) {
			document.addEventListener('mousemove', mouseMoveHandler);
			document.addEventListener('mouseup', mouseUpHandler);

		}
	};

	onMount(() => {
		const resizeObserver = new ResizeObserver(() => arrangeTiles(galleryContainer, $hmsPeers));
		resizeObserver.observe(galleryContainer);
		return () => resizeObserver.unobserve(galleryContainer);
	});

	$: arrangeTiles(galleryContainer, $hmsPeers);
	$: justify_content_start = $hmsPeers.length > 1 ? 'justify_start' : '';
</script>

<div class="gallery-container" bind:this={galleryContainer}>
	<div class="gallery {justify_content_start}">
		{#each $hmsPeers as peer (peer.id)}
			<div class="tile {$isTalking === peer.id ? 'first' : ''}">
				<Peer {peer} />
				<div class="resizer" title="resize" on:mousedown={mouseDownHandler}><MinimizeIcon /></div>
			</div>
		{/each}
	</div>
</div>

<style>
	.gallery-container {
		display: flex;
		justify-content: center;
		height: 100%;
		width: 100%;
	}

	.gallery {
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
		max-width: calc(var(--width) * var(--cols));
	}

	.gallery.justify_start {
		justify-content: flex-start;
	}

	.tile {
		width: var(--width);
		min-width: 250px;
		height: var(--height);
		min-height: 250px;
		padding: 5px;
		overflow: hidden;
		display: flex;
		justify-content: center;
		align-items: center;
		position: relative;
		order: 99999;
	}
	.tile.first {
		order: 0;
	}

	.tile > .resizer {
		position: absolute;
		bottom: 0px;
		right: 0px;
		z-index: 1000;
		width: 2rem;
		height: 2rem;
		border-radius: 6rem;
		background-color: #0f0f0fbc;
		cursor: nwse-resize;
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
