// Ensign Connect Navigator - Client Application Logic

const STORAGE_KEY = 'ensign_connect_navigator_state_v1';

let appConfig = null;
let state = {
  currentStep: 0,
  checked: {}
};

// Default Checklist Items across the 5 steps (Always displayed on left sidebar)
const CHECKLIST_ITEMS = [
  // Stage 1
  { id: "s1_video", step: 0, title: "Watch starter video guide", desc: "Play the in-app video guide." },
  { id: "s1_platform", step: 0, title: "Choose access method", desc: "Web browser or mobile app." },
  // Stage 2
  { id: "s2_join_btn", step: 1, title: "Click \"Join Now\" / \"Sign Up\"", desc: "Go to Ensign Connect portal." },
  { id: "s2_sso", step: 1, title: "Sign in with School ID (SSO)", desc: "NetID bypasses approval queue." },
  { id: "s2_profile", step: 1, title: "Complete profile details", desc: "Confirm major, grad year, goals." },
  // Stage 3
  { id: "s3_find_groups", step: 2, title: "Open Ensign Major Groups", desc: "Select Ensign College under Schools." },
  { id: "s3_join_group", step: 2, title: "Join your major group", desc: "Click the green Join button." },
  { id: "s3_explore_tabs", step: 2, title: "Explore Members & Discussion", desc: "Check peers, faculty, and discussion." },
  // Stage 4
  { id: "s4_sms_phone", step: 3, title: "Open Notification Preferences", desc: "Add phone number and enable SMS alerts." },
  // Stage 5
  { id: "s5_browse_alumni", step: 4, title: "Browse Ensign Alumni Directory", desc: "Filter by industry, employer, or degree." },
  { id: "s5_review_questions", step: 4, title: "Review Interview Tip Guides", desc: "Check the 3 official PDF handouts." },
  { id: "s5_send_message", step: 4, title: "Generate & send outreach message", desc: "Send an invitation to connect." }
];

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  loadState();
  setupNavigation();
  setupChecklistInteractions();
  setupOutreachGenerator();
  await fetchConfig();
  renderChecklist();
  updateProgress();
  renderMajorGroups('');
});

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      state.currentStep = parsed.currentStep || 0;
      state.checked = parsed.checked || {};
    }
  } catch (e) {
    console.warn('Could not load saved state', e);
  }
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Could not save state', e);
  }
}

async function fetchConfig() {
  try {
    const res = await fetch('api/config');
    if (res.ok) {
      appConfig = await res.json();
    }
  } catch (e) {
    console.warn('Using offline config fallback', e);
  }
}

function setupNavigation() {
  const stepBtns = document.querySelectorAll('.nav-step-btn');
  const sections = document.querySelectorAll('.step-section');

  stepBtns.forEach((btn, index) => {
    btn.addEventListener('click', () => {
      goToStep(index);
    });
  });

  document.querySelectorAll('[data-next-step]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (state.currentStep < 4) {
        goToStep(state.currentStep + 1);
      }
    });
  });

  document.querySelectorAll('[data-prev-step]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (state.currentStep > 0) {
        goToStep(state.currentStep - 1);
      }
    });
  });
}

function goToStep(stepIndex) {
  state.currentStep = stepIndex;
  saveState();

  const stepBtns = document.querySelectorAll('.nav-step-btn');
  const sections = document.querySelectorAll('.step-section');
  const groups = document.querySelectorAll('.sidebar-step-group');

  stepBtns.forEach((b, i) => {
    b.classList.toggle('active', i === stepIndex);
  });

  sections.forEach((s, i) => {
    s.classList.toggle('active', i === stepIndex);
  });

  groups.forEach((g, i) => {
    g.classList.toggle('active', i === stepIndex);
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });
}
window.goToStep = goToStep;

function setupChecklistInteractions() {
  const searchInput = document.getElementById('group-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      renderMajorGroups(e.target.value.toLowerCase());
    });
  }

  const smsPrefLink = document.getElementById('sms-pref-link');
  if (smsPrefLink) {
    smsPrefLink.addEventListener('click', () => {
      state.smsOpened = true;
      state.checked['s4_sms_phone'] = true;
      saveState();
      renderChecklist();
      updateProgress();
    });
  }
}

function renderChecklist() {
  CHECKLIST_ITEMS.forEach(item => {
    const container = document.getElementById(`checklist-step-${item.step}`);
    if (!container) return;

    // Check if element already rendered
    let el = document.getElementById(`check-${item.id}`);
    const isChecked = Boolean(state.checked[item.id]);

    if (!el) {
      el = document.createElement('div');
      el.id = `check-${item.id}`;
      el.className = `check-item${isChecked ? ' checked' : ''}`;
      el.setAttribute('role', 'checkbox');
      el.setAttribute('aria-checked', isChecked ? 'true' : 'false');
      el.tabIndex = 0;

      el.innerHTML = `
        <div class="check-box">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="display:${isChecked ? 'block' : 'none'};">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
        <div class="check-copy">
          <div class="check-item-title">${item.title}</div>
          <div class="check-item-desc">${item.desc}</div>
        </div>
      `;

      el.addEventListener('click', () => toggleCheckItem(item.id));
      el.addEventListener('keydown', (e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          toggleCheckItem(item.id);
        }
      });

      container.appendChild(el);
    } else {
      el.className = `check-item${isChecked ? ' checked' : ''}`;
      el.setAttribute('aria-checked', isChecked ? 'true' : 'false');
      const svg = el.querySelector('svg');
      if (svg) svg.style.display = isChecked ? 'block' : 'none';
    }
  });
}

