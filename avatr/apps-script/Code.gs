/**
 * AVATR 07 — The Walk, Amman — lead collection backend.
 *
 * Bind this script to a Google Sheet (Extensions → Apps Script), then deploy
 * as a Web App (execute as Me, access: Anyone). See ../README.md.
 *
 * Appends each lead as a row on the "Leads" sheet and rejects duplicate
 * mobile numbers with {status:"duplicate"}.
 */

var SHEET_NAME = 'Leads';
var HEADERS = [
  'Timestamp', 'Name', 'Mobile', 'Current car', 'Timeline',
  'Test drive', 'WhatsApp opt-in', 'Language', 'Voucher code'
];

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000); // serialize writes so two scans can't race a duplicate in

  try {
    var data = JSON.parse(e.postData.contents);

    var mobile = String(data.mobile || '').replace(/\D/g, '');
    if (!/^07[789]\d{7}$/.test(mobile)) {
      return json_({ status: 'error', message: 'invalid mobile' });
    }

    var sheet = getSheet_();

    // Duplicate check against the Mobile column (C)
    var lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      var mobiles = sheet.getRange(2, 3, lastRow - 1, 1).getValues();
      for (var i = 0; i < mobiles.length; i++) {
        if (String(mobiles[i][0]).replace(/\D/g, '') === mobile) {
          return json_({ status: 'duplicate' });
        }
      }
    }

    sheet.appendRow([
      new Date(),
      String(data.name || ''),
      mobile, // set via API, so the leading 0 is kept as text
      String(data.currentCar || ''),
      String(data.timeline || ''),
      String(data.testDrive || ''),
      data.whatsappOptIn ? 'Yes' : 'No',
      String(data.language || ''),
      String(data.voucherCode || voucherCode_(mobile)),
    ]);

    return json_({ status: 'ok' });
  } catch (err) {
    return json_({ status: 'error', message: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// Sanity check: open the web app URL in a browser and you should see this.
function doGet() {
  return json_({ status: 'ok', service: 'AVATR leads' });
}

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sheet.getRange('C:C').setNumberFormat('@'); // keep mobiles as text
    sheet.setFrozenRows(1);
  }
  return sheet;
}

// Same algorithm as voucherCode() in app.js — kept as a fallback in case a
// payload arrives without a code.
function voucherCode_(mobile) {
  var h = 5381;
  for (var i = 0; i < mobile.length; i++) {
    h = ((h * 33) ^ mobile.charCodeAt(i)) >>> 0;
  }
  var A = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  var code = '';
  for (var j = 0; j < 4; j++) {
    code += A[h % A.length];
    h = Math.floor(h / A.length);
  }
  return code;
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
