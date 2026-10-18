/**
 * GreenNext Digital Infrastructure — Jira Cloud REST API Service
 * 
 * Manages parent task and subtask creation in Atlassian Jira Cloud (REST API v3 & Agile v1.0).
 * Handles authentication, project verification, user resolution, subtask generation,
 * active sprint assignment, idempotency duplicate checking, and sanitized logging.
 */

/**
 * Reads and validates server-side Jira configuration from environment variables.
 * Never throws secrets or logs tokens.
 */
export function getJiraConfig() {
  const baseUrl = (process.env.JIRA_BASE_URL || 'https://trustworkz.atlassian.net').replace(/\/+$/, '');
  const email = (process.env.JIRA_EMAIL || '').trim();
  const apiToken = (process.env.JIRA_API_TOKEN || '').trim();
  const projectKey = (process.env.JIRA_PROJECT_KEY || 'DI').trim().toUpperCase();
  const assigneeAccountId = (process.env.JIRA_ASSIGNEE_ACCOUNT_ID || '').trim();
  const activeSprintId = process.env.JIRA_ACTIVE_SPRINT_ID ? parseInt(process.env.JIRA_ACTIVE_SPRINT_ID, 10) : null;

  const isConfigured = Boolean(baseUrl && email && apiToken && projectKey);

  return {
    baseUrl,
    email,
    apiToken,
    projectKey,
    assigneeAccountId,
    activeSprintId: isNaN(activeSprintId) ? null : activeSprintId,
    isConfigured,
  };
}

/**
 * Builds standard HTTP Basic Authentication header for Jira REST API.
 */
function getAuthHeader(config) {
  const token = Buffer.from(`${config.email}:${config.apiToken}`).toString('base64');
  return `Basic ${token}`;
}

/**
 * Converts a plain-text multiline string into Atlassian Document Format (ADF) paragraph nodes.
 */
function buildAdfDescription(sections) {
  const content = [];

  for (const sec of sections) {
    if (sec.heading) {
      content.push({
        type: 'heading',
        attrs: { level: 3 },
        content: [{ type: 'text', text: sec.heading }],
      });
    }

    if (sec.paragraphs) {
      for (const p of sec.paragraphs) {
        content.push({
          type: 'paragraph',
          content: [{ type: 'text', text: p }],
        });
      }
    }

    if (sec.bulletList) {
      content.push({
        type: 'bulletList',
        content: sec.bulletList.map(item => ({
          type: 'listItem',
          content: [{
            type: 'paragraph',
            content: [{ type: 'text', text: item }],
          }],
        })),
      });
    }

    if (sec.rule) {
      content.push({ type: 'rule' });
    }
  }

  return {
    type: 'doc',
    version: 1,
    content,
  };
}

/**
 * Verifies Jira credentials and checks if the project and user are accessible.
 */
