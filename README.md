# novel-store
# Novel Store — GitHub Pages + Google Sheets Order Backend

## Files
- `index.html` — website
- `style.css` — design
- `script.js` — website behavior + order submission
- `config.js` — your details and Apps Script URL
- `GoogleAppsScript_Code.gs` — backend for Google Sheets
- `pdfs/` — put your 3 PDFs here

## Setup backend

### Step 1 — Create your order database
Create a new Google Sheet.

### Step 2 — Add Apps Script
In the Google Sheet:
Extensions → Apps Script

Delete the starter code and paste the complete contents of `GoogleAppsScript_Code.gs`.

Save it.

### Step 3 — Deploy
Click:
Deploy → New deployment → Web app

Set:
- Execute as: Me
- Who has access: Anyone

Deploy and authorize it when Google asks.

Copy the Web app URL ending in `/exec`.

### Step 4 — Connect website
Open `config.js` and replace:

`PASTE_YOUR_GOOGLE_APPS_SCRIPT_EXEC_URL_HERE`

with your `/exec` URL.

Example:
`orderApiUrl: "https://script.google.com/macros/s/XXXXXXXX/exec"`

Do NOT put passwords or private API keys in `config.js`.

### Step 5 — Add PDFs
Put:
- `urdu.pdf`
- `roman-urdu.pdf`
- `english.pdf`

inside `pdfs/`.

### Step 6 — Upload to GitHub
Upload:
- index.html
- style.css
- script.js
- config.js
- pdfs/
- (GoogleAppsScript_Code.gs is not needed by the website, but you can keep it in the repo)

Then enable GitHub Pages from:
Settings → Pages → Deploy from branch → main → / (root).

## Order flow

Customer fills the form.
→ Apps Script receives the order.
→ A unique `WM-XXXXXX` code is generated.
→ Order is stored in your Google Sheet.
→ Customer sees the code.
→ Customer completes bank transfer.
→ Customer sends screenshot + code to your Instagram DM.
→ You verify the payment and match the code in your Google Sheet.

## Important
This backend stores order information in your Google Sheet. Keep the sheet private and do not publish it.

Bank-transfer payment is intentionally manual: the website does not claim that a payment is verified automatically.

For production, you should also add spam protection/rate limiting and, if needed, email notifications.