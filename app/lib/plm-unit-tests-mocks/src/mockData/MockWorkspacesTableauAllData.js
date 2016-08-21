' use strict ';
// get ALL the tableau from a workspace
angular.module('plm360.mockData').value('MockWorkspacesTableauAllData', {

    "__self__": "/api/v3/workspaces/47/tableaus",
    "tableaus": [
        {
            "link": "/api/v3/workspaces/47/tableaus/106",
            "urn": "urn:adsk.plm:tenant.workspace.tableau:DEVINDMACHINE1003B.47.106",
            "title": "A NOT Default View",
            "deleted": false,
            "permissions": []
        },
        {
            "link": "/api/v3/workspaces/47/tableaus/91",
            "urn": "urn:adsk.plm:tenant.workspace.tableau:DEVINDMACHINE1003B.47.91",
            "title": "My Default View",
            "deleted": false,
            "type": "DEFAULT",
            "permissions": []
        },
        {
            "link": "/api/v3/workspaces/47/tableaus/107",
            "urn": "urn:adsk.plm:tenant.workspace.tableau:DEVINDMACHINE1003B.47.107",
            "title": "Z View",
            "deleted": false,
            "permissions": []
        }
    ]
});
