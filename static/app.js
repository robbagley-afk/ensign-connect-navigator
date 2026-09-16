// Ensign Connect Navigator - Client Application Logic

const STORAGE_KEY = 'ensign_connect_navigator_state_v1';

let appConfig = null;
let state = {
  currentStep: 0,
  checked: {}
};

// Default Checklist Items across the 5 steps
const CHECKLIST_ITEMS = [
  // Step 1
  { id: 's1_platform', step: 0, title: 'Choose access method', desc: 'Select Web browser or download PeopleGrove app on mobile.' },
  { id: 's1_video', step: 0, title: 'Watch starter guide (optional)', desc: 'Review the quick video guide on signing in with school ID or LinkedIn.' },
  // Step 2
  { id: 's2_join_btn', step: 1, title: 'Click "Join Now" or "Sign Up"', desc: 'Navigate to Ensign Connect and initiate registration.' },
  { id: 's2_sso', step: 1, title: 'Sign in with School ID (SSO)', desc: 'Recommended: Use your Ensign College NetID/CES login to skip the manual approval queue.' },
  { id: 's2_profile', step: 1, title: 'Complete basic profile details', desc: 'Confirm your name, major, graduation year, and career goals.' },
  // Step 3
  { id: 's3_find_groups', step: 2, title: 'Open Ensign College Groups', desc: 'Select Ensign College under Schools and view the major groups directory.' },
  { id: 's3_join_group', step: 2, title: 'Join your specific major group', desc: 'Click the green Join control on your degree program group.' },
  { id: 's3_explore_tabs', step: 2, title: 'Check Members & Discussion', desc: 'Review the blue Members and Discussion links to see active peers and faculty.' },
  // Step 4
  { id: 's4_menu', step: 3, title: 'Open Hamburger Menu & Preferences', desc: 'Click your profile avatar or the menu icon, then select Preferences.' },
  { id: 's4_notifs', step: 3, title: 'Select "Notifications"', desc: 'Open the notification settings tab.' },
  { id: 's4_sms', step: 3, title: 'Add mobile number & enable SMS', desc: 'Critical step: Ensure SMS alerts are turned on so you receive instant text alerts when mentors or alumni message you.' },
  // Step 5
  { id: 's5_browse_alumni', step: 4, title: 'Browse Ensign Alumni Community', desc: 'Search by industry, job title, or company in the PeopleGrove directory.' },
  { id: 's5_review_questions', step: 4, title: 'Review Informational Interview questions', desc: 'Prepare 3-5 thoughtful questions from the ENS 101 guide.' },
  { id: 's5_send_message', step: 4, title: 'Draft and send outreach message', desc: 'Use the outreach generator below and send an invitation to connect.' }
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
    const res = await fetch('/api/config');
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

  stepBtns.forEach((b, i) => {
    b.classList.toggle('active', i === stepIndex);
  });

  sections.forEach((s, i) => {
    s.classList.toggle('active', i === stepIndex);
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function setupChecklistInteractions() {
  const searchInput = document.getElementById('group-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      renderMajorGroups(e.target.value.toLowerCase());
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
  const pct = Math.round((completed / total) * 100);

  const fillEl = document.getElementById('progress-fill');
  const countEl = document.getElementById('progress-count');

  if (fillEl) fillEl.style.width = `${pct}%`;
  if (countEl) countEl.textContent = `${completed}/${total} steps complete (${pct}%)`;

  // Update step button completed styles
  for (let s = 0; s < 5; s++) {
    const stepItems = CHECKLIST_ITEMS.filter(item => item.step === s);
    const stepDone = stepItems.every(item => state.checked[item.id]);
    const btn = document.getElementById(`nav-step-${s}`);
    if (btn) {
      btn.classList.toggle('completed', stepDone);
    }
  }
}

function renderMajorGroups(filter) {
  const grid = document.getElementById('groups-grid');
  if (!grid) return;

  const groups = (appConfig && appConfig.major_groups) || [
    {"id": "accounting", "name": "Accounting", "department": "Business & Accounting"},
    {"id": "business-mgmt", "name": "Business Management & Operations", "department": "Business & Accounting"},
    {"id": "cybersecurity", "name": "Cybersecurity", "department": "Information Technology"},
    {"id": "digital-marketing", "name": "Digital Marketing & Content Creation", "department": "Communications"},
    {"id": "info-tech", "name": "Information Technology & Systems Administration", "department": "Information Technology"},
    {"id": "interior-design", "name": "Interior Design", "department": "Design & Arts"},
    {"id": "medical-assistant", "name": "Medical Assistant & Healthcare Administration", "department": "Health Sciences"},
    {"id": "paralegal", "name": "Paralegal Studies", "department": "Legal Studies"},
    {"id": "software-dev", "name": "Software Development & Computer Science", "department": "Information Technology"},
    {"id": "communication", "name": "Communication & Professional Studies", "department": "Communications"},
    {"id": "hospitality", "name": "Hospitality & Tourism Management", "department": "Business & Accounting"}
  ];

  const filtered = groups.filter(g => 
    g.name.toLowerCase().includes(filter) || g.department.toLowerCase().includes(filter)
  );

  grid.innerHTML = filtered.map(g => `
    <div class="group-card">
      <div>
        <div class="group-dept">${g.department}</div>
        <div class="group-name">${g.name}</div>
      </div>
      <a href="https://ces.peoplegrove.com/hub/ces/groups?organization=19963" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-sm">
        Join Group ↗
      </a>
    </div>
  `).join('');
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
