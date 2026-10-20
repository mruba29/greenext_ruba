/**
 * GreenNext Digital Infrastructure — Airtable Diagnostics & Health Check API
 * 
 * Verifies connectivity, table access, and configuration without exposing credentials or secret tokens.
 */

import { verifyAirtableConnection, getAirtableConfig } from './_airtable.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ success: false, message: 'Method Not Allowed' });
    return;
  }

  const cfg = getAirtableConfig();
  const verification = await verifyAirtableConnection();

  const maskedToken = cfg.pat
    ? `${cfg.pat.slice(0, 4)}••••${cfg.pat.slice(-4)}`
    : 'Not configured';

  res.status(200).json({
    success: verification.connected,
    service: 'GreenNext Airtable Lead Database Diagnostics',
    timestamp: new Date().toISOString(),
    config: {
      baseId: cfg.baseId,
      tableId: cfg.tableId,
      viewId: cfg.viewId,
      patConfigured: Boolean(cfg.pat),
      patPreview: maskedToken,
    },
    verification,
  });
}
