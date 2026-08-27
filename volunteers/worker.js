/* SCRD volunteer Worker. CLOSED MODE (since Aug 27, 2026).

   River Dance 2026 is over, so volunteer signups are closed:
   - Every GET serves the branded "signups closed" page below. The 2026
     form (index.html in this folder) is never served, but stays in the
     repo untouched so it can be revived for the next River Dance.
   - POST /submit returns 410 Gone. Nothing is forwarded to Formspree
     and no emails are sent.
   - POST /relay-email is UNCHANGED and must stay live: the ticket shop
     sims (scrd-tickets-sim, scrd-wizard-sim) send all their email
     through it. The Resend key lives only on this worker.

   The full 2026 form worker (Formspree forward + volunteer confirmation
   + team notification emails) is in git history; last live version is
   the parent of this commit. To reopen signups next year: restore that
   worker.js, update the form copy/dates in index.html, redeploy. */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method === "POST" && url.pathname === "/relay-email") {
      return handleRelay(request, env);
    }
    if (url.pathname === "/submit") {
      return json({ ok: false, error: "closed", message: "Volunteer signups for River Dance 2026 are closed." }, 410);
    }
    if (request.method === "GET" || request.method === "HEAD") {
      return new Response(CLOSED_PAGE, {
        status: 200,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "public, max-age=300",
          "X-Robots-Tag": "noindex",
        },
      });
    }
    return json({ ok: false, error: "closed" }, 410);
  },
};

