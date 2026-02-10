import React, { useState } from 'react';
import { BookLite } from '../../stores/library';

type Props = {
    book: BookLite;
    onClose: () => void;
};

type ChapterContent = {
    id: string;
    title: string;
    subtitle: string;
    page: string;
    quote?: string;
    sections: any[];
    description?: string;
    ref?: string;
    subtext?: string;
    icon?: string;
    buttons?: string[];
};

// Colors based on Spec
const COLORS = {
    bg: '#121212',
    text: '#F5F5DC', // Cream/Beige
    accent: '#D4AF37', // Gold
    dim: 'rgba(245, 245, 220, 0.4)',
    border: 'rgba(212, 175, 55, 0.2)'
};

// --- DATA: BOOK A (AGENT SPEC) ---
const BOOK_A_CONTENT: ChapterContent[] = [
    {
        id: '1',
        title: 'IDENTITY',
        subtitle: 'Chapter I',
        page: '01',
        quote: '"The defining essence of the autonomous agent, establishing its nomenclature, domain classification, and primary directives."',
        sections: [
            { type: 'field', label: 'Agent Name', value: 'Aura-V' },
            { type: 'field', label: 'Agent ID', value: 'SYS-9942-X' },
            { type: 'dropdown', label: 'Tower', value: 'Language Processing' },
            { type: 'box', label: 'Purpose', value: 'To orchestrate dialogue flows between user intents and backend execution logic, ensuring context' },
            { type: 'list', label: 'Entry Conditions', items: [
                'User authenticated via bio-signature',
                'Latency below 50ms',
                'Secure channel established',
                'Context window initialized'
            ]}
        ]
    },
    {
        id: '2',
        title: 'INPUTS &\nOUTPUTS',
        subtitle: 'Chapter II',
        page: '03',
        description: 'Define the data schema for Agent A. Ensure strict typing for autonomous execution protocols.',
        sections: [
            { type: 'header', label: 'INPUTS' },
            { type: 'param', name: 'User_Query_String', source: 'User', timing: 'On Load' },
            { type: 'param', name: 'Context_Window_ID', source: 'System', timing: 'Pre-fetch' },
            { type: 'header', label: 'OUTPUTS' },
            { type: 'param', name: 'JSON_Response_Object', destination: 'Client', latency: 'Real-time' }
        ]
    },
    {
        id: '3',
        title: 'FRAME\nWORK',
        subtitle: 'Chapter III',
        page: '05',
        quote: '"The structure upon which intelligence is built determines the height of its reach."',
        ref: 'REF: BOOK A // AGENT SPEC',
        sections: [
            { type: 'header', label: 'Operational Parameters', meta: 'V 4.0' },
            { type: 'code-list', label: 'STEPS', items: [
                '- Initialize core loop',
                '- Load memory context',
                '- Await triggers...'
            ]},
            { type: 'code-list', label: 'ENTRY CHECKS', items: [
                '- Verify API connection',
                '- Check token limits...'
            ]},
             { type: 'code-list', label: 'EXIT GUARANTEES', items: [
                '- Valid JSON output',
                '- Error logs saved...'
            ]}
        ]
    },
    {
        id: '4',
        title: 'CONSTRAINTS',
        subtitle: 'Chapter IV',
        page: '07',
        subtext: 'BOOK A',
        icon: 'lock',
        sections: [
            { type: 'header', label: 'LIMITATION PARAMETERS', meta: 'ACTIVE EDIT', active: true },
            { type: 'box-code', label: 'DO NOT USE WHEN', items: [
                '• Example: High latency detected',
                '• Example: User lacks clearance level 4'
            ]},
            { type: 'grid-fields', fields: [
                { label: 'REQUIRES FIRST', value: 'AUTH_MODULE_V3' },
                { label: 'FALLBACK', value: 'TERMINATE_SESSION' }
            ]}
        ]
    },
];

// --- DATA: BOOK B (FLOWS & HANDOFFS) ---
const BOOK_B_CONTENT: ChapterContent[] = [
    {
        id: '1',
        title: 'DEFAULT\nNEXT STEPS',
        subtitle: 'Book B • Chapter I',
        page: '042',
        quote: '"The chain of autonomy is forged link by link. Define the successors here to ensure seamless propagation of intent."',
        icon: 'alt_route',
        sections: [
            { type: 'header', label: 'SUCCESSOR CONFIGURATION', meta: 'CONFIG' },
            { type: 'agent-config', nameLabel: 'AGENT 01 NAME', nameValue: 'Research_Synthesizer_Alpha', outputs: ['Summary_JSON', 'Confidence_Metric'] },
            { type: 'agent-config', nameLabel: 'AGENT 02 NAME', nameValue: 'Enter Agent ID...', outputs: ['List requirements...'], placeholder: true }
        ]
    },
    {
        id: '2',
        title: 'ALTERNATE\nPATHS',
        subtitle: 'Book B • Ch. II',
        page: '24', // Design says 24
        quote: '"In the absence of direct sequence confirmation, the autonomous agent must derive a secondary route through conditional logic gates, preserving intent while adapting execution."',
        sections: [
             { type: 'header', label: 'CONFIG PANEL', meta: 'LOGIC' },
             { type: 'field', label: 'CONDITION', value: 'IF PRIORITY == HIGH' },
             { type: 'code-block', label: 'SEQUENCE DEFINITION', value: '// Define fallback logic flow...\nWAIT_FOR_SIGNAL(300);\nEXECUTE_PROTOCOL(ALPHA);' },
             { type: 'button', label: 'INITIALIZE PATH', icon: 'arrow_forward' }
        ]
    },
    {
        id: '3',
        title: 'PREDECESSORS',
        subtitle: 'Book B • Chapter III',
        page: '043', 
        quote: '"Before the agent can act, it must perceive. These are the tributaries that feed the river of cognition."',
        buttons: ['DEPENDENCY GRAPH', 'INPUT VECTORING'],
        sections: [
             { type: 'header', label: 'FEEDER AGENTS' },
             { type: 'feeder-list', items: [
                 { name: 'Data Ingestion Swarm (Alpha)', desc: 'Responsible for raw telemetry gathering from external APIs. Outputs unformatted data streams.' },
                 { name: 'Context Retriever V2', desc: 'Fetches relevant historical vectors from the Vault based on initial trigger keywords.' },
                 { name: 'User Intent Parser', desc: 'Classifies natural language inputs into high-level intent categories for routing.' }
             ]},
             { type: 'header', label: 'ACCEPTED INPUT SHAPES' },
             { type: 'code-block', label: 'schema_v4.json', value: '{\n  "meta": {\n    "version": "4.0.1",\n    "origin": "feeder_agent_id",\n    "timestamp": "ISO8601"\n  },\n  "payload": {\n    "vector": [0.124, 0.993, 0.001,\n    ...],\n' }
        ]
    },
    {
        id: '4',
        title: 'FAILURE &\nRECOVERY',
        subtitle: 'Chapter IV',
        page: '084',
        quote: '"Resilience is not merely the ability to endure, but the calculated capacity to recover grace when confidence falters."',
        description: 'When the autonomous agent encounters an Out-Of-Distribution (OOD) event or a confidence score falling below the threshold (0 < 0.45), the Recovery Protocol must engage immediately to prevent hallucination cascades.',
        sections: [
            { type: 'header', label: 'LOW CONFIDENCE ACTION', icon: 'warning' },
            { type: 'split-fields', fields: [
                { label: 'TRIGGER THRESHOLD', value: 'conf < 0.45' },
                { label: 'ACTION TYPE', value: 'Pause & Query User', isDropdown: true }
            ]},
            { type: 'box', label: 'FALLBACK PROMPT / SYSTEM MESSAGE', value: 'I am unsure how to proceed with this request based on current parameters. Please clarify the intent or provide additional context.' },
            { type: 'header', label: 'ROLLBACK PATHS', icon: 'undo' },
            { type: 'step-list', items: [
                { id: '01', text: 'Clear context window last 5 messages', active: true },
                { id: '02', text: 'Re-attempt with Chain-of-Thought (CoT)', active: true },
                { id: '03', text: 'Add recovery step...', placeholder: true }
            ]}
        ]
    }
];