export async function verifyJiraConnection(customConfig = null, fetchFn = fetch) {
  const cfg = customConfig || getJiraConfig();
  if (!cfg.isConfigured) {
    return {
      connected: false,
      error: 'Missing required Jira credentials (JIRA_EMAIL, JIRA_API_TOKEN, or JIRA_PROJECT_KEY)',
    };
  }

  try {
    const auth = getAuthHeader(cfg);

    // 1. Verify user authentication
    const userRes = await fetchFn(`${cfg.baseUrl}/rest/api/3/myself`, {
      method: 'GET',
      headers: {
        'Authorization': auth,
        'Accept': 'application/json',
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!userRes.ok) {
      return {
        connected: false,
        status: userRes.status,
        error: `Jira authentication failed with status ${userRes.status}`,
      };
    }

    const userData = await userRes.json();

    // 2. Verify project access & available issue types
    const projRes = await fetchFn(`${cfg.baseUrl}/rest/api/3/project/${cfg.projectKey}`, {
      method: 'GET',
      headers: {
        'Authorization': auth,
        'Accept': 'application/json',
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!projRes.ok) {
      return {
        connected: false,
        status: projRes.status,
        error: `Jira project '${cfg.projectKey}' not found or inaccessible (status ${projRes.status})`,
      };
    }

    const projData = await projRes.json();
    const issueTypes = (projData.issueTypes || []).map(t => ({
      id: t.id,
      name: t.name,
      subtask: Boolean(t.subtask),
    }));

    const taskType = issueTypes.find(t => !t.subtask && t.name.toLowerCase() === 'task');
    const subtaskType = issueTypes.find(t => t.subtask);

    return {
      connected: true,
      user: {
        displayName: userData.displayName,
        email: userData.emailAddress,
        accountId: userData.accountId,
      },
      project: {
        id: projData.id,
        key: projData.key,
        name: projData.name,
      },
      issueTypes: {
        taskName: taskType ? taskType.name : 'Task',
        subtaskName: subtaskType ? subtaskType.name : 'Subtask',
      },
    };
  } catch (err) {
    return {
      connected: false,
      error: err.name === 'TimeoutError' ? 'Jira connection timed out' : (err.message || 'Unknown network error'),
    };
  }
}

/**
 * Searches for an existing Jira task with this exact Enquiry ID to guarantee idempotency.
 */
export async function findExistingJiraLeadTask(enquiryId, customConfig = null, fetchFn = fetch) {
  const cfg = customConfig || getJiraConfig();
  if (!cfg.isConfigured || !enquiryId) return null;

  try {
    const auth = getAuthHeader(cfg);
    const jql = `project = "${cfg.projectKey}" AND text ~ "${enquiryId}"`;

    const res = await fetchFn(`${cfg.baseUrl}/rest/api/3/search/jql`, {
      method: 'POST',
      headers: {
        'Authorization': auth,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        jql,
        fields: ['summary', 'status', 'subtasks'],
        maxResults: 1,
      }),
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) return null;
    const data = await res.json();
    if (data.issues && data.issues.length > 0) {
      const issue = data.issues[0];
      return {
        key: issue.key,
        id: issue.id,
        summary: issue.fields.summary,
        status: issue.fields.status ? issue.fields.status.name : '',
        subtasks: (issue.fields.subtasks || []).map(s => s.key),
      };
    }
  } catch (e) {
    // Non-fatal search error — allow lead flow to proceed
  }
  return null;
}

/**
 * Comprehensive 7-Stage Lead Management Workflow & SLA Definitions
 */
export const LEAD_WORKFLOW = [
  {
    stage: 'initial_contact',
    name: 'Initial Contact — GreenNext Lead',
    titleSuffix: 'Initial Contact — GreenNext Lead',
    dueHours: 24,
    priority: 'High',
    description: 'Assigned team member contacts the prospect within 24 hours to qualify enterprise data center requirements.',
  },
  {
    stage: 'follow_up_1',
    name: 'Follow-up 1 — GreenNext Lead',
    titleSuffix: 'Follow-up 1 — GreenNext Lead',
    dueHours: 48,
    priority: 'High',
    description: 'Follow-up is performed and recorded if the prospect has not yet responded or progressed.',
  },
  {
    stage: 'requirements_gathering',
    name: 'Requirements Gathering — GreenNext Lead',
    titleSuffix: 'Requirements Gathering — GreenNext Lead',
    dueHours: 48,
    priority: 'Medium',
    description: "Capture the prospect's data center requirements, capacity expectations, power density (kW/rack), location, and project timeline.",
  },
  {
    stage: 'site_visit',
    name: 'Data Center Consultation / Site Visit',
    titleSuffix: 'Data Center Consultation / Site Visit',
    dueHours: 48,
    priority: 'Medium',
    description: 'Schedule and document a consultation or engineering site visit when appropriate.',
  },
  {
    stage: 'proposal_quote',
    name: 'Proposal / Quote Submission',
    titleSuffix: 'Proposal / Quote Submission',
    dueHours: 24,
    priority: 'Medium',
    dueTrigger: 'requirements_and_site_assessment_ready',
    defaultOffsetHours: 72,
    description: 'Prepare and submit high-level technical architecture and commercial quote within 24 hours of requirements readiness.',
  },
  {
    stage: 'lead_closure',
    name: 'Lead Closure',
    titleSuffix: 'Lead Closure',
    dueHours: 24,
    priority: 'Medium',
    dueTrigger: 'final_decision_recorded',
    defaultOffsetHours: 96,
    description: 'Record the actual outcome (Won, Lost, or configured closure) within 24 hours of final decision.',
  },
  {
    stage: 'operations_handover',
    name: 'Handover to Operations',
    titleSuffix: 'Handover to Operations',
    dueHours: 24,
    priority: 'Medium',
    dueTrigger: 'successful_closure_and_handover_approval',
    defaultOffsetHours: 120,
    description: 'For won leads, hand over confirmed specifications, SOW, and SLA requirements to the operations engineering team.',
  },
];

export const DEFAULT_LEAD_SUBTASKS = LEAD_WORKFLOW;

/**
 * Calculates ISO YYYY-MM-DD due date string from a base date and offset in hours.
 */
export function calculateDueDate(baseDate, offsetHours = 24) {
  try {
    const ts = baseDate ? new Date(baseDate).getTime() : Date.now();
    const d = new Date(ts + (offsetHours || 24) * 3600 * 1000);
    return d.toISOString().slice(0, 10);
  } catch (e) {
    return new Date(Date.now() + 86400000).toISOString().slice(0, 10);
  }
}

/**
 * Creates a parent Task and associated Subtasks in Jira Cloud for an eligible lead.
 * 
 * @param {Object} leadData Validated lead information
 * @param {Object} options Configuration overrides & custom fetch for mock testing
 */
export async function createJiraLeadTask(leadData, options = {}) {
  const cfg = options.config || getJiraConfig();
  const fetchFn = options.fetchFn || fetch;

  if (!cfg.isConfigured) {
    return {
      success: false,
      status: 'jira_disabled',
      message: 'Jira integration credentials not configured',
    };
  }

  const enquiryId = leadData.enquiryId || leadData.id || 'GN-UNASSIGNED';
  const fullName = leadData.fullName || leadData.name || 'Enterprise Prospect';
  const formType = leadData.formType || 'Lead Form';
  const company = leadData.companyName || leadData.company || 'Direct Client';
  const email = leadData.businessEmail || leadData.email || '—';
  const phone = leadData.phoneNumber || leadData.phone || '—';
  const service = leadData.areaOfInterest || leadData.service || 'Infrastructure';
  const location = leadData.location || '—';
  const timeline = leadData.expectedTimeline || '—';
  const requirements = leadData.projectRequirements || leadData.message || '—';
  const metadata = leadData.metadata || {};

  // 1. Idempotency Check: Prevent duplicate tasks if lead was already created in Jira
  const existing = await findExistingJiraLeadTask(enquiryId, cfg, fetchFn);
  if (existing) {
    return {
      success: true,
      status: 'jira_created',
      duplicate: true,
      parentKey: existing.key,
      parentId: existing.id,
      subtaskKeys: existing.subtasks || [],
      message: `Jira parent task already exists (${existing.key})`,
    };
  }

  const auth = getAuthHeader(cfg);

  // 2. Format Parent Task Summary & ADF Description
  const companyClean = (company && company !== 'Direct Client' && company !== '—') ? company : enquiryId;
  const parentSummary = `GreenNext Lead — ${companyClean}`;

  const adfSections = [
    {
      heading: 'GreenNext Enterprise Lead Capture',
      paragraphs: [
        `Lead Reference: ${enquiryId}`,
        `Submitted At: ${leadData.submittedAt || new Date().toISOString()}`,
        `Form Type: ${formType}`,
        `Google Sheets Reference: Workbook 14ciH1aNzWIJHJkQ5rYCdrEhci3KYMjrTSeY3QMaerVI (Enquiries & Jira Lead Tracking)`,
      ],
    },
    { rule: true },
    {
      heading: 'Contact Details',
      bulletList: [
        `Contact Name: ${fullName}`,
        `Company Name: ${company}`,
        `Business Email: ${email}`,
        `Phone Number: ${phone}`,
        `Target Location: ${location}`,
        `Target Industry: ${leadData.industry || '—'}`,
      ],
    },
    {
      heading: 'Project Scope & Requirements',
      bulletList: [
        `Area of Interest: ${service}`,
        `Expected Deployment Timeline: ${timeline}`,
        `Preferred Contact Method: ${leadData.preferredContactMethod || 'Email'}`,
      ],
    },
    {
      heading: 'Detailed Requirements / Message',
      paragraphs: [requirements],
    },
  ];

  if (metadata.page_url || metadata.utm_source || metadata.referrer) {
    const metaBullets = [];
    if (metadata.page_url) metaBullets.push(`Landing URL: ${metadata.page_url}`);
    if (metadata.referrer) metaBullets.push(`Referrer: ${metadata.referrer}`);
    if (metadata.utm_source) metaBullets.push(`UTM Source: ${metadata.utm_source}`);
    if (metadata.utm_medium) metaBullets.push(`UTM Medium: ${metadata.utm_medium}`);
    if (metadata.utm_campaign) metaBullets.push(`UTM Campaign: ${metadata.utm_campaign}`);
    adfSections.push({
      heading: 'Attribution & Tracking Metadata',
      bulletList: metaBullets,
    });
  }

  adfSections.push({ rule: true });
  adfSections.push({
    paragraphs: [
      'Origin: GreenNext Digital Infrastructure Web Platform',
      `System Key: ${enquiryId}`,
    ],
  });

  const parentFields = {
    project: { key: cfg.projectKey },
    summary: parentSummary,
    description: buildAdfDescription(adfSections),
    issuetype: { name: 'Task' },
  };

  // Assign to verified user if account ID provided
  if (cfg.assigneeAccountId) {
    parentFields.assignee = { accountId: cfg.assigneeAccountId };
  }

  // 3. Create Parent Task
  let parentKey = null;
  let parentId = null;

  try {
    const createParentRes = await fetchFn(`${cfg.baseUrl}/rest/api/3/issue`, {
      method: 'POST',
      headers: {
        'Authorization': auth,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ fields: parentFields }),
      signal: AbortSignal.timeout(15000),
    });

    if (!createParentRes.ok) {
      const errText = await createParentRes.text().catch(() => '');
      return {
        success: false,
        status: 'jira_failed',
        statusCode: createParentRes.status,
        error: `Failed to create Jira parent task: ${errText.slice(0, 300)}`,
      };
    }

    const parentResData = await createParentRes.json();
    parentKey = parentResData.key;
    parentId = parentResData.id;
  } catch (err) {
    return {
      success: false,
      status: 'jira_failed',
      error: `Network timeout or connection error creating parent issue: ${err.message}`,
    };
  }

  // 4. Optionally Assign Parent Task to Active Sprint
  if (cfg.activeSprintId && parentKey) {
    try {
      await fetchFn(`${cfg.baseUrl}/rest/agile/1.0/sprint/${cfg.activeSprintId}/issue`, {
        method: 'POST',
        headers: {
          'Authorization': auth,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ issues: [parentKey] }),
        signal: AbortSignal.timeout(10000),
      });
    } catch (sprintErr) {
      // Non-fatal sprint assignment error
    }
  }

  // 5. Create Subtasks under Parent Issue
  const subtaskSpecs = options.subtasks || DEFAULT_LEAD_SUBTASKS;
  const createdSubtasks = [];
  const subtaskMap = {};
  const subtaskErrors = [];

  for (const spec of subtaskSpecs) {
    const subtaskSummary = spec.name || `${spec.titleSuffix} — ${enquiryId}`;
    const dueDateStr = calculateDueDate(leadData.submittedAt, spec.defaultOffsetHours || spec.dueHours);

    const subtaskAdf = buildAdfDescription([
      {
        heading: subtaskSummary,
        paragraphs: [
          spec.description || 'GreenNext Lead Management Workflow Stage.',
          `Parent Lead: ${enquiryId} (${fullName} - ${company})`,
          `Configured SLA: ${spec.dueHours || 24} hours from stage trigger.`,
          `Target Due Date: ${dueDateStr}`,
        ],
      },
    ]);

    const subtaskFields = {
      project: { key: cfg.projectKey },
      parent: { key: parentKey },
      summary: subtaskSummary,
      description: subtaskAdf,
      issuetype: { name: 'Subtask' },
    };

    if (spec.priority) {
      subtaskFields.priority = { name: spec.priority };
    }

    if (dueDateStr) {
      subtaskFields.duedate = dueDateStr;
    }

    if (cfg.assigneeAccountId) {
      subtaskFields.assignee = { accountId: cfg.assigneeAccountId };
    }

    try {
      let subtaskRes = await fetchFn(`${cfg.baseUrl}/rest/api/3/issue`, {
        method: 'POST',
        headers: {
          'Authorization': auth,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ fields: subtaskFields }),
        signal: AbortSignal.timeout(10000),
      });

      // Graceful fallback if duedate or priority rejected by custom Jira screen schema
      if (!subtaskRes.ok && subtaskRes.status === 400 && (subtaskFields.duedate || subtaskFields.priority)) {
        delete subtaskFields.duedate;
        delete subtaskFields.priority;
        subtaskRes = await fetchFn(`${cfg.baseUrl}/rest/api/3/issue`, {
          method: 'POST',
          headers: {
            'Authorization': auth,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({ fields: subtaskFields }),
          signal: AbortSignal.timeout(10000),
        });
      }

      if (subtaskRes.ok) {
        const subtaskData = await subtaskRes.json();
        createdSubtasks.push(subtaskData.key);
        if (spec.stage) subtaskMap[spec.stage] = subtaskData.key;
      } else {
        const subErrText = await subtaskRes.text().catch(() => '');
        subtaskErrors.push({
          title: spec.name || spec.titleSuffix,
          stage: spec.stage,
          status: subtaskRes.status,
          error: subErrText.slice(0, 200),
        });
      }
    } catch (stErr) {
      subtaskErrors.push({
        title: spec.name || spec.titleSuffix,
        stage: spec.stage,
        error: stErr.message,
      });
    }
  }

  const parentUrl = `${cfg.baseUrl}/browse/${parentKey}`;

  // 6. Return Structured Status (Success vs. Partial Failure)
  if (subtaskErrors.length > 0) {
    return {
      success: true,
      status: 'jira_partial_failure',
      parentKey,
      parentId,
      parentUrl,
      subtaskKeys: createdSubtasks,
      subtaskMap,
      failedSubtasks: subtaskErrors,
      message: `Parent issue ${parentKey} created with ${createdSubtasks.length}/${subtaskSpecs.length} subtasks`,
    };
  }

  return {
    success: true,
    status: 'jira_created',
    parentKey,
    parentId,
    parentUrl,
    subtaskKeys: createdSubtasks,
    subtaskMap,
    assignee: cfg.assigneeAccountId ? 'Verified Assignee' : 'Unassigned',
    sprintId: cfg.activeSprintId,
    message: `Jira parent task ${parentKey} and ${createdSubtasks.length} subtasks created successfully`,
  };
}
