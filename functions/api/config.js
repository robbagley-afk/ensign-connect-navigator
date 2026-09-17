// Cloudflare Pages Function: GET /api/config
export async function onRequestGet(context) {
  const config = 
{
  "app_name": "Ensign Connect Navigator",
  "version": "1.0.0",
  "portal_web_url": "https://ces.peoplegrove.com/hub/ces/organizations/ensign-connect",
  "app_store_ios": "https://apps.apple.com/us/app/peoplegrove/id6737795408",
  "google_play_android": "https://play.google.com/store/apps/details?id=com.peoplegrove.mobile&hl=en",
  "ensign_groups_url": "https://ces.peoplegrove.com/hub/ces/groups?organization=19963",
  "notifications_preferences_url": "https://ces.peoplegrove.com/preferences/notifications",
  "community_directory_url": "https://ces.peoplegrove.com/hub/ces/person",
  "starter_video_id": "6398251412112",
  "starter_guide_page": "https://www.ensign.edu/ensign-connect-app",
  "networking_roadmap_url": "https://connect.byu.edu/hub/ces/pathways/roadmap-5-networking-job-search-r5-copy-kO5LvQ4GdV/steps/0",
  "major_groups": [
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
  ],
  "interview_questions": [
    "How did your studies and projects at Ensign College prepare you for your current position?",
    "What does a typical day look like in your role, and what core responsibilities take most of your time?",
    "Which technical skills or certificates (e.g., CAR 201 or industry certs) are most valued in your workplace?",
    "What advice would you give to a current Ensign student preparing to apply for internships in this field?",
    "Are there specific professional organizations or industry meetups you recommend joining?"
  ],
  "interview_guides": [
    {
      "title": "Informational Interviews Guide",
      "url": "https://lds-business-college.brightspotcdn.com/12/5b/6df443b6489d9c008cb497c2a95f/informational-interviews.pdf?openInDeviceBrowser=true"
    },
    {
      "title": "Know Your Professional Guide",
      "url": "https://lds-business-college.brightspotcdn.com/f0/b5/f78938de4d26b0ba8cc704fb8727/knowyourprofessionalguide.pdf?openInDeviceBrowser=true"
    },
    {
      "title": "BYU Informational Interview Handout",
      "url": "https://brightspotcdn.byu.edu/54/b6/2554ebb842fab54640a15ff0afb3/informational-interview.pdf?openInDeviceBrowser=true"
    }
  ]
}
;
  return new Response(JSON.stringify(config, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=60"
    }
  });
}
