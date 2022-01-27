// This supplies XR support (using F2 to trigger)
// Derived from some three helper functions via Organic/CSynth
document.addEventListener('keydown', evt => {
    if (evt.key === 'F2') WEBVR.enter();
})

var WEBVR = {

	realsetup: function WEBVRsetup( options) {
		console.log("VR", 'XR session is supported, F2 or F6 to enter VR, F4 to exit	');

		if ( options && options.referenceSpaceType ) {
			renderer.xr.setReferenceSpaceType( options.referenceSpaceType );
		} else {
			// local ok, but user eye at floor level
			// local-floor, not supported, error setting session
			// unbounded not supported, error setting session
			// viewer, can't see anything
			renderer.xr.setReferenceSpaceType( 'local' );
		}
		renderer.xr.enabled = true;
		var currentSession = null;
		var pending = false;

		function onSessionStarted( session ) {
			console.log('requestSession started');
			console.log("VR", 'session started ok');

			renderer.xr.addEventListener( 'sessionend', onSessionEnded );
			renderer.xr.setSession( session );
			currentSession = session;
			pending = false;
			renderVR.reenter = false;
			// this is done in vrviewer and so does not need repeating
			// (three.js handles the animation loop inside or outside webXR in the approporiate way)
			// renderer.setAnimationLoop(animate);
		}
		// WEBVR.onSessionStarted = onSessionStarted;

		function onSessionEnded( event ) {
			renderer.xr.removeEventListener( 'sessionend', onSessionEnded );
			renderer.xr.setSession( null );
			currentSession = null;
			if (renderVR.reenter) {
				console.log('session end, restarting')
				// WEBVR.enter();					// won't work coming from controller?
				nircmd(`sendkey f2 press`);
				// renderer.setAnimationLoop(nop);    // don't animate during switch
			}
		}
		// WEBVR.onSessionEnded = onSessionEnded;

		WEBVR.enter = function () {
			if (pending) return;
			if (currentSession !== null ) return(console.error('WEBVR', 'attempt to reenter xr when already in xr'));
			renderer.xr.setFramebufferScaleFactor(renderVR.ratio);
			console.log('requestSession immersive-vr, ratio', renderVR.ratio);
			navigator.xr.requestSession( 'immersive-vr' ).then( onSessionStarted ).catch(onRequestError);
			pending = true;
		}

		WEBVR.exit = function() {
			currentSession.end();
		}

		function onRequestError(e) {
			console.error('VR', 'WEBXR got an error getting immersive-vr session for XR<br>', e.message);
		}

	},	// realsetup

	setup: function() {
		if (!navigator.xr) {
			console.error('VR', "WebXR not supported, no VR");
			WEBVR.novr = true;
			return;
		}
		 console.log("VR", 'start setup');
		 console.log("VR", 'check session supported');

		navigator.xr.isSessionSupported( 'immersive-vr' )
			.then( WEBVR.realsetup )
			.catch( (e) => {
				console.error('VR', "'XR not FOUND by navigator.xr.isSessionSupported( 'immersive-vr' )", e);
				WEBVR.novr = true;
			});
	}
};
WEBVR.setup();

/** enter and leave xr */
renderVR = {}
renderVR.xrfs = {}

renderVR.xrfs.restarts = 0;
renderVR.xrfs.lastRestartTime = 0;
renderVR.xrfs.startcalls = 0;
renderVR.xrfs.state = 'unguarded';
