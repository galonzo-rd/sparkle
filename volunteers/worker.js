/* SCRD volunteer form Worker.
   Serves the static form + handles POST /submit:
   1) forwards the submission to Formspree (system of record, unchanged pipeline)
   2) sends a confirmation email to the volunteer via Resend
   3) sends a signup notification to the team via Resend
   Email failures never fail the submission.

   Why step 3 exists: Formspree's spam model flags some legitimate
   signups arriving via this Worker (server-side POST from a Cloudflare
   egress IP; header passthrough below does not fool it). Formspree
   sends NO notification email for spam-flagged submissions, which
   silently hid 3 real signups Aug 6 to 9, 2026. The Worker sees every
   submission before Formspree classifies it, so it notifies the team
   directly. Formspree remains the archive; its spam tab still needs an
   occasional sweep so records land in the inbox. */

const FORMSPREE = "https://formspree.io/f/mqeopepl";
const NOTIFY_TO = ["sparklecityriverdance@gmail.com", "fletcherbangs@gmail.com"];

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method === "POST" && url.pathname === "/submit") {
      return handleSubmit(request, env);
    }
    return env.ASSETS.fetch(request);
  },
};

async function handleSubmit(request, env) {
  let payload;
  try {
    payload = await request.json();
  } catch (e) {
    return json({ ok: false, error: "Invalid JSON" }, 400);
  }

  // 1) Formspree first. If this fails, report failure so the form's
  //    own fallback (direct Formspree, then mailto) kicks in.
  const fsRes = await fetch(FORMSPREE, {
    method: "POST",
    headers: withVisitorContext(request, {
      Accept: "application/json",
      "Content-Type": "application/json",
    }),
    body: JSON.stringify(payload),
  });
  if (!fsRes.ok) {
    return json({ ok: false, error: "Upstream submission failed" }, 502);
  }

  // 2 + 3) Confirmation to the volunteer, notification to the team.
  //        Best effort, independent of each other.
  const email = String(payload.email || "").trim();
  const name = String(payload.Name || "").trim();
  const first = name.split(/\s+/)[0] || "";

  const sends = [];
  if (email && env.RESEND_API_KEY) {
    sends.push(
      sendEmail(env, {
        to: [email],
        reply_to: "sparklecityriverdance@gmail.com",
        subject: "You're on the crew! River Dance 2026",
        text: confirmationText(first),
      })
    );
  }
  if (env.RESEND_API_KEY) {
    sends.push(
      sendEmail(env, {
        to: NOTIFY_TO,
        reply_to: email || undefined,
        subject: "New volunteer signup: " + (name || "(no name)"),
        text: notificationText(payload),
      })
    );
  }
  await Promise.allSettled(sends);

  return json({ ok: true });
}

function sendEmail(env, fields) {
  return fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + env.RESEND_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "River Dance Crew <volunteers@riverdancefest.com>",
      ...fields,
    }),
  });
}

// Copy the visitor's browser identity onto the upstream request so the
// submission looks like what it is: a real person on the form page.
// Note: this does NOT reliably prevent Formspree spam flagging (the
// TCP source is still a Cloudflare IP), it just helps at the margin.
function withVisitorContext(request, headers) {
  const h = { ...headers };
  const inbound = request.headers;
  const ip =
    inbound.get("CF-Connecting-IP") ||
    inbound.get("X-Forwarded-For") ||
    "";
  if (ip) {
    h["X-Forwarded-For"] = ip;
    h["CF-Connecting-IP"] = ip;
  }
  const passthrough = ["User-Agent", "Accept-Language", "Referer", "Origin"];
  for (const name of passthrough) {
    const v = inbound.get(name);
    if (v) h[name] = v;
  }
  if (!h.Referer) h.Referer = "https://volunteers.riverdancefest.com/";
  if (!h.Origin) h.Origin = "https://volunteers.riverdancefest.com";
  return h;
}

function confirmationText(first) {
  const hello = first ? "Galonzo " + first + "," : "Galonzo,";
  return [
    hello,
    "",
    "Thank you for pledging to be a volunteer for Sparkle City River Dance 2026, Aug 21 to 23 at Bone's Kayak & Campground. You're officially on the vol list.",
    "",
    "What happens next: shift assignments go out closer to the festival, so keep an eye on this inbox.",
    "",
    "Reminder: volunteer shifts are four hours, and every volunteer gets a free 2-day pass, dinner Saturday evening, and a volunteer tee.",
    "",
    "Questions in the meantime? Just reply to this email.",
    "",
    "See you on the river,",
    "The River Dance Crew",
    "@sparklecityriverdance",
  ].join("\n");
}

function notificationText(payload) {
  const lines = ["New volunteer signup via volunteers.riverdancefest.com", ""];
  const summary = payload.Summary || payload.summary;
  if (summary) {
    lines.push(String(summary));
  } else {
    for (const [k, v] of Object.entries(payload)) {
      if (v == null || v === "") continue;
      lines.push(k + ": " + String(v));
    }
  }
  lines.push("", "Sent by the volunteer form Worker. Formspree keeps the archive; if this one is not in the Formspree inbox, check its spam tab and mark it Not Spam.");
  return lines.join("\n");
}

function json(body, status) {
  return new Response(JSON.stringify(body), {
    status: status || 200,
    headers: { "Content-Type": "application/json" },
  });
}
