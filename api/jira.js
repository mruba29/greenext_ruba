/**
 * GreenNext Digital Infrastructure — Jira Diagnostics & Health Check API
 * 
 * Verifies connectivity, authentication, project permissions, and active sprint
 * without exposing credentials or secret tokens.
 */

import { verifyJiraConnection, getJiraConfig } from './_jira.js';

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

  const cfg = getJiraConfig();
  const verification = await verifyJiraConnection();

  res.status(200).json({
    success: verification.connected,
    service: 'GreenNext Jira Cloud Integration Diagnostics',
    timestamp: new Date().toISOString(),
    config: {
      baseUrl: cfg.baseUrl,
      configuredEmail: cfg.email ? `${cfg.email.slice(0, 3)}***@${cfg.email.split('@')[1] || ''}` : 'Not configured',
      tokenSet: Boolean(cfg.apiToken),
      projectKey: cfg.projectKey,
      assigneeConfigured: Boolean(cfg.assigneeAccountId),
      activeSprintId: cfg.activeSprintId,
    },
    verification,
  });
}