// --- DATA: BOOK C (SOLOPRENEUR / INDIE) ---
const BOOK_C_CONTENT: ChapterContent[] = [
    {
        id: '1',
        title: 'SETUP',
        subtitle: 'Chapter 01',
        page: '01',
        description: 'Establish the operational baseline. Define the entity "Who", secure the digital territory "Domain", and set the initial coordinates "Metrics". Without a clear origin point, velocity cannot be measured.',
        ref: 'REF: C-01',
        sections: [
            { type: 'textarea', label: 'WHO', value: 'Define the solopreneur persona and core expertise...' },
            { type: 'field', label: 'DOMAIN', value: 'venture-name.com', isItalic: true },
            { type: 'code-block', label: 'STARTING METRICS', value: '• Audience Size: 0\n• Monthly Revenue: $0\n• Product Count: 0\n• Burn Rate: $0/mo' }
        ]
    },
    {
        id: '2',
        title: 'PROBLEM',
        subtitle: 'Chapter 02',
        page: '02',
        description: 'Identify the specific friction point. Define the catalyst for change and the reason this autonomous entity was commissioned.',
        ref: 'REF: C-02',
        sections: [
            { type: 'list-box', label: 'PAIN TRIGGER', items: [
                '• Customer complaints about slow response times',
                '• Losing leads due to lack of follow-up',
                '• Manual data entry errors causing shipping delays'
            ]},
            { type: 'box', label: 'WHY THIS AGENT', value: 'Automating this process frees up 15 hours a week for strategic planning and eliminates human error in critical data handling.' }
        ]
    },
    {
        id: '3',
        title: 'EXEC\nUTION',
        subtitle: 'Chapter III',
        page: '042',
        quote: '"Implementation is the only metric that matters."',
        icon: 'bolt',
        sections: [
            { type: 'header', label: 'INPUTS USED', meta: 'CASE C: SOLOPRENEUR' },
            { type: 'code-block', value: '- Market Research\n- Competitor Analysis\n- Customer Interviews...' },
            { type: 'header', label: 'KEY DECISIONS' },
            { type: 'code-block', value: '- Selected tech stack: React/Node\n- Pricing model: Subscription\n- Launch date: Q3...' }
        ]
    },
    {
        id: '4',
        title: 'OUTCOME',
        subtitle: 'Chapter IV',
        page: '042',
        description: 'The measure of success is not in what is planned, but in what is realized.',
        subtext: 'CASE STUDY C',
        sections: [
            { type: 'header', label: 'RESULTS LOG' },
            { type: 'list-box', items: [
                '- 25% Increase in specific metric',
                '- Secured 3 new high-value contracts',
                '- Optimized workflow efficiency by 40%'
            ]},
            { type: 'header', label: 'TIME TO VALUE' },
            { type: 'stat', value: '14 Days', subtext: 'DURATION' }
        ]
    },
    {
        id: '5',
        title: 'VARIATIONS',
        subtitle: 'Chapter 05',
        page: '05',
        description: 'Assess cross-persona adaptability. Define how execution and outcomes would shift when applied to alternative organizational structures.',
        ref: 'REF: C-05',
        sections: [
            { type: 'header', label: 'WOULD DIFFER FOR', icon: 'share' },
            { type: 'list-box', items: [
                '• Enterprise Org: Requires strict security protocols and multi-level approvals before deployment.',
                '• Creative Agency: Emphasis shifts from automation to aesthetic output customization.',
                '• Startup Team: Prioritizes speed of iteration over comprehensive documentation.'
            ]}
        ]
    }
];

// --- DATA: BOOK D (SMALL TEAM / AGENCY) ---
const BOOK_D_CONTENT: ChapterContent[] = [
    {
        id: '1',
        title: 'SETUP',
        subtitle: 'Chapter 01',
        page: '01',
        description: 'Establish the operational baseline. Define the entity "Who", secure the digital territory "Domain", and set the initial coordinates "Metrics". Without a clear origin point, velocity cannot be measured.',
        ref: 'REF: D-01',
        sections: [
            { type: 'textarea', label: 'WHO', value: 'Boutique Design Agency specializing in digital brand identities...' },
            { type: 'field', label: 'DOMAIN', value: 'agency-studio.com', isItalic: true },
            { type: 'code-block', label: 'STARTING METRICS', value: '• Team Size: 5\n• Active Clients: 12\n• Avg Project Value: $15k\n• Overhead: $45k/mo' }
        ]
    },
    {
        id: '2',
        title: 'PROBLEM',
        subtitle: 'Chapter 02',
        page: '02',
        description: 'Identify the specific friction point. Define the catalyst for change and the reason this autonomous entity was commissioned.',
        ref: 'REF: D-02',
        sections: [
            { type: 'list-box', label: 'PAIN TRIGGER', items: [
                '• Account managers spending 40% of time on status updates',
                '• Asset handoff delays causing bottlenecks',
                '• Inconsistent quality control across junior designers'
            ]},
            { type: 'box', label: 'WHY THIS AGENT', value: 'Centralizing client communication and asset validation reduces non-billable hours by 30% and standardizes output quality.' }
        ]
    },
    {
        id: '3',
        title: 'EXEC\nUTION',
        subtitle: 'Chapter III',
        page: '042',
        quote: '"Implementation is the only metric that matters."',
        icon: 'bolt',
        sections: [
            { type: 'header', label: 'INPUTS USED', meta: 'CASE D: AGENCY' },
            { type: 'code-block', value: '- Client Onboarding Forms\n- Slack/Discord Channels\n- Figma/Drive API Activity' },
            { type: 'header', label: 'KEY DECISIONS' },
            { type: 'code-block', value: '- Role-based access control (RBAC)\n- Human-in-the-loop approval gates\n- Weekly automated digest for clients' }
        ]
    },
    {
        id: '4',
        title: 'OUTCOME',
        subtitle: 'Chapter IV',
        page: '042',
        description: 'The measure of success is not in what is planned, but in what is realized.',
        subtext: 'CASE STUDY D',
        sections: [
            { type: 'header', label: 'RESULTS LOG' },
            { type: 'list-box', items: [
                '- Reduced PM overhead by 15 hours/week',
                '- Client satisfaction score increased to 9.2/10',
                '- Zero missed asset handoffs in Q4'
            ]},
            { type: 'header', label: 'TIME TO VALUE' },
            { type: 'stat', value: '21 Days', subtext: 'DURATION' }
        ]
    },
    {
        id: '5',
        title: 'VARIATIONS',
        subtitle: 'Chapter 05',
        page: '05',
        description: 'Assess cross-persona adaptability. Define how execution and outcomes would shift when applied to alternative organizational structures.',
        ref: 'REF: D-05',
        sections: [
            { type: 'header', label: 'WOULD DIFFER FOR', icon: 'share' },
            { type: 'list-box', items: [
                '• Solopreneur: Overkill; too many approval steps and role separations.',
                '• Large Enterprise: Needs single-sign-on (SSO) and extensive audit logging.',
                '• E-commerce: Focus shifts from approvals to inventory and fulfillment management.'
            ]}
        ]
    }
];