function toggleCheckItem(itemId) {
  state.checked[itemId] = !state.checked[itemId];
  saveState();
  renderChecklist();
  updateProgress();
}

function updateProgress() {
  const total = CHECKLIST_ITEMS.length;
  const completed = Object.values(state.checked).filter(Boolean).length;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  const fillEl = document.getElementById('progress-fill');
  const countEl = document.getElementById('progress-count');

  if (fillEl) fillEl.style.width = `${pct}%`;
  if (countEl) countEl.textContent = `${completed}/${total} tasks complete (${pct}%)`;

  // Update step button & group completed styles
  for (let s = 0; s < 5; s++) {
    const stepItems = CHECKLIST_ITEMS.filter(item => item.step === s);
    const stepDone = stepItems.length > 0 && stepItems.every(item => state.checked[item.id]);
    
    const btn = document.getElementById(`nav-step-${s}`);
    if (btn) {
      btn.classList.toggle('completed', stepDone);
    }

    const group = document.getElementById(`step-group-${s}`);
    if (group) {
      group.classList.toggle('completed', stepDone);
    }
  }
}

function renderMajorGroups(filter) {
  const grid = document.getElementById('groups-grid');
  if (!grid) return;

  const groups = (appConfig && appConfig.major_groups) || [
    {
      "id": "accounting",
      "name": "Accounting",
      "department": "Business & Accounting",
      "pg_name": "Ensign - Accounting",
      "url": "https://ces.peoplegrove.com/hub/ces/groups/accounting-major/about?showBack=true"
    },
    {
      "id": "business-mgmt",
      "name": "Business Management & Operations",
      "department": "Business & Accounting",
      "pg_name": "Ensign - Business Management",
      "url": "https://ces.peoplegrove.com/hub/ces/groups/ensign-business-management/about?showBack=true"
    },
    {
      "id": "cybersecurity",
      "name": "Cybersecurity",
      "department": "Information Technology",
      "pg_name": "Ensign - Cybersecurity",
      "url": "https://ces.peoplegrove.com/hub/ces/groups/information-technology2/about?showBack=true"
    },
    {
      "id": "digital-marketing",
      "name": "Digital Marketing",
      "department": "Communications",
      "pg_name": "Ensign - Digital / Social Media Marketing",
      "url": "https://ces.peoplegrove.com/hub/ces/groups/digital-social-media-marketing/about?showBack=true"
    },
    {
      "id": "digital-content",
      "name": "Digital Content Creation",
      "department": "Communications",
      "pg_name": "Ensign - Digital Content Creation",
      "url": "https://ces.peoplegrove.com/hub/ces/groups/ensign-digital-content-creation1/about?showBack=true"
    },
    {
      "id": "info-tech",
      "name": "Information Technology & Systems Administration",
      "department": "Information Technology",
      "pg_name": "Ensign - Information Technology",
      "url": "https://ces.peoplegrove.com/hub/ces/groups/ensign-information-technology/about?showBack=true"
    },
    {
      "id": "interior-design",
      "name": "Interior Design",
      "department": "Design & Arts",
      "pg_name": "Ensign - Interior Design",
      "url": "https://ces.peoplegrove.com/hub/ces/groups/ensign-interior-design/about?showBack=true"
    },
    {
      "id": "medical-assistant",
      "name": "Medical Assistant & Healthcare Administration",
      "department": "Health Sciences",
      "pg_name": "Ensign - Medical Assisting",
      "url": "https://ces.peoplegrove.com/hub/ces/groups/health-professions/about?showBack=true"
    },
    {
      "id": "paralegal",
      "name": "Paralegal Studies",
      "department": "Legal Studies",
      "pg_name": "Ensign - General Discussion / Legal Network",
      "url": "https://ces.peoplegrove.com/hub/ces/groups/discussion3/about?showBack=true"
    },
    {
      "id": "software-dev",
      "name": "Software Development & Computer Science",
      "department": "Information Technology",
      "pg_name": "Ensign - Software Engineering",
      "url": "https://ces.peoplegrove.com/hub/ces/groups/ensign-software-engineering/about?showBack=true"
    },
    {
      "id": "communication",
      "name": "Communication & Professional Studies",
      "department": "Communications",
      "pg_name": "Ensign - Marketing & Communications",
      "url": "https://ces.peoplegrove.com/hub/ces/groups/ensign-communications/about?showBack=true"
    },
    {
      "id": "hospitality",
      "name": "Hospitality & Tourism Management",
      "department": "Business & Accounting",
      "pg_name": "Ensign - Hospitality & Tourism Management",
      "url": "https://ces.peoplegrove.com/hub/ces/groups/ensign-hospitality-tourism-management/about?showBack=true"
    },
    {
      "id": "finance",
      "name": "Finance",
      "department": "Business & Accounting",
      "pg_name": "Ensign - Finance",
      "url": "https://ces.peoplegrove.com/hub/ces/groups/ensign-finance/about?showBack=true"
    },
    {
      "id": "business-analytics",
      "name": "Business Analytics / Intelligence",
      "department": "Business & Accounting",
      "pg_name": "Ensign - Business Analytics / Intelligence",
      "url": "https://ces.peoplegrove.com/hub/ces/groups/business-intelligence-data-analytics/about?showBack=true"
    },
    {
      "id": "supply-chain",
      "name": "Global Supply Chain & Operations",
      "department": "Business & Accounting",
      "pg_name": "Ensign - Global Supply Chain",
      "url": "https://ces.peoplegrove.com/hub/ces/groups/global-supply-chain-and-operations1/about?showBack=true"
    },
    {
      "id": "project-mgmt",
      "name": "Project Management",
      "department": "Business & Accounting",
      "pg_name": "Ensign - Project Management",
      "url": "https://ces.peoplegrove.com/hub/ces/groups/project-management/about?showBack=true"
    },
    {
      "id": "ux-ui",
      "name": "UX / UI Design",
      "department": "Design & Arts",
      "pg_name": "UX / UI",
      "url": "https://ces.peoplegrove.com/hub/ces/groups/ux-ui/about?showBack=true"
    }
  ];

  const filtered = groups.filter(g => 
    g.name.toLowerCase().includes(filter) || 
    g.department.toLowerCase().includes(filter) ||
    (g.pg_name && g.pg_name.toLowerCase().includes(filter))
  );

  grid.innerHTML = filtered.map(g => `
    <div class="group-card">
      <div>
        <div class="group-dept">${g.department}</div>
        <div class="group-name">${g.name}</div>
        <div style="font-size: 11px; color: var(--gold-600); font-weight: 600; margin-top: 2px;">
          ${g.pg_name || "Ensign College Group"}
        </div>
      </div>
      <a href="${g.url}" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-sm" style="font-weight: 700;">
        Join Group ↗
      </a>
    </div>
  `).join("");
}

