/* SCRD volunteer form Worker.
   Serves the static form + handles POST /submit:
   1) forwards the submission to Formspree (system of record, unchanged pipeline)
   2) sends a confirmation email to the volunteer via Resend
   A Resend failure never fails the submission. */

const FORMSPREE = "https://formspree.io/f/mqeopepl";

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
  //    Pass the real visitor's browser context through. Without it the
  //    request looks like a bare server-to-server POST and Formspree's
  //    spam model flags legitimate signups (which silently suppresses
  //    their notification emails). See Grace Schlicht, Aug 4 2026.
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

  // 2) Confirmation email. Best effort only.
  try {
    const email = String(payload.email || "").trim();
    const name = String(payload.Name || "").trim();
    const first = name.split(/\s+/)[0] || "";
    if (email && env.RESEND_API_KEY) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + env.RESEND_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "River Dance Crew <volunteers@riverdancefest.com>",
          to: [email],
          reply_to: "sparklecityriverdance@gmail.com",
          subject: "You're on the crew! River Dance 2026",
          text: confirmationText(first),
        }),
      });
    }
  } catch (e) {
    // swallow: the volunteer's submission already succeeded
  }

  return json({ ok: true });
}

// Copy the visitor's browser identity onto the upstream request so the
// submission looks like what it is: a real person on the form page.
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
  // The form is same-origin, so Referer/Origin point at the volunteer
  // page; fall back to it explicitly if the browser withheld them.
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

function json(body, status) {
  return new Response(JSON.stringify(body), {
    status: status || 200,
    headers: { "Content-Type": "application/json" },
  });
}