// --- DATA: BOOK E (VC-BACKED SAAS) ---
const BOOK_E_CONTENT: ChapterContent[] = [
    {
        id: '1',
        title: 'SETUP',
        subtitle: 'Chapter 01',
        page: '01',
        description: 'Establish the operational baseline. Define the entity "Who", secure the digital territory "Domain", and set the initial coordinates "Metrics". Without a clear origin point, velocity cannot be measured.',
        ref: 'REF: E-01',
        sections: [
            { type: 'textarea', label: 'WHO', value: 'Series A Fintech scaling customer support operations...' },
            { type: 'field', label: 'DOMAIN', value: 'fintech-scale.io', isItalic: true },
            { type: 'code-block', label: 'STARTING METRICS', value: '• Active Users: 50k\n• Support Tickets: 2k/day\n• Team Size: 12 Agents\n• CSAT Score: 3.2/5' }
        ]
    },
    {
        id: '2',
        title: 'PROBLEM',
        subtitle: 'Chapter 02',
        page: '02',
        description: 'Identify the specific friction point. Define the catalyst for change and the reason this autonomous entity was commissioned.',
        ref: 'REF: E-02',
        sections: [
            { type: 'list-box', label: 'PAIN TRIGGER', items: [
                '• Response times exceeding 24 hours during peak volumes',
                '• High churn due to unresolved technical issues',
                '• Agent burnout leading to 40% staff turnover'
            ]},
            { type: 'box', label: 'WHY THIS AGENT', value: 'Deploying a Tier-1 autonomous support agent handles 70% of routine queries instantly, allowing humans to focus on complex cases.' }
        ]
    },
    {
        id: '3',
        title: 'EXEC\nUTION',
        subtitle: 'Chapter III',
        page: '042',
        quote: '"Implementation is the only metric that matters."',
        icon: 'bolt',
        sections: [
            { type: 'header', label: 'INPUTS USED', meta: 'CASE E: HIGH GROWTH' },
            { type: 'code-block', value: '- Historical Ticket Data (Zendesk)\n- Knowledge Base Articles (Notion)\n- Technical Documentation' },
            { type: 'header', label: 'KEY DECISIONS' },
            { type: 'code-block', value: '- Hybrid handoff model (AI -> Human)\n- Sentiment analysis routing\n- Automated refund processing < $50' }
        ]
    },
    {
        id: '4',
        title: 'OUTCOME',
        subtitle: 'Chapter IV',
        page: '042',
        description: 'The measure of success is not in what is planned, but in what is realized.',
        subtext: 'CASE STUDY E',
        sections: [
            { type: 'header', label: 'RESULTS LOG' },
            { type: 'list-box', items: [
                '- Response time dropped to < 30 seconds',
                '- CSAT Score improved to 4.6/5',
                '- Support costs reduced by 60%'
            ]},
            { type: 'header', label: 'TIME TO VALUE' },
            { type: 'stat', value: '30 Days', subtext: 'DURATION' }
        ]
    },
    {
        id: '5',
        title: 'VARIATIONS',
        subtitle: 'Chapter 05',
        page: '05',
        description: 'Assess cross-persona adaptability. Define how execution and outcomes would shift when applied to alternative organizational structures.',
        ref: 'REF: E-05',
        sections: [
            { type: 'header', label: 'WOULD DIFFER FOR', icon: 'share' },
            { type: 'list-box', items: [
                '• Healthcare: Requires HIPAA compliance and strictly bounded responses.',
                '• E-commerce: Focuses on order tracking and returns rather than technical debug.',
                '• Enterprise: Needs on-premise deployment and custom SLAs.'
            ]}
        ]
    }
];

// --- DATA: BOOK F (ENTERPRISE) ---
const BOOK_F_CONTENT: ChapterContent[] = [
    {
        id: '1',
        title: 'SETUP',
        subtitle: 'Chapter 01',
        page: '01',
        description: 'Establish the operational baseline. Define the entity "Who", secure the digital territory "Domain", and set the initial coordinates "Metrics". Without a clear origin point, velocity cannot be measured.',
        ref: 'REF: F-01',
        sections: [
            { type: 'textarea', label: 'WHO', value: 'Define the enterprise unit and core directive...' },
            { type: 'field', label: 'DOMAIN', value: 'corp-domain.com', isItalic: true },
            { type: 'code-block', label: 'STARTING METRICS', value: '• Global Headcount: 500+\n• Data Silos: 12\n• Compliance Risk: High\n• Annual Budget: $2M+' }
        ]
    },
    {
        id: '2',
        title: 'PROBLEM',
        subtitle: 'Chapter 02',
        page: '02',
        description: 'Identify the specific friction point. Define the catalyst for change and the reason this autonomous entity was commissioned.',
        ref: 'REF: F-02',
        sections: [
            { type: 'list-box', label: 'PAIN TRIGGER', items: [
                '• Data fragmentation across legacy systems (SAP, Oracle)',
                '• Slow decision making due to manual reporting',
                '• High cost of compliance audits'
            ]},
            { type: 'box', label: 'WHY THIS AGENT', value: 'Unifying data streams into a single source of truth reduces audit time by 80% and enables real-time executive dashboards.' }
        ]
    },
    {
        id: '3',
        title: 'EXEC\nUTION',
        subtitle: 'Chapter III',
        page: '042',
        quote: '"Implementation is the only metric that matters."',
        icon: 'bolt',
        sections: [
            { type: 'header', label: 'INPUTS USED', meta: 'CASE F: ENTERPRISE' },
            { type: 'code-block', value: '• Data Lake (Snowflake/BigQuery)\n• Internal API Gateway\n• SSO / LDAP Directory' },
            { type: 'header', label: 'KEY DECISIONS' },
            { type: 'code-block', value: '• Private VPC deployment\n• Role-Based Access Control (RBAC) Level 3\n• Human-in-the-loop for financial transactions > $10k' }
        ]
    },
    {
        id: '4',
        title: 'OUTCOME',
        subtitle: 'Chapter IV',
        page: '042',
        description: 'The measure of success is not in what is planned, but in what is realized.',
        subtext: 'CASE STUDY F',
        sections: [
            { type: 'header', label: 'RESULTS LOG' },
            { type: 'list-box', items: [
                '• Automated 95% of weekly reporting',
                '• Reduced compliance risk profile by 40%',
                '• Saved $450k in annual analyst hours'
            ]},
            { type: 'header', label: 'TIME TO VALUE' },
            { type: 'stat', value: '60 Days', subtext: 'DURATION' }
        ]
    },
    {
        id: '5',
        title: 'VARIATIONS',
        subtitle: 'Chapter 05',
        page: '05',
        description: 'Assess cross-persona adaptability. Define how execution and outcomes would shift when applied to alternative organizational structures.',
        ref: 'REF: F-05',
        sections: [
            { type: 'header', label: 'WOULD DIFFER FOR', icon: 'share' },
            { type: 'list-box', items: [
                '• Startup: Too complex; enterprise requires heavy security/governance layers.',
                '• Agency: Enterprise focuses on internal efficiency, Agency on client output.',
                '• Solopreneur: Complete overkill in terms of infrastructure cost.'
            ]}
        ]
    }
];

