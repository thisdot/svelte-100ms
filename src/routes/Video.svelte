<script>
	import { hmsActions, hmsStore } from './hms';
	import { onMount } from 'svelte';
	import { onDestroy } from 'svelte';
	import { selectVideoTrackByID } from '@100mslive/hms-video-store';
	import * as handPoseDetection from '@tensorflow-models/hand-pose-detection';
	import { addHandSignBorder } from './_components/handSignLevel';
	// @ts-ignore
	import * as fp from 'fingerpose';
	import Handsigns from './_components/handsigns';

	const createDetectionInstance = async () => {
		const model = handPoseDetection.SupportedModels.MediaPipeHands;
		const detectorConfig = {
			runtime: 'mediapipe',
			modelType: 'lite',
			solutionPath: `https://cdn.jsdelivr.net/npm/@mediapipe/hands/`
		};
		return await handPoseDetection.createDetector(model, detectorConfig);
	};
	export let mirror;
	export let trackId;
	export let peerId;
	export let peerContainer;
	export let objectFit = 'cover';
  

	let unsub;
	let videoElement; // this will be populated on mount
	let detector;
  	let sign;

	onMount(async () => {
		detector = await createDetectionInstance();
		console.log( detector );
	});

	function manageVideo(trackId, videoElement) {
		if (unsub) unsub(); // unsubscribe previous

		if (!trackId || !videoElement) return;

		unsub = hmsStore.subscribe((track) => {
			if (!track) {
				return;
			}
			if (track?.enabled) {
				hmsActions.attachVideo(track.id, videoElement);
				setInterval(async () => {
					if ( !detector ) {
						detector = await createDetectionInstance();
					}
					const hands = await detector.estimateHands(videoElement);

					addHandSignBorder(hands.length ? peerId : '', peerContainer);
					if (hands.length > 0) {
						const GE = new fp.GestureEstimator([
							fp.Gestures.ThumbsUpGesture,
							Handsigns.aSign,
							Handsigns.bSign,
							Handsigns.cSign,
							Handsigns.dSign,
							Handsigns.eSign,
							Handsigns.fSign,
							Handsigns.gSign,
							Handsigns.hSign,
							Handsigns.iSign,
							Handsigns.jSign,
							Handsigns.kSign,
							Handsigns.lSign,
							Handsigns.mSign,
							Handsigns.nSign,
							Handsigns.oSign,
							Handsigns.pSign,
							Handsigns.qSign,
							Handsigns.rSign,
							Handsigns.sSign,
							Handsigns.tSign,
							Handsigns.uSign,
							Handsigns.vSign,
							Handsigns.wSign,
							Handsigns.xSign,
							Handsigns.ySign,
							Handsigns.zSign
						]);

            const landmark = hands[0].keypoints3D.map((value) => [value.x,value.y,value.z])
						const estimatedGestures = await GE.estimate(landmark, 6.5);

            if(estimatedGestures.gestures && estimatedGestures.gestures.length > 0) {
              const confidence = estimatedGestures.gestures.map(p => p.score)
              const maxConfidence = confidence.indexOf(
                Math.max.apply(undefined, confidence)
              )

              if (estimatedGestures.gestures[maxConfidence].name !== "thumbs_up") {
                sign = estimatedGestures.gestures[maxConfidence].name;
              } else {
                sign = null;
              }
            }
					}
					// console.log(hands);
				}, 2000);
			} else {
				hmsActions.detachVideo(track.id, videoElement);
			}
		}, selectVideoTrackByID(trackId));
	}

	// reactive expression, call the function everytime track or video element changes
	$: manageVideo(trackId, videoElement);

	onDestroy(() => unsub?.());
</script>

  <video
    class="peer-video"
    style="--objectFit: {objectFit}"
    class:mirror
    bind:this={videoElement}
    autoPlay
    muted
    playsInline
  />
  {#if sign}
  <div class="alphabet">{sign}</div>
  {/if}

<style>
	.peer-video {
		height: 100%;
		width: 100%;
		border-radius: 0.25rem;
		object-fit: var(--objectFit);
	}

  .alphabet {
    position: absolute;
    bottom: 4rem;
    left: 45%;
    right: 45%;
    font-size: 6rem;
    font-weight: bold;
    color: rgb(241, 41, 41);
  }

	/*mirror the video for local peer*/
	.peer-video.mirror {
		transform: scaleX(-1);
	}
</style>
