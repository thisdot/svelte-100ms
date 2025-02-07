
This branch builds upon the [main](https://github.com/100mslive/svelte-100ms) branch where we go through steps to set up a simple Video Call App in Svelte. Now that we have built the app, we'll go through adding different important features in the app.

Feel free to reach out to us over [Discord](https://100ms.live/discord) for any queries.

## Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2F100mslive%2Fsvelte-100ms&project-name=svelte-100ms-video-call&repo-name=svelte-100ms-video-call&demo-title=Svelte%20%2B%20100ms&demo-description=A%20video%20call%20app%20built%20with%20SvelteKit%20and%20100ms&demo-url=https%3A%2F%2Fsvelte-100ms.vercel.app%2F&demo-image=https%3A%2F%2Fraw.githubusercontent.com%2F100mslive%2Fsvelte-100ms%2Fmain%2Fstatic%2Fconference.png)

Use the above button to create a clone of this app in your GitHub and deploy on Vercel. You can then commit any changes in your personal repo and see them reflected in the deployment. 


[![Open in CodeSandbox](https://img.shields.io/badge/Open%20in-CodeSandbox-blue?style=flat-square&logo=codesandbox)](https://codesandbox.io/s/github/100mslive/svelte-100ms?file=/src/routes/%2Bpage.svelte)

You can also try out the code with live demo on CodeSandbox by going to the above link. If CodeSandbox shows an error, reload its demo url.

## Demo

[Demo Link](https://svelte-100ms.vercel.app/)

Steps at - https://github.com/100mslive/svelte-100ms#demo

Feel free to reach out to us over [Discord](https://100ms.live/discord).

## Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2F100mslive%2Fsvelte-100ms%2Ftree%2Ffeatures&project-name=svelte-100ms-video-call&repo-name=svelte-100ms-video-call&demo-title=Svelte%20%2B%20100ms&demo-description=A%20video%20call%20app%20built%20with%20SvelteKit%20and%20100ms&demo-url=https%3A%2F%2Fsvelte-100ms.vercel.app%2F&demo-image=https%3A%2F%2Fraw.githubusercontent.com%2F100mslive%2Fsvelte-100ms%2Fmain%2Fstatic%2Fconference.png)

Use the above Deploy button to create a clone of this branch in your GitHub and deploy on Vercel. You can then commit any changes in your personal repo and see them reflected in the deployment. 


[![Open in CodeSandbox](https://img.shields.io/badge/Open%20in-CodeSandbox-blue?style=flat-square&logo=codesandbox)](https://codesandbox.io/s/github/100mslive/svelte-100ms/tree/features?file=/src/routes/%2Bpage.svelte)

You can also try out the code with live demo on CodeSandbox by going to the above link. If CodeSandbox shows an error, reload its demo url.

# Features

These are present in the order they were added in the repo to follow through easily. Note that sometimes minor bugs in a feature are fixed in subsequent commits, so in case you're picking up from any single component, do check out the latest state of the corresponding file in the branch.

## 1. Device Settings([Commit1](https://github.com/100mslive/svelte-100ms/commit/936ff04f6a4631b981f802211bf53ff314695c44), [Commit2](https://github.com/100mslive/svelte-100ms/commit/183b24b820c70f3987c28581104ed516b3ca7fcc))

Giving user the ability to change between audio and video devices is a must for any Video Call Application. The relevant SDK's selectors and methods are documented [here](https://www.100ms.live/docs/javascript/v2/features/device-change).

![Device Settings](static/deviceSettings.png)

Changes done - 
- Create two new svelte stores in hmsStore.ts - `hmsAllDevices` for list of all devices and `hmsSelectedDevices` for the selected devices
- Install svelte-simple-modal as dev dependency(`yarn add svelte-simple-modal --dev`) for rendering device selection in a modal
- Create a [`DeviceSettings.svelte`](./src/routes/DeviceSettings.svelte) component which is responsible for showing the devices in select dropdowns and handle change
- Create a new button in Footer which can be clicked to open the Device Settings modal
- Add some css to Device Settings to make it look consistent

## 2. Avatar when video is muted or degraded([Commit1](https://github.com/100mslive/svelte-100ms/commit/f799bbb86f763297cf0ac424566f0289b1f8237a), [Commit2](https://github.com/100mslive/svelte-100ms/commit/b9dc19904be80530b1fec95995c990a68dcea17d))

Right now when the video is muted, we're showing blank page, let's change this to show a nice looking Avatar based on name.

> Note that we'll also show this avatar when the video is [degraded](https://www.100ms.live/docs/javascript/v2/features/sub-degradation) as the video would appear to freeze otherwise. The 100ms SDK degrades a remote track when the local bandwidth is not enough to download the video.

![Avatars](static/avatars.png)

Changes done -
- Create a `_components` folder in routes, to store components. The folder is prefixed with `_` so it's not counted in routes.
- Create an [`Avatar.svelte`](./src/routes/_components/Avatar.svelte) component. It takes name as an input, picks a color based on first letter and shows the initials of the name over the chosen color.
- Remove margin from the Video component and make it take full width/height of parent. This is to give the control to Peer component.
- Get the video track using hmsStore in a local variable. Put a condition to show Avatar when the video is disabled or degraded. Add fancy css to make it all look good, all thanks to flex and `position:absolute`.

> An important point to note here is that Video component should always be part of the dom. That is a code like this - `if (condition) {Avatar} else {Video}` is not correct(though it will work). Avatar needs to be present as an overlay on top of the Video component, than there being a conditional render between Avatar and Video. This is to avoid video element being frequently recreated as well as for the sdk to be aware of the UI's intention to show video in case of degradation.


## 3. Audio Level([Commit](https://github.com/100mslive/svelte-100ms/commit/d669a10532a5c13d27a4b6160494337067ab1819))

It's helpful to show the audio level in a video call to know who is speaking at the moment. Let's implement this following the docs [here](https://www.100ms.live/docs/javascript/v2/advanced-features/audio-level). The way we'll show it is by creating a box-shadow around the video element of the peer who is speaking.

![Audio Level](static/audioLevel.png)

Changes done - 
- Add logic in `Video.svelte` to monitor audio level for the peer and add border appropriately.
- Note that a later refactor separates the core logic out in a different audioLevel.ts file and moves applying audio border to `Peer.svelte` component. [Commit](https://github.com/100mslive/svelte-100ms/commit/df8902bb96f041c0b02ca9a8f83c653a0fc0983c).


## 4. Join Improvement - Remember name and token, also take from query param([Commit](https://github.com/100mslive/svelte-100ms/commit/15010972fbd07e126fccbf33232fc0a3d8555780))

- Remember name and token by saving them to local storage so the user doesn't have to enter them every time.
- Add two query params, name and token so a shareable link can be made with token already embedded in. An url can be made in this form now - `baseUrl?token=<auth_token>`, to have the token prefilled.
- Change the button text from "Join" to "Joining..." when join is in progress.

## 5. Add Share/Copy link button([Commit](https://github.com/100mslive/svelte-100ms/commit/1accff7dda439b2fc3e810c017f83c522baa7889))

The purpose of share link button is to get a sharable link(copied to clipboard) which can be sent to others for joining the same call.

![Share Button](static/shareButton.png)

- Install feather icons - `yarn add --dev svelte-feather-icons`
- Create a writable tokenStore to hold the auth token which will be used to create the sharable url. This is created in `hmsStores.ts`.
- Create a new [`ShareLink`](./src/routes/_components/ShareLink.svelte) component to copy the url and put it in Header component

## 6. Use Icons in Footer([Commit](https://github.com/100mslive/svelte-100ms/commit/e9b165accc58b04d3a1ef4397a82dc9ac3445a1c))

![Footer Icons](static/footerIcons.png)

- Use Feather icons for audio, video and device settings

## 7. Network Quality([Commit](https://github.com/100mslive/svelte-100ms/commit/6796c79e61d7fe14c4689790337c00b69cb61209))

Ever had those "I wonder whose internet is bad" moment in a Video call. The SDK gives the connection score of everyone in the room for times like these, as documented [here](https://www.100ms.live/docs/javascript/v2/advanced-features/connection-quality). Let's build it out in the UI.

![Network Quality](static/networkQuality.png)

- Create a new [`ConnectionQuality.svelte`](./src/routes/_components/ConnectionQuality.svelte) component which takes in a peer id and renders the network quality score for the peer in form of Wi-Fi signal. It does by using SVG images, there is one svg image for when connection score is 0(disconnected), and a set of arcs resembling the Wi-Fi signal colored per the score for connection score > 0. 
- Add the new component in `Peer.svelte` to show on the tile on bottom left.

> To know more about what different connection scores represent check out the [SDK docs](https://www.100ms.live/docs/javascript/v2/advanced-features/connection-quality#score-interpretation)

## 8. Notifications([Commit](https://github.com/100mslive/svelte-100ms/commit/6deb8ef704e61ec52870da1a9122dbdbe1c2f456))

Notifications can be used to show toast messages for events happening in the room, like a peer joining, receiving a message, device change, errors, reconnections, disconnections etc.

Examples - 

![Peer Join](static/toastPeerJoin.png)
![Permissions Error](static/toastPermissions.png)
![Disconnected](static/toastConnectionLost.png)
![Reconnecting](static/toastReconnecting.png)
![Reconnected](static/toastReconnected.png)

- Install a toast library - `yarn add @zerodevx/svelte-toast --dev`
- Write a wrapper over the toast library in [`toasts.ts`](./src/routes/_components/toasts.ts), styles added globally in `styles.css`
- Create a new component - `Notifications.svelte` responsible for displaying toasts, rendering the SvelteToast component
- Render Notifications component first thing in the page component
- Listen to the notifications from SDK using `hmsNotifications` and show appropriate toasts per the documentation [here](https://www.100ms.live/docs/javascript/v2/features/notifications) and [here](https://www.100ms.live/docs/javascript/v2/features/error-handling).
- For reconnection notification, we'll also build a special type of toast which can be updated in place. So the reconnecting notification itself is changed to connected once reconnection is successful.
- Also remove any existing toasts whenever join button is clicked in `JoinForm.svelte`.

> The device permissions error is the most common errors seen in production use. It can be very useful to tell user more about giving device permissions in case of such errors.


## 9. Autoplay Error([Commit](https://github.com/100mslive/svelte-100ms/commit/1a4fd94a36b30ab39abddb76a15c2a5141bc0a61))

Most browsers have a restriction on audio autoplay where audio is allowed only if the user has interacted with the page. This is very important error to handle as when this happens you user won't be able to hear others in the room. [SDK Docs](https://www.100ms.live/docs/javascript/v2/features/error-handling#handling-autoplay-error).

![Autoplay Error](static/autoplayError.png)

- Create an [`AutoPlayError.svelte`](./src/routes/_components/AutoPlayError.svelte) component responsible for letting the user know about the issue and giving an actionable button to resume audio which will call the SDK function.
- Add an else if block in the Notifications component for autoplay error(code = 3008) and open the AutoPlayError component in a modal when it happens.


## 10. Muted State on Peer Tile([Commit](https://github.com/100mslive/svelte-100ms/commit/1f35bfde4667f2483226308a03e35bd50e01baf4))s

Let's display the audio mute state on the peer tile. [SDK Docs](https://www.100ms.live/docs/javascript/v2/guides/useful-selectors#how-do-i-know-the-status-of-remote-mic-video-status).

![Remote Muted State](static/remoteMuteState.png)

- Show either of Mic or MicOff icon based on audio state in Peer component.


## 11. Chat Messages([Commit](https://github.com/100mslive/svelte-100ms/commit/de186ef6c517d95334031e18b2d02cc45683f8fb))

A video call app isn't complete without the ability to send messages in the room. Let's build the chat component with the help of the API documented in [SDK Docs](https://www.100ms.live/docs/javascript/v2/features/chat).

![Chat](static/chat.png)

- Create two new stores in hmsStores, one which has all the messages and a new writable store to store whether chat is currently open.
- Create a [`Chat.svelte`](./src/routes/_components/Chat.svelte) component. This displays all the chat messages and has an input box to send message which will be broadcasted to everyone else in the room. Building this component out is the most difficult part of this task. Too much fancy CSS to get things working. Couldn't find a composable Svelte or Vanilla JS Chat UI component library. Another cool thing added to the chat component is to auto scroll when new messages come.
- Add a button in Footer to toggle chat and show the chat component when it's toggled to true.
- Also change the footer buttons to square instead of circle, square looks better.
- Send a toast when new message is received([Commit](https://github.com/100mslive/svelte-100ms/commit/0176eabbb7cb2c9e09f61bb84db6ab361b107362))

## 12. Refactoring([Commit1](https://github.com/100mslive/svelte-100ms/commit/df8902bb96f041c0b02ca9a8f83c653a0fc0983c), [Commit2](https://github.com/100mslive/svelte-100ms/commit/4814d271016d1544ff1528db92396b4780212244))

- Before we move on to the next Gallery and ScreenShare component, we'll refactor the current code so the Video Component can be used by Screenshare as well. For this, audio border is separated out and shown directly at Peer level. And video component is changed to take in track id instead of peer id.
- Also, a bunch of cosmetic changes, details in the [commit](https://github.com/100mslive/svelte-100ms/commit/4814d271016d1544ff1528db92396b4780212244).

## 13. Gallery Layout([Commit](https://github.com/100mslive/svelte-100ms/commit/dcffd51fc13f37b1f3e2d9c5c9f3df381bd27fef))

The current way of iterating over peers and rendering them using css grid view is suboptimal and leads to a lot of space unused. For e.g. for 2 person call the two tiles can each take approx half of the screen instead of the smaller tiles like currently. It also looks pretty bad when rendering on mobile devices. Formally the problem is this -
> Given `n` number of square tiles, find the best fit for packing those tiles in a parent container of height `h` and width `w`. The result should tell the final dimensions of the tiles, number of rows, and tiles to have per row.
> 
> A generalised framing of above would have rectangle tiles with some aspect ratio `a` with square tiles being a special case when a = 1.

![Gallery View](static/gallery.gif)

Changes -

- The main page layout(in `+page.svelte`) is changes to use flex view for arranging header, footer and conference. Footer's fixed position is removed. Header is wrapped for small screens. There is a good introduction to Flexbox [here](https://css-tricks.com/snippets/css/a-guide-to-flexbox/) if you wanna read about flex.
- A [`bestFit.ts`](./src/routes/_components/bestFit.ts) file is written with some help from [this answer](https://math.stackexchange.com/a/2570649) and the code [here](https://github.com/fzembow/rect-scaler/blob/master/src/index.ts). It exposes a function which can figure out the optimal layout.
- A [`GalleryView.svelte`](./src/routes/_components/GalleryView.svelte) component is put to get the list of all peers and display them in a gallery view. It uses the bestFit function exposed above to figure out the layout. The layout is recalculated if number of peers change or the dimensions of the gallery container change(figured out using [ResizeObserver](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver) API). CSS variables are used to pass down the changes to css styles.
- A bunch of `height: 100%` at different places to force using the full `100vh` height coming from body.

## 14. Screenshare([Commit](https://github.com/100mslive/svelte-100ms/commit/2e5e198a13ee070fcc2d489956beb731898fd87f))

By this point we've pretty much covered all essential features of a Video calling app except one, Screen sharing. Let's now add Screen sharing to our app. [SDK Docs](https://www.100ms.live/docs/javascript/v2/features/screen-share).

![Screenshare](static/screenshare.png)

**But is it responsive?** - Yes!

![Responsive Screenshare](static/screenshare.gif)

Changes

- We add new stores in hmsStores to keep track of screenshare related state.
- A screenshare svg icon is added as [`ShareScreenIcon.svelte`](./src/routes/_icons/ShareScreenIcon.svelte).
- A button is added in `Footer.svelte` component to toggle screenshare.
- If screenshare button is clicked but then cancel is pressed, the corresponding error notification is ignored in `Notifications.svelte`. There is not much point in showing it.
- A [`ScreenShare.svelte`](./src/routes/_components/ScreenShare.svelte) component to render the screenshare using the earlier created Video component.
- For showing the screenshare in UI, we'll show it in center, and the gallery view will show on right on big devices and on bottom on small ones. Changes are in `Conference` component.
- Video component is also modified to support taking in objectFit param, which we'll set to contain for screenshare, so the video is not cropped and shrunk to fit into the container. 