// --- DATA: BOOK G (NONPROFIT MISSION) ---
const BOOK_G_CONTENT: ChapterContent[] = [
    {
        id: '1',
        title: 'SETUP',
        subtitle: 'Chapter 01',
        page: '01',
        description: 'Establish the operational baseline. Define the entity "Who", secure the digital territory "Domain", and set the initial coordinates "Metrics". Without a clear origin point, velocity cannot be measured.',
        ref: 'REF: G-01',
        sections: [
            { type: 'textarea', label: 'WHO', value: 'Define the nonprofit mission and beneficiary group...' },
            { type: 'field', label: 'DOMAIN', value: 'nonprofit-org.org', isItalic: true },
            { type: 'code-block', label: 'STARTING METRICS', value: '• Donors: 1.2k\n• Volunteers: 50\n• Ops Cost: $150k/yr\n• Impact Reach: Local' }
        ]
    },
    {
        id: '2',
        title: 'PROBLEM',
        subtitle: 'Chapter 02',
        page: '02',
        description: 'Identify the specific friction point. Define the catalyst for change and the reason this autonomous entity was commissioned.',
        ref: 'REF: G-02',
        sections: [
            { type: 'list-box', label: 'PAIN TRIGGER', items: [
                '• Donor retention dropping due to lack of engagement',
                '• Manual grant writing consuming 60% of director\'s time',
                '• Inconsistent volunteer coordination'
            ]},
            { type: 'box', label: 'WHY THIS AGENT', value: 'Automating donor updates and grant drafts recovers 20 hours/week for field work and beneficiary impact.' }
        ]
    },
    {
        id: '3',
        title: 'EXEC\nUTION',
        subtitle: 'Chapter III',
        page: '042',
        quote: '"Implementation is the only metric that matters."',
        icon: 'bolt',
        sections: [
            { type: 'header', label: 'INPUTS USED', meta: 'CASE G: NONPROFIT' },
            { type: 'code-block', value: '• Donor CRM Database\n• Impact Stories (Field Notes)\n• Grant Requirements (PDFs)' },
            { type: 'header', label: 'KEY DECISIONS' },
            { type: 'code-block', value: '• Privacy-first data handling (PII redaction)\n• Tone calibration: Empathetic & Urgent\n• Multi-channel output (Email + SMS)' }
        ]
    },
    {
        id: '4',
        title: 'OUTCOME',
        subtitle: 'Chapter IV',
        page: '042',
        description: 'The measure of success is not in what is planned, but in what is realized.',
        subtext: 'CASE STUDY G',
        sections: [
            { type: 'header', label: 'RESULTS LOG' },
            { type: 'list-box', items: [
                '• 30% Increase in recurring donations',
                '• Secured 2 major grants ($50k+)',
                '• Volunteer show-up rate improved by 25%'
            ]},
            { type: 'header', label: 'TIME TO VALUE' },
            { type: 'stat', value: '45 Days', subtext: 'DURATION' }
        ]
    },
    {
        id: '5',
        title: 'VARIATIONS',
        subtitle: 'Chapter 05',
        page: '05',
        description: 'Assess cross-persona adaptability. Define how execution and outcomes would shift when applied to alternative organizational structures.',
        ref: 'REF: G-05',
        sections: [
            { type: 'header', label: 'WOULD DIFFER FOR', icon: 'share' },
            { type: 'list-box', items: [
                '• Political Campaign: Focus shifts to voter mobilization and rapid polling data.',
                '• Educational Inst: Needs LMS integration and student privacy compliance (FERPA).',
                '• Religious Org: Emphasis on community events and pastoral care scheduling.'
            ]}
        ]
    }
];

// --- DATA: BOOK H (MARKETPLACE) ---
const BOOK_H_CONTENT: ChapterContent[] = [
    {
        id: '1',
        title: 'SETUP',
        subtitle: 'Chapter 01',
        page: '01',
        description: 'Establish the operational baseline. Define the entity "Who", secure the digital territory "Domain", and set the initial coordinates "Metrics". Without a clear origin point, velocity cannot be measured.',
        ref: 'REF: H-01',
        sections: [
            { type: 'textarea', label: 'WHO', value: 'Define the marketplace operator vs participants...' },
            { type: 'field', label: 'DOMAIN', value: 'platform-market.com', isItalic: true },
            { type: 'code-block', label: 'STARTING METRICS', value: '• Sellers: 50\n• Buyers: 200\n• GMV: $5k/mo\n• Take Rate: 10%' }
        ]
    },
    {
        id: '2',
        title: 'PROBLEM',
        subtitle: 'Chapter 02',
        page: '02',
        description: 'Identify the specific friction point. Define the catalyst for change and the reason this autonomous entity was commissioned.',
        ref: 'REF: H-02',
        sections: [
            { type: 'list-box', label: 'PAIN TRIGGER', items: [
                '• Liquidity chicken-and-egg problem',
                '• Trust & Safety issues (fraud)',
                '• Manual seller onboarding bottlenecks'
            ]},
            { type: 'box', label: 'WHY THIS AGENT', value: 'Automating supply-side verification and demand-side matching accelerates the flywheel.' }
        ]
    },
    {
        id: '3',
        title: 'EXEC\nUTION',
        subtitle: 'Chapter III',
        page: '042',
        quote: '"Implementation is the only metric that matters."',
        icon: 'bolt',
        sections: [
            { type: 'header', label: 'INPUTS USED', meta: 'CASE H: PLATFORM' },
            { type: 'code-block', value: '• Seller Inventory Feeds\n• Buyer Search Patterns\n• Stripe Connect Webhooks' },
            { type: 'header', label: 'KEY DECISIONS' },
            { type: 'code-block', value: '• Escrow payment logic\n• Dispute resolution tier 1 automation\n• Dynamic fee structure' }
        ]
    },
    {
        id: '4',
        title: 'OUTCOME',
        subtitle: 'Chapter IV',
        page: '042',
        description: 'The measure of success is not in what is planned, but in what is realized.',
        subtext: 'CASE STUDY H',
        sections: [
            { type: 'header', label: 'RESULTS LOG' },
            { type: 'list-box', items: [
                '• 3x Faster seller activation',
                '• Reduced fraud attempts by 60%',
                '• GMV grew 20% MoM'
            ]},
            { type: 'header', label: 'TIME TO VALUE' },
            { type: 'stat', value: '50 Days', subtext: 'DURATION' }
        ]
    },
    {
        id: '5',
        title: 'VARIATIONS',
        subtitle: 'Chapter 05',
        page: '05',
        description: 'Assess cross-persona adaptability. Define how execution and outcomes would shift when applied to alternative organizational structures.',
        ref: 'REF: H-05',
        sections: [
            { type: 'header', label: 'WOULD DIFFER FOR', icon: 'share' },
            { type: 'list-box', items: [
                '• Gig Economy: Focus on scheduling and location tracking.',
                '• Digital Goods: Instant delivery, copyright checks.',
                '• B2B Marketplace: Invoicing, bulk orders, KYC.'
            ]}
        ]
    }
];