const CLOSED_PAGE = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Volunteer Signups Are Closed. Sparkle City River Dance</title>
<meta name="robots" content="noindex" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Work+Sans:wght@400;500;600;700&family=Oswald:wght@500;600;700&display=swap" rel="stylesheet" />
<style>
@font-face {
  font-family: "Cooper";
  src: url("https://riverdancefest.com/fonts/CooperBlackItalic.ttf") format("truetype");
  font-weight: 400 900; font-style: normal; font-display: swap;
}
:root{
  --forest:#2B4A2E; --blush:#F4B9A8; --lime:#D8EF5C; --cream:#F5EEDC;
  --black:#0E0F0D; --paper:#FBF7EC;
  --font-display:"Cooper","Cooper Black",Georgia,serif;
  --font-eyebrow:"Oswald","Bebas Neue",Impact,sans-serif;
  --font-body:"Work Sans","Inter","Helvetica Neue",Arial,sans-serif;
}
*{box-sizing:border-box;}
html,body{margin:0;padding:0;}
body{
  font-family:var(--font-body); color:var(--black); background:var(--forest);
  min-height:100vh; display:flex; align-items:center; justify-content:center;
  padding:28px 20px; -webkit-font-smoothing:antialiased;
}
::selection{background:var(--lime);color:var(--black);}
body::before,body::after{
  content:"\\2726"; position:fixed; pointer-events:none; line-height:1; z-index:0;
  color:rgba(216,239,92,.16); font-size:120px;
}
body::before{top:12vh;left:-10px;}
body::after{bottom:8vh;right:-6px;font-size:90px;color:rgba(244,185,168,.16);}
.card{
  position:relative; z-index:1; max-width:640px; width:100%;
  background:var(--cream); border:4px solid var(--black);
  box-shadow:10px 10px 0 var(--black); padding:44px 36px 38px; text-align:center;
}
.eyebrow{
  font-family:var(--font-eyebrow); text-transform:uppercase; font-weight:700;
  letter-spacing:.22em; font-size:13px; color:var(--forest); margin:0 0 12px;
}
h1{
  font-family:var(--font-display); text-transform:uppercase; line-height:.94;
  font-size:clamp(2.2rem,7vw,3.4rem); margin:0 0 18px; color:var(--black);
}
h1 .accent{color:#a04a30;}
p{font-size:16px; line-height:1.6; color:#3A3B38; margin:0 auto 16px; max-width:48ch;}
.chip{
  display:inline-block; margin:6px 0 22px;
  font-family:var(--font-eyebrow); text-transform:uppercase; font-weight:600;
  letter-spacing:.16em; font-size:12.5px; color:var(--black);
  background:var(--lime); border:2px solid var(--black); padding:8px 16px;
  box-shadow:3px 3px 0 var(--black);
}
.actions{display:flex; flex-wrap:wrap; gap:14px; justify-content:center; margin-top:26px;}
.btn{
  font-family:var(--font-eyebrow); text-transform:uppercase; font-weight:600;
  letter-spacing:.14em; font-size:13px; text-decoration:none; color:var(--black);
  border:3px solid var(--black); padding:12px 22px; background:var(--blush);
  box-shadow:4px 4px 0 var(--black); transition:transform .12s ease, box-shadow .12s ease;
}
.btn:hover{transform:translate(-2px,-2px); box-shadow:6px 6px 0 var(--black);}
.btn.alt{background:var(--paper);}
.foot{
  margin-top:30px; font-family:var(--font-eyebrow); text-transform:uppercase;
  letter-spacing:.2em; font-size:11.5px; color:var(--forest);
}
</style>
</head>
<body>
<main class="card">
  <p class="eyebrow">Sparkle City River Dance</p>
  <h1>Volunteer signups<br><span class="accent">are closed</span></h1>
  <div class="chip">River Dance 2026 is a wrap</div>
  <p>To everyone who pledged a shift, built the site, ran check-in, hauled trash, and helped make the festival look like it never happened: thank you. You made the 10th anniversary run.</p>
  <p>Signups will open again for the next River Dance. Watch <strong>@sparklecityriverdance</strong> for the word.</p>
  <div class="actions">
    <a class="btn" href="https://riverdancefest.com">riverdancefest.com</a>
    <a class="btn alt" href="https://www.instagram.com/sparklecityriverdance/">Instagram</a>
  </div>
  <p class="foot">Super Nature &#x2726;</p>
</main>
</body>
</html>`;

/* Minimal internal email relay for sibling SCRD workers (added Aug 24, 2026
   for the scrd-tickets-sim ticket shop demo; also used by scrd-wizard-sim).
   The Resend key lives only on this worker, so the ticket sims POST here to
   send their emails. Guarded by the RELAY_SECRET shared secret (set on all
   three workers); senders are pinned to @riverdancefest.com. */
async function handleRelay(request, env) {
  if (!env.RELAY_SECRET || request.headers.get("X-Relay-Secret") !== env.RELAY_SECRET) {
    return json({ ok: false, error: "forbidden" }, 403);
  }
  if (!env.RESEND_API_KEY) return json({ ok: false, error: "no sender configured" }, 503);
  let p;
  try {
    p = await request.json();
  } catch (e) {
    return json({ ok: false, error: "Invalid JSON" }, 400);
  }
  const from = String(p.from || "").trim();
  const to = Array.isArray(p.to) ? p.to.map(String).slice(0, 5) : [];
  if (!/<[^<>@\s]+@riverdancefest\.com>$|^[^<>@\s]+@riverdancefest\.com$/.test(from)) {
    return json({ ok: false, error: "from must be @riverdancefest.com" }, 400);
  }
  if (to.length === 0 || !p.subject || (!p.text && !p.html)) {
    return json({ ok: false, error: "to, subject, and text or html required" }, 400);
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + env.RESEND_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: from,
      to: to,
      reply_to: p.reply_to || undefined,
      subject: String(p.subject).slice(0, 200),
      text: p.text || undefined,
      html: p.html || undefined,
    }),
  });
  const detail = await res.text();
  return json({ ok: res.ok, status: res.status, detail: res.ok ? undefined : detail.slice(0, 300) }, res.ok ? 200 : 502);
}

function json(body, status) {
  return new Response(JSON.stringify(body), {
    status: status || 200,
    headers: { "Content-Type": "application/json" },
  });
}