function setupOutreachGenerator() {
  const form = document.getElementById('outreach-form');
  const copyBtn = document.getElementById('copy-outreach-btn');
  const outputEl = document.getElementById('outreach-result');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const studentName = document.getElementById('outreach-student-name').value.trim();
      const alumnusName = document.getElementById('outreach-alum-name').value.trim();
      const major = document.getElementById('outreach-major').value.trim();
      const careerInterest = document.getElementById('outreach-career').value.trim();
      const tone = document.getElementById('outreach-tone').value;

      try {
        const res = await fetch('/api/outreach-draft', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            student_name: studentName,
            alumnus_name: alumnusName,
            major: major,
            career_interest: careerInterest,
            tone: tone
          })
        });

        if (res.ok) {
          const data = await res.json();
          outputEl.textContent = data.message;
          document.getElementById('outreach-box').style.display = 'block';
          showToast('Draft message generated!');
        } else {
          fallbackGenerateOutreach(studentName, alumnusName, major, careerInterest, tone);
        }
      } catch (err) {
        fallbackGenerateOutreach(studentName, alumnusName, major, careerInterest, tone);
      }
    });
  }

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const text = outputEl.textContent;
      if (!text) return;

      navigator.clipboard.writeText(text).then(() => {
        showToast('Copied message to clipboard!');
      }).catch(() => {
        showToast('Please select and copy the text manually.');
      });
    });
  }
}

function fallbackGenerateOutreach(studentName, alumnusName, major, careerInterest, tone) {
  const sName = studentName || 'Student';
  const aName = alumnusName ? `Hi ${alumnusName},` : 'Hello,';
  const mName = major || 'my program';
  const cRole = careerInterest || 'your field';

  const message = `${aName}\n\nMy name is ${sName} and I am an Ensign College student majoring in ${mName}. As part of my career planning, I am reaching out to alumni through Ensign Connect to learn about different career paths.\n\nI noticed your experience in ${cRole} and would greatly appreciate the opportunity to connect for a quick 15-minute informational interview via phone or Zoom at your convenience. I would love to hear your insights on the industry and how to best prepare for upcoming opportunities.\n\nThank you for your support of Ensign College students!\n\nWarm regards,\n${sName}`;

  const outputEl = document.getElementById('outreach-result');
  outputEl.textContent = message;
  document.getElementById('outreach-box').style.display = 'block';
  showToast('Draft message generated (offline fallback)!');
}

function showToast(msg) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}