// --- DATA: BOOK I (CREATOR / COACH) ---
const BOOK_I_CONTENT: ChapterContent[] = [
    {
        id: '1',
        title: 'SETUP',
        subtitle: 'Chapter 01',
        page: '01',
        description: 'Establish the operational baseline. Define the entity "Who", secure the digital territory "Domain", and set the initial coordinates "Metrics". Without a clear origin point, velocity cannot be measured.',
        ref: 'REF: I-01',
        sections: [
            { type: 'textarea', label: 'WHO', value: 'Define the creator niche and authority mechanism...' },
            { type: 'field', label: 'DOMAIN', value: 'creator-brand.com', isItalic: true },
            { type: 'code-block', label: 'STARTING METRICS', value: '• Newsletter Subs: 500\n• Social Reach: 10k\n• Course Sales: $2k/mo\n• Ad Spend: $0' }
        ]
    },
    {
        id: '2',
        title: 'PROBLEM',
        subtitle: 'Chapter 02',
        page: '02',
        description: 'Identify the specific friction point. Define the catalyst for change and the reason this autonomous entity was commissioned.',
        ref: 'REF: I-02',
        sections: [
            { type: 'list-box', label: 'PAIN TRIGGER', items: [
                '• Content treadmill leading to burnout',
                '• High volume of DMs asking same questions',
                '• Inconsistent launch revenue'
            ]},
            { type: 'box', label: 'WHY THIS AGENT', value: 'Cloning the creator\'s brain into a 24/7 interactive mentor allows scaling impact without scaling time.' }
        ]
    },
    {
        id: '3',
        title: 'EXEC\nUTION',
        subtitle: 'Chapter III',
        page: '042',
        quote: '"Implementation is the only metric that matters."',
        icon: 'bolt',
        sections: [
            { type: 'header', label: 'INPUTS USED', meta: 'CASE I: CREATOR' },
            { type: 'code-block', value: '• YouTube Transcripts\n• Newsletter Archive\n• Paid Course Material (PDF/Video)' },
            { type: 'header', label: 'KEY DECISIONS' },
            { type: 'code-block', value: '• Gated access (Paid Subscribers only)\n• Voice synthesis using creator model\n• Funnel integration (Upsell to coaching)' }
        ]
    },
    {
        id: '4',
        title: 'OUTCOME',
        subtitle: 'Chapter IV',
        page: '042',
        description: 'The measure of success is not in what is planned, but in what is realized.',
        subtext: 'CASE STUDY I',
        sections: [
            { type: 'header', label: 'RESULTS LOG' },
            { type: 'list-box', items: [
                '• Passive course sales increased by 45%',
                '• Reduced DM time by 90%',
                '• Community engagement score up 3.5x'
            ]},
            { type: 'header', label: 'TIME TO VALUE' },
            { type: 'stat', value: '21 Days', subtext: 'DURATION' }
        ]
    },
    {
        id: '5',
        title: 'VARIATIONS',
        subtitle: 'Chapter 05',
        page: '05',
        description: 'Assess cross-persona adaptability. Define how execution and outcomes would shift when applied to alternative organizational structures.',
        ref: 'REF: I-05',
        sections: [
            { type: 'header', label: 'WOULD DIFFER FOR', icon: 'share' },
            { type: 'list-box', items: [
                '• Faceless Channel: Relies on aggregated data rather than personal authority.',
                '• High-Ticket Coach: Agent acts as an appointment setter rather than a mentor.',
                '• Newsletter Writer: Focus on research assistant and drafting rather than interaction.'
            ]}
        ]
    }
];

// --- DATA: BOOK J (LOCAL ENCYCLOPEDIA) ---
const BOOK_J_CONTENT: ChapterContent[] = [
    {
        id: '1',
        title: 'TERMS\nA-Z',
        subtitle: 'Dictionary Index',
        page: '042',
        sections: [
            { type: 'input-search', label: 'Dictionary Index', placeholder: 'SEARCH TERMS . . .' },
            { type: 'glossary-entry', term: 'Agent', def: 'An autonomous software entity capable of perceiving its environment and acting upon it to achieve specific goals within the Books OS ecosystem. Agents operate primarily within the Context Window.', tags: ['noun', 'core'], expanded: true },
            { type: 'glossary-entry', term: 'Broker', collapsed: true },
            { type: 'glossary-entry', term: 'Context Window', collapsed: true },
            { type: 'glossary-entry', term: 'Daemon', collapsed: true },
            { type: 'header', label: 'ADD TERM', icon: 'add_circle' },
            { type: 'input', label: 'TERM', placeholder: 'e.g. Hypervisor' },
            { type: 'textarea', label: 'DEFINITION', placeholder: 'Enter definition description...' },
            { type: 'button', label: 'COMMIT', icon: 'arrow_forward', align: 'right' }
        ]
    },
    {
        id: '2',
        title: 'BENCH\nMARKS',
        subtitle: 'Section 4.1',
        page: '042',
        quote: '"Standardization is the bedrock upon which the cathedral of code is built."',
        sections: [
            { type: 'header', label: 'INDUSTRY STANDARDS', meta: 'CONFIG' },
            { type: 'list-box', items: [
                '• SaaS CAC: $300-500',
                '• LTV / CAC Ratio: > 3:1',
                '• Gross Margin: 70-80%',
                '• Monthly Churn: < 1.0%',
                '• Net Revenue Retention: > 110%',
                '• Magic Number: 0.7 - 1.0'
            ]},
            { type: 'button', label: 'Confirm Standards', icon: 'check' }
        ]
    },
    {
        id: '3',
        title: 'TOOLS',
        subtitle: 'Chapter III',
        page: '042',
        quote: '"The instruments of knowledge curation and the architecture of thought."',
        sections: [
            { type: 'header', label: 'Tool Registry', meta: 'ACTIVE ENTRY' },
            { type: 'input', label: '01. TOOL NAME', placeholder: 'e.g. Semantic Search Engine' },
            { type: 'input', label: '02. SOURCE URL / ENDPOINT', placeholder: 'https://' },
            { type: 'textarea', label: '03. UTILITY CONTEXT (WHY USEFUL?)', placeholder: 'Describe the primary function and integration value of this tool within one sentence...' },
            { type: 'button', label: 'Save Entry', icon: 'arrow_forward', align: 'right' }
        ]
    },
    {
        id: '4',
        title: 'CROSS-\nREFS',
        subtitle: 'Chapter IV',
        page: '142',
        quote: '"The architecture of knowledge is built upon the invisible threads between thoughts."',
        sections: [
            { type: 'header', label: 'RELATED SHELVES', icon: 'menu_book' },
            { type: 'card-list', items: [
                { title: 'Cartography of Meaning', ref: 'REF-892', desc: 'Maps detailing the semantic drift of Book J\'s core terminology over the last decade.' },
                { title: 'Index of Names', ref: 'REF-104', desc: 'Comprehensive list of all entities referenced within the Local Encyclopedia bounds.' },
                { title: 'Syntax Guidelines', ref: 'REF-003', desc: 'Writing standards for contributing to the J-Series extensions.' }
            ]},
            { type: 'header', label: 'RELATED TOWERS', icon: 'domain' },
            { type: 'card-list', items: [
                { title: 'Tower YY', ref: 'EXTERNAL', desc: 'Shelf ZZ / Sector 4' },
                { title: 'Tower 7', ref: 'EXTERNAL', desc: 'Shelf A / Archives' }
            ]}
        ]
    }
];

