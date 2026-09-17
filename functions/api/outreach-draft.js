// Cloudflare Pages Function: POST /api/outreach-draft
export async function onRequestPost(context) {
  try {
    const body = await context.request.json();
    const student_name = (body.student_name || "a fellow student").trim();
    const alumnus_name = (body.alumnus_name || "there").trim();
    const major = (body.major || "my degree").trim();
    const career_interest = (body.career_interest || "the industry").trim();
    const tone = body.tone || "standard";

    const greeting = alumnus_name.toLowerCase() !== "there" ? `Hi ${alumnus_name},` : "Hello,";
    let message = "";

    if (tone === "focused") {
      message = `${greeting}\n\nI am ${student_name}, currently studying ${major} at Ensign College. I saw your profile on Ensign Connect and noticed your background in ${career_interest}. Your career path is inspiring, and I would love to learn from your experience.\n\nWould you be open to a brief 15-minute informational interview or phone chat in the coming weeks? I have a few targeted questions about how you broke into the field and what skills employers prioritize.\n\nThank you for your time and for being part of the Ensign network!\n\nBest regards,\n${student_name}`;
    } else if (tone === "casual") {
      message = `${greeting}\n\nMy name is ${student_name}, and I'm currently working on my ${major} at Ensign College. I came across your profile on Ensign Connect and was excited to see your work in ${career_interest}.\n\nIf your schedule allows, I would love to connect for 15 minutes to ask a few questions about your career journey and any advice you might have for an Ensign student.\n\nThanks so much,\n${student_name}`;
    } else {
      message = `${greeting}\n\nMy name is ${student_name} and I am an Ensign College student majoring in ${major}. As part of my career planning, I am reaching out to alumni through Ensign Connect to learn about different career paths.\n\nI noticed your experience in ${career_interest} and would greatly appreciate the opportunity to connect for a quick 15-minute informational interview via phone or Zoom at your convenience. I would love to hear your insights on the industry and how to best prepare for upcoming internship opportunities.\n\nThank you for your support of Ensign College students!\n\nWarm regards,\n${student_name}`;
    }

    return new Response(JSON.stringify({
      ok: true,
      message: message,
      tips: [
        "Send via Ensign Connect messaging or LinkedIn InMail.",
        "Keep it brief — ask for 15 minutes only.",
        "One polite follow-up after 7–10 business days is appropriate."
      ]
    }), {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Invalid JSON request payload" }), {
      status: 400,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  });
}
