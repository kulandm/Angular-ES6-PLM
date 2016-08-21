/*
 * Global PLM app settings
 *
 */
export default angular.module(__moduleName, [])
.value('GlobalSettings', {
	/* Sets the level of debugging
	 * 0+ errors
	 * 1+ errors, requests
	 * 2+ errors, requests, responses
	 */
	debugLevel: 0,
	/*
	 * The default timeout for requests
	 */
	requestTimeout: 15000,
	/*
	 * Sets the app in dev mode
	 */
	devMode: 1
	/*
	 * The default delay for animations and waiting for requests/responses to stop happening when displaying parts of the loading bar as requests are performed
	 */
	// requestDelay: 300,
	/*
	 * The number of milliseconds for duration of the animation of the loading bar per request - e.g. 2 requests will be 2*2000 = 4000
	 */
	// animationDurationPerRequest: 2000,
	/*
	 * The number of milliseconds for duration of the animation of the loading bar if there's an error
	 */
	// animationDurationIfError: 200
});
