module.exports = {  // Allow running of commands from command prompt/terminal
	// Map the grunt help to tasks for slightly easier listing of tasks. May want to clean up the output at some point.
	tasks_list: {
		command: 'grunt --help'
	},
	update_plm_commons: {
		command: 'bower update plm-commons'
	},
	update_adsk_commons: {
		command: 'bower update adsk-commons'
	}
};
