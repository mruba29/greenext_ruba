/**
 * Automatically provision all required lead fields in Airtable Base
 */

process.loadEnvFile('.env.local');

const BASE_ID = process.env.AIRTABLE_BASE_ID || 'appnkJABVWFGwX7Lv';
const TABLE_ID = process.env.AIRTABLE_LEADS_TABLE_ID || 'tblYi5BguStHsPtA4';
const PAT = process.env.AIRTABLE_PAT;

const fieldsToCreate = [
  { name: 'Email', type: 'email' },
  { name: 'Phone', type: 'phoneNumber' },
  { name: 'Company', type: 'singleLineText' },
  { name: 'Location', type: 'singleLineText' },
  { name: 'Industry', type: 'singleLineText' },
  { name: 'Enquiry Type', type: 'singleLineText' },
  { name: 'Requirements', type: 'multilineText' },
  { name: 'Business Challenge', type: 'multilineText' },
  { name: 'Project Timeline', type: 'singleLineText' },
  { name: 'Budget', type: 'singleLineText' },
  { name: 'Source Page', type: 'singleLineText' },
  { name: 'UTM Source', type: 'singleLineText' },
  { name: 'UTM Medium', type: 'singleLineText' },
  { name: 'UTM Campaign', type: 'singleLineText' },
  {
    name: 'Lead Status',
    type: 'singleSelect',
    options: {
      choices: [
        { name: 'New', color: 'blueLight2' },
        { name: 'In Progress', color: 'yellowLight2' },
        { name: 'Contacted', color: 'orangeLight2' },
        { name: 'Qualified', color: 'greenLight2' },
        { name: 'Closed', color: 'grayLight2' },
      ],
    },
  },
  { name: 'Created At', type: 'singleLineText' },
  { name: 'Updated At', type: 'singleLineText' },
  { name: 'Google Sheets Sync Status', type: 'singleLineText' },
  { name: 'Jira Issue Key', type: 'singleLineText' },
  { name: 'Email Notification Status', type: 'singleLineText' },
];

async function run() {
  console.log(`Connecting to Airtable Base ${BASE_ID}, Table ${TABLE_ID}...`);

  for (const f of fieldsToCreate) {
    try {
      const res = await fetch(`https://api.airtable.com/v0/meta/bases/${BASE_ID}/tables/${TABLE_ID}/fields`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${PAT}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(f),
      });

      const data = await res.json();
      if (res.ok) {
        console.log(`  ✅ Created field: "${f.name}" (${f.type})`);
      } else if (data.error?.message?.includes('already exists')) {
        console.log(`  ℹ️ Field already exists: "${f.name}"`);
      } else {
        console.warn(`  ⚠️ Failed to create "${f.name}":`, data.error?.message || data);
      }
    } catch (err) {
      console.error(`  ❌ Error creating "${f.name}":`, err.message);
    }
  }

  console.log('\nAll Airtable fields verified and ready!');
}

run();
