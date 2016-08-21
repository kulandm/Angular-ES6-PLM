var counters = [];
var prevSections = 0;
var lintcounts = {};

module.exports = {
	styleguide_number: {
		src: [
			'**/*.scss',
			'!**/bootstrap/**',
			'!**/fonts/**',
			'!**/animate.css-scss/**'
		],
		actions: [{
			search: new RegExp(/Styleguide(.*|$)/gi),
			replace: function (m) {
				// Get the section index
				var levels = m.slice(11);
				levels = levels.split('.');
				// Get the number of levels in section
				curSections = levels.length;

				// If at new section, reset counter
				if (curSections == 1) {
					counters = [];
					counters.push(levels[0]);
				}
				else {
					// If at same level of section
					if (curSections == prevSections) {
						// If at same parent level of sub-section
						if (counters[curSections - 2] == levels[curSections - 2]) {
							// Increase the lowest level of sub-section
							counters[counters.length - 1] += 1;
						}
						// If at different parent level of sub-section
						else {
							// Increase the parent level of sub-section
							counters[counters.length - 2] += 1;
							// Reset lowest level of sub-section to one
							counters[counters.length - 1] = 1;
						}
					}
					// If at different level of section
					else {
						// If increasing level of sub-section (e.g. 1.2 to 1.3.1)
						if (curSections > 2 && (counters.length < curSections)) {
							// Increase the to-be-parent level of sub-section (e.g. 2 to 3)
							counters[counters.length - 1] += 1;
							// Add the lowest level
							counters.push(0);
						}
						// If increasing first level of sub-section (e.g. 1 to 1.1)
						else if (counters.length < curSections) {
							counters.push(0);
						}
						// If decreasing level of sub-section (e.g. 1.3.2 to 1.4)
						else if (counters.length > levels.length) {
							counters.pop(1);
						}
						// Increase the lowest level by one
						counters[counters.length - 1] += 1;
					}
				}
				
				prevSections = curSections;
				m = 'Styleguide ';
				for (j = 0; j < counters.length; j++) {
					m = m.concat(counters[j] + '.');
				}
				m = m.substring(0, m.length - 1);
				return m;
			}
		}]
	},
};