export const BookOpenOverlay = ({ book, onClose }: Props) => {
    // Determine Content based on Letter
    const isBookA = book.spineLetter === 'A';
    const isBookB = book.spineLetter === 'B';
    const isBookC = book.spineLetter === 'C';
    const isBookD = book.spineLetter === 'D';
    const isBookE = book.spineLetter === 'E';
    const isBookF = book.spineLetter === 'F';
    const isBookG = book.spineLetter === 'G';
    const isBookH = book.spineLetter === 'H';
    const isBookI = book.spineLetter === 'I';
    const isBookJ = book.spineLetter === 'J';
    
    const chapters = isBookA ? BOOK_A_CONTENT : (isBookB ? BOOK_B_CONTENT : (isBookC ? BOOK_C_CONTENT : (isBookD ? BOOK_D_CONTENT : (isBookE ? BOOK_E_CONTENT : (isBookF ? BOOK_F_CONTENT : (isBookG ? BOOK_G_CONTENT : (isBookH ? BOOK_H_CONTENT : (isBookI ? BOOK_I_CONTENT : (isBookJ ? BOOK_J_CONTENT : [])))))))));
    
    // Default to Chapter 1 ("Identity" or "Default Next Steps")
    const [activeChapterId, setActiveChapterId] = useState<string | null>('1');

    const activeChapter = chapters.find(c => c.id === activeChapterId);

    // Helpers for rendering specific UI components from the spec
    const renderSection = (section: any, idx: number) => {
        switch(section.type) {
            // --- GENERIC / BOOK A TYPES ---
            case 'field':
            case 'input': // Re-using style for input
                return (
                    <div key={idx} className="mb-4">
                        <label className="block text-[10px] tracking-widest uppercase opacity-50 font-mono mb-1">{section.label}</label>
                        {section.type === 'input' ? (
                             <input 
                                type="text"
                                placeholder={section.placeholder}
                                className="w-full border border-[#333] bg-[#0A0A0A] p-3 font-serif text-lg text-[#F5F5DC] placeholder-[#333] focus:outline-none focus:border-[#D4AF37]"
                             />
                        ) : (
                            <div className={`border border-[#333] bg-[#0A0A0A] p-3 font-serif text-lg text-[#F5F5DC] ${section.isItalic ? 'italic text-[#666]' : ''}`}>{section.value}</div>
                        )}
                    </div>
                );
            case 'dropdown':
                 return (
                    <div key={idx} className="mb-4">
                        <label className="block text-[10px] tracking-widest uppercase opacity-50 font-mono mb-1">{section.label}</label>
                        <div className="border border-[#D4AF37] text-[#D4AF37] p-3 font-serif text-lg flex justify-between items-center">
                            {section.value}
                            <span className="text-xs">▼</span>
                        </div>
                    </div>
                );
            case 'box':
                return (
                     <div key={idx} className="mb-6">
                        <label className="block text-[10px] tracking-widest uppercase opacity-50 font-mono mb-1">{section.label}</label>
                        <div className="border border-[#333] bg-[#1a1a1a]/50 p-4 font-serif text-base leading-relaxed text-[#ccc]">
                            {section.value}
                        </div>
                    </div>
                );
             case 'list':
                return (
                     <div key={idx} className="mb-6 border border-[#333] p-4">
                        <ul className="space-y-2">
                            {section.items.map((item: string, i: number) => (
                                <li key={i} className="text-sm font-sans opacity-80 flex gap-2">
                                    <span className="opacity-50">•</span> {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                );
            case 'header':
                return (
                    <div key={idx} className="flex justify-between items-end border-b border-[#333] pb-2 mb-6 mt-6">
                         <div className="flex items-center gap-3">
                             {section.icon && <span className="material-symbols-outlined text-[#D4AF37] text-sm">{section.icon}</span>}
                             <h4 className="font-serif italic text-[#D4AF37] text-lg tracking-wide">{section.label}</h4>
                         </div>
                         {section.meta && (
                             <div className="flex items-center gap-2">
                                {section.active && <div className="w-1 h-1 bg-[#D4AF37] rounded-full animate-pulse"></div>}
                                <span className="font-mono text-[9px] tracking-widest uppercase opacity-50">{section.meta}</span>
                             </div>
                         )}
                    </div>
                );
            case 'param':
                return (
                    <div key={idx} className="grid grid-cols-12 gap-2 mb-4 font-mono text-xs border border-[#222] p-3 items-center hover:border-[#444] transition-colors">
                        <div className="col-span-5 text-[#F5F5DC]">{section.name}</div>
                        <div className="col-span-3 text-[#666]">{section.source || section.destination}</div>
                        <div className="col-span-4 text-right text-[#D4AF37]">{section.timing || section.latency}</div>
                    </div>
                );
            case 'code-list':
                 return (
                     <div key={idx} className="mb-6">
                        <label className="block text-[10px] tracking-widest uppercase opacity-50 font-mono mb-2">{section.label}</label>
                        <div className="border border-[#333] bg-[#050505] p-4 font-mono text-xs text-[#888] space-y-2">
                             {section.items.map((item: string, i: number) => <div key={i}>{item}</div>)}
                        </div>
                    </div>
                );
            case 'box-code':
                 return (
                     <div key={idx} className="mb-6 border border-[#333] p-4 font-mono text-xs text-[#888] space-y-2">
                         <div className="text-[#D4AF37] mb-2 text-[10px] tracking-widest uppercase flex gap-2 items-center">
                             <span className="material-symbols-outlined text-[10px]">list</span>
                             {section.label}
                         </div>
                         {section.items.map((item: string, i: number) => <div key={i}>{item}</div>)}
                     </div>
                );
            case 'grid-fields':
                return (
                    <div key={idx} className="grid grid-cols-2 gap-4 mt-8">
                        {section.fields.map((f: any, i: number) => (
                            <div key={i}>
                                <label className="block text-[9px] tracking-widest uppercase text-[#D4AF37] font-mono mb-2">{f.label}</label>
                                <div className="border border-[#333] p-3 font-mono text-sm">{f.value}</div>
                            </div>
                        ))}
                    </div>
                );

            // --- BOOK B TYPES (CUSTOM) ---
            case 'agent-config':
                return (
                    <div key={idx} className="mb-8 p-1">
                        <label className="block text-[9px] tracking-widest uppercase opacity-50 font-mono mb-2">{section.nameLabel}</label>
                        <div className={`border ${section.placeholder ? 'border-[#333] text-[#444]' : 'border-[#444] text-[#F5F5DC]'} p-4 mb-4 font-mono text-sm bg-[#050505]`}>
                            {section.nameValue}
                        </div>
                        <label className="block text-[9px] tracking-widest uppercase opacity-50 font-mono mb-2">REQUIRED OUTPUT FIELDS</label>
                        <div className={`border ${section.placeholder ? 'border-[#222]' : 'border-[#333]'} p-4 bg-[#0a0a0a]`}>
                            <ul className="space-y-2">
                                {section.outputs.map((o: string, i: number) => (
                                    <li key={i} className={`text-sm ${section.placeholder ? 'text-[#333] italic' : 'text-[#ccc]'}`}>• {o}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                );
            case 'code-block':
                return (
                    <div key={idx} className="mb-6">
                        {section.label && <label className="block text-[9px] tracking-widest uppercase opacity-50 font-mono mb-2">{section.label}</label>}
                        <div className="bg-[#050505] border border-[#333] p-4 font-mono text-xs text-[#888] whitespace-pre-wrap leading-relaxed">
                            {section.value}
                        </div>
                    </div>
                );
            case 'button':
                return (
                    <div key={idx} className={`w-full flex ${section.align === 'right' ? 'justify-end' : ''}`}>
                        <button className={`${section.align === 'right' ? 'w-auto px-8' : 'w-full'} border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-colors py-4 font-mono text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-3`}>
                            {section.label}
                            {section.icon && <span className="material-symbols-outlined text-sm">{section.icon}</span>}
                        </button>
                    </div>
                );
            case 'feeder-list':
                return (
                    <div key={idx} className="space-y-6 mb-8">
                        {section.items.map((item: any, i: number) => (
                            <div key={i} className="pl-4 border-l-2 border-[#D4AF37]/30">
                                <h5 className="text-[#F5F5DC] font-sans font-medium text-sm mb-1">{item.name}</h5>
                                <p className="text-[#666] text-xs leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                );
            case 'split-fields':
                return (
                    <div key={idx} className="grid grid-cols-2 gap-4 mb-6">
                        {section.fields.map((f: any, i: number) => (
                            <div key={i}>
                                <label className="block text-[9px] tracking-widest uppercase opacity-50 font-mono mb-2">{f.label}</label>
                                <div className={`border border-[#333] bg-[#050505] p-3 font-mono text-sm ${f.isDropdown ? 'flex justify-between items-center' : ''}`}>
                                    {f.value}
                                    {f.isDropdown && <span className="text-[10px] opacity-50">▼</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                );
            case 'step-list':
                return (
                    <div key={idx} className="space-y-3 mb-6">
                        {section.items.map((item: any, i: number) => (
                            <div key={i} className={`border ${item.placeholder ? 'border-[#222] border-dashed' : 'border-[#333]'} p-3 flex gap-4 items-center`}>
                                <span className={`font-mono text-xs ${item.placeholder ? 'text-[#333]' : 'text-[#D4AF37]'}`}>{item.id}</span>
                                <span className={`font-mono text-sm ${item.placeholder ? 'text-[#333] italic' : 'text-[#ccc]'}`}>{item.text}</span>
                                {item.active && (
                                    <div className="ml-auto flex gap-2">
                                        <div className="w-2 h-2 rounded-full bg-[#D4AF37]"></div>
                                    </div>
                                )}
                            </div>
                        ))}
                        {/* Custom Footer for this specific section */}
                         <div className="pt-6 flex justify-end">
                            <button className="bg-[#D4AF37] text-black font-mono text-xs font-bold px-4 py-3 flex gap-2 items-center hover:bg-[#F5F5DC]">
                                <span className="material-symbols-outlined text-sm">save</span>
                                SAVE CONFIGURATION
                            </button>
                        </div>
                    </div>
                );

            // --- BOOK C/D/E/F/G/H/I/J TYPES (CUSTOM) ---
            case 'textarea':
                return (
                    <div key={idx} className="mb-6">
                        <label className="block text-[9px] tracking-widest uppercase opacity-50 font-mono mb-2 flex gap-2 items-center">
                            {section.label !== 'DEFINITION' && section.label !== '03. UTILITY CONTEXT (WHY USEFUL?)' && <span className="material-symbols-outlined text-[10px]">fingerprint</span>}
                            {section.label}
                        </label>
                        <textarea 
                            className="w-full border border-[#444] bg-[#0a0a0a] p-4 h-32 text-[#F5F5DC] font-serif text-lg opacity-90 focus:outline-none focus:border-[#D4AF37] resize-none"
                            defaultValue={section.value}
                            placeholder={section.placeholder}
                        />
                    </div>
                );
            case 'list-box':
                return (
                    <div key={idx} className="mb-6">
                        {section.label && <label className="block text-[9px] tracking-widest uppercase opacity-50 font-mono mb-2 flex gap-2 items-center">
                            <span className="material-symbols-outlined text-[10px]">warning</span>
                            {section.label}
                        </label>}
                        <div className="border border-[#333] bg-[#080808] p-4">
                            <ul className="space-y-2">
                                {section.items.map((item: string, i: number) => (
                                    <li key={i} className="text-sm text-[#ccc] font-mono leading-relaxed">{item}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                );
             case 'stat':
                return (
                    <div key={idx} className="mb-6 border-b border-[#333] pb-6">
                        <div className="text-5xl font-serif text-[#D4AF37] mb-2">{section.value}</div>
                         <div className="font-mono text-[9px] tracking-widest uppercase text-[#444]">{section.subtext}</div>
                    </div>
                );
                
            // --- BOOK J TYPES ---
            case 'input-search':
                return (
                    <div key={idx} className="mb-8">
                        <label className="block text-[9px] tracking-widest uppercase text-[#D4AF37] font-mono mb-2">{section.label}</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#666] material-symbols-outlined text-sm">search</span>
                            <input 
                                className="w-full bg-[#0a0a0a] border border-[#333] py-3 pl-12 pr-4 font-mono text-sm text-[#F5F5DC] placeholder-[#444] focus:border-[#D4AF37] focus:outline-none"
                                placeholder={section.placeholder}
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#333] text-[9px] border border-[#333] px-1 rounded">RET</span>
                        </div>
                    </div>
                );
            case 'glossary-entry':
                return (
                    <div key={idx} className={`mb-3 border border-[#333] bg-[#080808] ${section.collapsed ? 'opacity-70' : 'opacity-100 border-[#444]'}`}>
                        <div className="flex justify-between items-center p-4 cursor-pointer hover:bg-[#111] transition-colors">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-[#D4AF37] text-xs">bookmark</span>
                                <span className="font-serif text-xl text-[#F5F5DC] italic">{section.term}</span>
                            </div>
                            <span className="material-symbols-outlined text-[#666] text-sm">{section.collapsed ? 'expand_more' : 'expand_less'}</span>
                        </div>
                        {section.expanded && (
                            <div className="p-4 pt-0 border-t border-[#222]">
                                <p className="font-sans text-sm text-[#ccc] leading-relaxed mt-4 mb-4">{section.def}</p>
                                <div className="flex gap-2">
                                    {section.tags.map((tag: string, i: number) => (
                                        <span key={i} className="text-[9px] font-mono uppercase tracking-wider text-[#666] border border-[#333] px-2 py-1 rounded-sm">{tag}</span>
                                    ))}
                                    <button className="ml-auto text-[9px] font-mono uppercase tracking-wider text-[#D4AF37] flex items-center gap-1">
                                        EDIT <span className="material-symbols-outlined text-[10px]">edit</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                );
            case 'card-list':
                return (
                    <div key={idx} className="space-y-3 mb-8">
                        {section.items.map((item: any, i: number) => (
                            <div key={i} className="border border-[#333] p-4 bg-[#0a0a0a] group hover:border-[#D4AF37] transition-colors cursor-pointer">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-sans font-bold text-[#F5F5DC] text-sm">{item.title}</h4>
                                    <span className="text-[9px] font-mono text-[#D4AF37] tracking-widest">{item.ref}</span>
                                </div>
                                <p className="text-xs text-[#888] font-mono leading-relaxed">{item.desc}</p>
                                <div className="mt-2 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="material-symbols-outlined text-[#D4AF37] text-sm">open_in_new</span>
                                </div>
                            </div>
                        ))}
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-8 bg-black/95 backdrop-blur-md animate-fade-in">
            {/* Main Container */}
            <div className="relative w-full max-w-[1200px] aspect-[1.6/1] flex shadow-2xl rounded-sm overflow-hidden border border-[#222]">
                
                {/* Background Grid Pattern */}
                <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" 
                     style={{ backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
                </div>

                {/* Spine Shadow */}
                <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-32 bg-gradient-to-r from-black/0 via-black/80 to-black/0 pointer-events-none z-30"></div>
                <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-px bg-[#111] z-30"></div>

                {/* LEFT PAGE - Cover / Title Area */}
                <div className="w-1/2 relative bg-[#121212] flex flex-col items-center justify-center p-12 border-r border-[#1a1a1a]">
                    <div className="w-full max-w-[400px] border border-[#F5F5DC]/20 h-full p-8 flex flex-col items-center justify-center relative">
                        {/* Corner Accents */}
                        <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-[#D4AF37]"></div>
                        <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-[#D4AF37]"></div>
                        <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-[#D4AF37]"></div>
                        <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-[#D4AF37]"></div>

                        {activeChapter ? (
                            <div className="text-center animate-fade-in w-full">
                                <p className="font-mono text-[10px] tracking-[0.3em] text-[#666] mb-8 uppercase">{activeChapter.subtitle}</p>
                                <h1 className="font-serif text-5xl md:text-6xl text-[#D4AF37] mb-8 whitespace-pre-line leading-tight">
                                    {activeChapter.title}
                                </h1>
                                {activeChapter.subtext && (
                                     <p className="font-serif italic text-[#666] mb-8">{activeChapter.subtext}</p>
                                )}
                                {activeChapter.icon && (
                                     <span className="material-symbols-outlined text-6xl text-[#222] mb-8">{activeChapter.icon}</span>
                                )}
                                
                                <div className="w-12 h-px bg-[#D4AF37]/50 mx-auto mb-8"></div>
                                
                                {activeChapter.quote && (
                                    <p className="font-serif italic text-[#F5F5DC] opacity-70 text-sm leading-7 max-w-[280px] mx-auto">
                                        {activeChapter.quote}
                                    </p>
                                )}
                                {activeChapter.description && (
                                     <p className="font-mono text-xs text-[#888] leading-relaxed max-w-[280px] mx-auto mt-8">
                                        {activeChapter.description}
                                     </p>
                                )}
                                
                                {activeChapter.buttons && (
                                    <div className="flex gap-4 justify-center mt-8">
                                        {activeChapter.buttons.map(btn => (
                                            <div key={btn} className="border border-[#333] px-3 py-1 font-mono text-[10px] text-[#666] uppercase tracking-wider">{btn}</div>
                                        ))}
                                    </div>
                                )}

                                {activeChapter.ref && (
                                    <p className="font-mono text-[9px] tracking-widest text-[#444] mt-16 uppercase">{activeChapter.ref}</p>
                                )}
                                
                                <div className="absolute bottom-4 left-0 right-0 text-center text-[10px] font-mono text-[#333]">
                                    {activeChapter.page}
                                </div>
                            </div>
                        ) : (
                            <div className="text-center">
                                <h1 className="font-serif text-6xl text-[#D4AF37] mb-4">INDEX</h1>
                                <div className="w-12 h-px bg-[#D4AF37] mx-auto"></div>
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT PAGE - Content / Form Area */}
                <div className="w-1/2 relative bg-[#121212] p-12 overflow-y-auto custom-scrollbar">
                    <div className="w-full max-w-[420px] mx-auto h-full flex flex-col">
                        
                        <div className="flex-1 mt-8">
                            {activeChapter ? (
                                <div className="animate-fade-in">
                                    {activeChapter.sections.map((section, idx) => renderSection(section, idx))}
                                </div>
                            ) : (
                                <nav className="space-y-8 mt-12">
                                     {chapters.map((chapter) => (
                                        <button 
                                            key={chapter.id}
                                            onClick={() => setActiveChapterId(chapter.id)}
                                            className="w-full text-left group border-b border-[#222] pb-4 hover:border-[#D4AF37] transition-colors"
                                        >
                                            <div className="flex justify-between items-end mb-2">
                                                <span className="font-serif text-xl text-[#F5F5DC] group-hover:text-[#D4AF37] transition-colors">
                                                    {chapter.title.replace('\n', ' ')}
                                                </span>
                                                <span className="font-mono text-xs text-[#444]">{chapter.page}</span>
                                            </div>
                                            <span className="font-mono text-[10px] tracking-widest text-[#666] uppercase">{chapter.subtitle}</span>
                                        </button>
                                     ))}
                                </nav>
                            )}
                        </div>

                        {/* Action Bar */}
                        <div className="mt-12 pt-6 border-t border-[#222] flex justify-between items-center">
                             <div className="font-mono text-[9px] tracking-widest text-[#444] uppercase">
                                 {activeChapter ? `CONFIG SCHEMA: V2.1` : `TERMINAL: 0X4F2A`}
                             </div>
                             
                             {/* Generic Save Button (omitted if chapter has specific actions like B.4 or custom buttons) */}
                             {activeChapter && activeChapter.id !== '4' && !activeChapter.sections.some(s => s.type === 'button') && (
                                 <button className="bg-[#D4AF37] text-black font-mono text-xs font-bold px-6 py-3 hover:bg-[#F5F5DC] transition-colors flex gap-2 items-center">
                                     <span className="material-symbols-outlined text-sm">save</span>
                                     SAVE RECORD
                                 </button>
                             )}
                        </div>

                        {/* Page Number */}
                        <div className="text-right mt-4 text-[10px] font-mono text-[#333]">
                            {activeChapter ? (parseInt(activeChapter.page) + 1).toString().padStart(3, '0') : '000'}
                        </div>
                    </div>
                </div>

                {/* Global Controls */}
                <button 
                    onClick={onClose}
                    className="absolute top-6 right-6 text-[#444] hover:text-[#D4AF37] transition-colors z-50"
                >
                    <span className="material-symbols-outlined text-3xl">close</span>
                </button>

                {/* Back Button (Only if deep) */}
                {activeChapter && (
                    <button 
                        onClick={() => setActiveChapterId(null)} // Go to Index
                        className="absolute top-6 left-6 text-[#444] hover:text-[#D4AF37] transition-colors z-50 flex items-center gap-2"
                    >
                         <span className="material-symbols-outlined text-xl">arrow_back</span>
                         <span className="font-mono text-[10px] tracking-widest uppercase">Index</span>
                    </button>
                )}

                {/* Navigation Arrows */}
                {activeChapter && (
                    <>
                        <button 
                            onClick={() => {
                                const idx = chapters.findIndex(c => c.id === activeChapterId);
                                if (idx > 0) setActiveChapterId(chapters[idx - 1].id);
                            }}
                            className={`absolute left-4 top-1/2 -translate-y-1/2 text-[#333] hover:text-[#D4AF37] transition-colors ${activeChapterId === '1' ? 'opacity-0 pointer-events-none' : ''}`}
                        >
                            <span className="material-symbols-outlined text-4xl">chevron_left</span>
                        </button>
                         <button 
                            onClick={() => {
                                const idx = chapters.findIndex(c => c.id === activeChapterId);
                                if (idx < chapters.length - 1) setActiveChapterId(chapters[idx + 1].id);
                            }}
                            className={`absolute right-4 top-1/2 -translate-y-1/2 text-[#333] hover:text-[#D4AF37] transition-colors ${activeChapterId === '4' ? 'opacity-0 pointer-events-none' : ''}`}
                        >
                            <span className="material-symbols-outlined text-4xl">chevron_right</span>
                        </button>
                    </>
                )}

            </div>
            
             {/* Books OS Footer */}
            <div className="fixed bottom-0 left-0 w-full p-4 border-t border-[#222] bg-black text-[#444] font-mono text-[10px] tracking-[0.2em] flex justify-between z-40">
                <div className="flex gap-2 items-center">
                    <div className="w-2 h-2 rounded-full bg-[#222]"></div>
                    SYSTEM ONLINE
                </div>
                <div>COPYRIGHT 2024 BOOKS OS</div>
            </div>
        </div>
    );
};