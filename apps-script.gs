/*
  RSVP form -> Google Sheets
  ---------------------------------------------------------
  Setup:
  1. Extensions > Apps Script (or script.google.com), delete any starter code,
     and paste this file's contents.
  2. Deploy > New deployment > type "Web app".
       - Execute as: Me
       - Who has access: Anyone
  3. Click Deploy, authorize the requested permissions.
  4. Copy the Web app URL (ends in /exec) into script.js's GOOGLE_SCRIPT_URL.

  IMPORTANT: whenever you edit this file afterward, you must redeploy for the
  live URL to pick up the change: Deploy > Manage deployments > pencil icon >
  Version: "New version" > Deploy. Saving the script alone does not update
  the already-deployed /exec endpoint.

  Uses SpreadsheetApp.openById so this works whether the script is bound to
  the sheet or standalone. Writes to the sheet's first tab (gid=0), appending
  [제출시각, 구분, 성함, 참석여부] below the existing header row.
*/

var SPREADSHEET_ID = '1JBRfiTgynph9O1J_4My9w_oTYhsfmSVTrgwq2DquL8w';

function doPost(e) {
  var sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheets()[0];

  var side = e.parameter.side || '';
  var name = e.parameter.name || '';
  var attendance = e.parameter.attendance || '';

  sheet.appendRow([new Date(), side, name, attendance]);

  return ContentService
    .createTextOutput(JSON.stringify({ result: 'success' }))
    .setMimeType(ContentService.MimeType.JSON);
}
