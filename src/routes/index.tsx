import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area,
  LineChart, Line, CartesianGrid, Legend, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, ComposedChart, Cell,
} from "recharts";

export const Route = createFileRoute("/")({ component: Deck });

// ─── MONOCHROME PALETTE ───
const C = {
  bg: "#000000", card: "#0A0A0A", card2: "#111111",
  border: "#1A1A1A", border2: "#252525",
  white: "#FFFFFF", off: "#E8E8E8", mid: "#999999",
  dim: "#666666", mute: "#444444", dark: "#222222",
};
const tt = { background: "#111", border: "1px solid #333", borderRadius: 8, fontSize: 11, color: "#fff" };

// ─── DATA ───
const capexDetailed = [
  { cat: "FACILITY BUILDOUT", total: 2800, items: [
    { name: "Demolition & site preparation", cost: 180 },
    { name: "Structural works & partitions", cost: 420 },
    { name: "MEP (mechanical, electrical, plumbing)", cost: 560 },
    { name: "HVAC system (heavy-duty for gym)", cost: 380 },
    { name: "Flooring (rubber matting + turf)", cost: 340 },
    { name: "Locker rooms & showers buildout", cost: 320 },
    { name: "Reception & lounge finishing", cost: 180 },
    { name: "Lighting design & installation", cost: 160 },
    { name: "Signage & exterior branding", cost: 120 },
    { name: "Fire safety & compliance", cost: 140 },
  ]},
  { cat: "STRENGTH EQUIPMENT", total: 1600, items: [
    { name: "Power racks × 4 (Rogue/Rep style)", cost: 280 },
    { name: "Olympic platforms × 4", cost: 120 },
    { name: "Dumbbells (5–40kg complete set)", cost: 220 },
    { name: "Barbells & bumper plates", cost: 180 },
    { name: "Cable machines × 3", cost: 240 },
    { name: "Benches (flat, incline, decline) × 6", cost: 90 },
    { name: "Kettlebells (8–32kg sets)", cost: 80 },
    { name: "Cardio (treadmills × 4, bikes × 4)", cost: 320 },
    { name: "Accessories (bands, mats, rollers)", cost: 70 },
  ]},
  { cat: "HYROX EQUIPMENT", total: 1400, items: [
    { name: "Concept2 SkiErg × 6", cost: 210 },
    { name: "Concept2 Rower × 6", cost: 240 },
    { name: "Prowler sleds × 2 + weight plates", cost: 120 },
    { name: "Artificial turf lane (20m × 3m)", cost: 160 },
    { name: "Wall ball targets × 8 + balls", cost: 60 },
    { name: "Sandbags (various weights × 20)", cost: 50 },
    { name: "Farmer's carry handles × 10 pairs", cost: 40 },
    { name: "Assault/Echo bikes × 4", cost: 200 },
    { name: "Battle ropes, box jumps, misc", cost: 80 },
    { name: "Sled track rail system", cost: 120 },
    { name: "Timer displays × 3 + sound system", cost: 120 },
  ]},
  { cat: "PRE-OPENING MARKETING", total: 400, items: [
    { name: "Brand identity & design system", cost: 60 },
    { name: "Website & booking app development", cost: 80 },
    { name: "Social media content production", cost: 50 },
    { name: "Founding member campaign (ads + events)", cost: 100 },
    { name: "Launch event production", cost: 40 },
    { name: "PR & media outreach", cost: 30 },
    { name: "Merchandise (first batch)", cost: 40 },
  ]},
  { cat: "TECHNOLOGY & SYSTEMS", total: 200, items: [
    { name: "Gym management SaaS (annual)", cost: 48 },
    { name: "Access control & turnstile", cost: 45 },
    { name: "CCTV & security system", cost: 35 },
    { name: "POS terminal & payment gateway", cost: 22 },
    { name: "Wi-Fi infrastructure", cost: 20 },
    { name: "Body scan device (InBody or equiv)", cost: 30 },
  ]},
  { cat: "WORKING CAPITAL", total: 1000, items: [
    { name: "Staff salaries (6-month runway)", cost: 720 },
    { name: "Utilities buffer (6 months)", cost: 180 },
    { name: "Consumables & cleaning supplies", cost: 60 },
    { name: "Insurance deposits", cost: 40 },
  ]},
  { cat: "LEGAL & PERMITS", total: 200, items: [
    { name: "PT company formation", cost: 25 },
    { name: "Building permits & compliance", cost: 60 },
    { name: "Insurance policies (property + liability)", cost: 65 },
    { name: "Legal advisory & contracts", cost: 50 },
  ]},
  { cat: "CONTINGENCY (10%)", total: 600, items: [
    { name: "Construction overrun buffer", cost: 300 },
    { name: "Equipment price fluctuation", cost: 150 },
    { name: "Unforeseen regulatory costs", cost: 100 },
    { name: "FX risk buffer", cost: 50 },
  ]},
];

const opexDetailed = [
  { cat: "PEOPLE", total: 120, items: [
    { role: "GM / CEO (Amelie)", cost: 20, notes: "Founder salary, equity-weighted" },
    { role: "Head Coach — HYROX", cost: 18, notes: "Must be HYROX certified" },
    { role: "Coaches × 3", cost: 36, notes: "IDR 12M avg + PT commissions" },
    { role: "Front Desk / Sales × 2", cost: 16, notes: "Split shifts, 7-day coverage" },
    { role: "Cleaning / Maint × 2", cost: 10, notes: "Daily deep clean required" },
    { role: "Part-time Coaches × 2–3", cost: 20, notes: "Per-class rate for peak hours" },
  ]},
  { cat: "FACILITY", total: 50, items: [
    { role: "Electricity (heavy AC + equipment)", cost: 25, notes: "750m² gym runs hot" },
    { role: "Water", cost: 5, notes: "Showers drive this" },
    { role: "Internet & telecom", cost: 3, notes: "Fiber + backup" },
    { role: "Maintenance & repairs", cost: 10, notes: "Equipment servicing monthly" },
    { role: "Cleaning supplies & consumables", cost: 7, notes: "Towels, toiletries, etc" },
  ]},
  { cat: "MARKETING & GROWTH", total: 25, items: [
    { role: "Digital ads (IG, Google)", cost: 10, notes: "Performance marketing" },
    { role: "Content creation", cost: 5, notes: "Photo/video production" },
    { role: "Events & community", cost: 7, notes: "Monthly races, workshops" },
    { role: "Partnerships & collabs", cost: 3, notes: "Brand activation budget" },
  ]},
  { cat: "TECHNOLOGY", total: 10, items: [
    { role: "Gym management SaaS", cost: 4, notes: "Glofox or equivalent" },
    { role: "Payment processing fees", cost: 4, notes: "~1% of revenue" },
    { role: "App & digital tools", cost: 2, notes: "Booking, CRM" },
  ]},
  { cat: "ADMIN & INSURANCE", total: 20, items: [
    { role: "Insurance premiums", cost: 8, notes: "Property + liability + WC" },
    { role: "Accounting & bookkeeping", cost: 5, notes: "Outsourced initially" },
    { role: "Legal retainer", cost: 3, notes: "Contract review, compliance" },
    { role: "Miscellaneous buffer", cost: 4, notes: "Unplanned operational costs" },
  ]},
];

const cashFlow = [
  { month: "M1", inflow: 40, outflow: -200, cumulative: -160, members: 100, label: "Founding member cash" },
  { month: "M2", inflow: 80, outflow: -200, cumulative: -280, members: 140, label: "Pre-sales ramp" },
  { month: "M3", inflow: 135, outflow: -210, cumulative: -355, members: 180, label: "Word of mouth kicks in" },
  { month: "M4", inflow: 180, outflow: -215, cumulative: -390, members: 210, label: "Corporate packages start" },
  { month: "M5", inflow: 222, outflow: -220, cumulative: -388, members: 240, label: "Near break-even" },
  { month: "M6", inflow: 265, outflow: -220, cumulative: -343, members: 270, label: "Cash flow positive" },
  { month: "M7", inflow: 310, outflow: -225, cumulative: -258, members: 300, label: "Momentum building" },
  { month: "M8", inflow: 350, outflow: -225, cumulative: -133, members: 330, label: "Waitlist forming" },
  { month: "M9", inflow: 380, outflow: -225, cumulative: 22, members: 350, label: "Working capital recovered" },
  { month: "M10", inflow: 410, outflow: -225, cumulative: 207, members: 370, label: "Profit accumulation" },
  { month: "M11", inflow: 430, outflow: -225, cumulative: 412, members: 380, label: "Steady state nearing" },
  { month: "M12", inflow: 449, outflow: -225, cumulative: 636, members: 390, label: "Year 1 complete" },
];

const sensitivity = [
  { scenario: "Bear Case", members: 250, arpu: 1.0, revenue: 250, opex: 210, noi: 40, margin: "16%", payback: "205 mo" },
  { scenario: "Conservative", members: 320, arpu: 1.1, revenue: 352, opex: 220, noi: 132, margin: "38%", payback: "62 mo" },
  { scenario: "Base Case", members: 380, arpu: 1.15, revenue: 437, opex: 225, noi: 212, margin: "49%", payback: "39 mo" },
  { scenario: "Upside", members: 420, arpu: 1.2, revenue: 504, opex: 230, noi: 274, margin: "54%", payback: "30 mo" },
];

const competitorData = [
  { name: "South Barn", area: "Kemang", format: "HYROX Affiliate", price: "~1.2M", hyrox: true, openGym: false, compound: false, freeRent: false },
  { name: "The Commune", area: "Senayan", format: "HYROX Club", price: "~900K", hyrox: true, openGym: false, compound: false, freeRent: false },
  { name: "Bodyfit", area: "Kemang", format: "HYROX Affiliate", price: "~800K", hyrox: true, openGym: true, compound: false, freeRent: false },
  { name: "F45", area: "Cilandak", format: "Franchise HIIT", price: "~1.5M", hyrox: false, openGym: false, compound: false, freeRent: false },
  { name: "Fitness First", area: "Antasari", format: "Premium Chain", price: "~600K", hyrox: false, openGym: true, compound: false, freeRent: false },
  { name: "FitHub", area: "Cilandak", format: "Budget", price: "~200K", hyrox: false, openGym: true, compound: false, freeRent: false },
  { name: "Anytime Fitness", area: "Antasari", format: "24hr Chain", price: "~400K", hyrox: false, openGym: true, compound: false, freeRent: false },
];

const radarData = [
  { s: "HYROX", us: 95, best: 80 }, { s: "Strength", us: 90, best: 50 },
  { s: "Compound", us: 85, best: 25 }, { s: "Value", us: 82, best: 65 },
  { s: "Location", us: 88, best: 75 }, { s: "Community", us: 90, best: 70 },
];

// ─── PRIMITIVES ───
const Tag = ({ children, inv = false }: { children: React.ReactNode; inv?: boolean }) => (
  <span style={{
    display: "inline-block", padding: "3px 8px", fontSize: 9, letterSpacing: 1.5,
    fontWeight: 600, border: `1px solid ${inv ? C.white : C.border2}`,
    background: inv ? C.white : "transparent", color: inv ? C.bg : C.mid,
  }}>{children}</span>
);

const SectionTitle = ({ n, t }: { n: string; t: string }) => (
  <div style={{ marginBottom: 32 }}>
    <Tag>{n}</Tag>
    <h2 style={{ fontSize: 48, fontWeight: 800, margin: "12px 0 0", letterSpacing: -1.5, lineHeight: 1 }}>{t}</h2>
  </div>
);

const Card = ({ children, p = 20 }: { children: React.ReactNode; p?: number }) => (
  <div style={{ background: C.card, border: `1px solid ${C.border}`, padding: p }}>{children}</div>
);

// ─── SLIDES ───
function S0() {
  return (
    <div style={{ minHeight: "100vh", padding: "clamp(48px, 8vw, 80px) clamp(20px, 5vw, 48px)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      <div>
        <Tag>INVESTOR PITCH DECK · CONFIDENTIAL</Tag>
      </div>
      <div>
        <h1 style={{ fontSize: "clamp(80px, 14vw, 220px)", fontWeight: 900, lineHeight: 0.9, letterSpacing: -6, margin: 0 }}>
          TOM'S<br />HYROX
        </h1>
        <p style={{ fontSize: 18, color: C.mid, marginTop: 32, maxWidth: 640, lineHeight: 1.5 }}>
          Jakarta's first capital-efficient HYROX sports compound. 750m² on free land. Cilandak, South Jakarta.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginTop: 48, maxWidth: 720 }}>
          {[["IDR 8.2B", "Total Raise"], ["33 mo", "Payback"], ["49%", "NOI Margin"]].map(([v, l]) => (
            <div key={l} style={{ borderTop: `1px solid ${C.border2}`, paddingTop: 12 }}>
              <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: -1 }}>{v}</div>
              <div style={{ fontSize: 11, color: C.dim, letterSpacing: 1, marginTop: 4 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ fontSize: 11, color: C.dim, letterSpacing: 2 }}>SCROLL TO BEGIN ↓</div>
    </div>
  );
}

function S1() {
  const waves = [
    ["2015–18", "CrossFit", "Built the functional training culture. Proved Jakarta pays for intensity."],
    ["2018–21", "Marathon Running", "Created the endurance identity. Sunday long runs became social currency."],
    ["2022–24", "Padel", "Proved social sports can scale. Every compound filled overnight."],
    ["2025–NOW", "HYROX", "The hybrid. Strength meets endurance. Race culture meets gym culture."],
  ];
  return (
    <div style={{ minHeight: "100vh", padding: "clamp(48px, 8vw, 80px) clamp(20px, 5vw, 48px)" }}>
      <SectionTitle n="01 / 10" t="Why Now" />
      <p style={{ fontSize: 18, color: C.mid, maxWidth: 720, marginBottom: 40 }}>
        Jakarta has a pattern. Every 2–3 years, a fitness format explodes. Each wave creates identity, community, and spending behavior.
      </p>
      <div style={{ display: "grid", gap: 1, background: C.border }}>
        {waves.map(([yr, fmt, desc]) => (
          <div key={fmt} style={{ display: "grid", gridTemplateColumns: "160px 200px 1fr", gap: 24, padding: 20, background: C.bg }}>
            <div style={{ fontSize: 11, color: C.dim, letterSpacing: 2 }}>{yr}</div>
            <div style={{ fontSize: 22, fontWeight: 700 }}>{fmt}</div>
            <div style={{ fontSize: 14, color: C.off, lineHeight: 1.6 }}>{desc}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginTop: 32 }}>
        {[["500K+", "Global HYROX athletes (2025)"], ["80+", "Cities hosting HYROX events"], ["22K", "@hyroxina followers"], ["Jun '26", "First HYROX Jakarta race"]].map(([v, l]) => (
          <Card key={l}><div style={{ fontSize: 28, fontWeight: 800 }}>{v}</div><div style={{ fontSize: 11, color: C.dim, marginTop: 6 }}>{l}</div></Card>
        ))}
      </div>
      <div style={{ marginTop: 32, padding: 24, borderLeft: `2px solid ${C.white}`, background: C.card2 }}>
        <p style={{ fontSize: 16, fontStyle: "italic", color: C.off, lineHeight: 1.5, margin: 0 }}>
          "HYROX classes across Jakarta are already full. Gyms are racing to become certified training clubs." — The Jakarta Post, Feb 2026
        </p>
      </div>
    </div>
  );
}

function S2() {
  return (
    <div style={{ minHeight: "100vh", padding: "clamp(48px, 8vw, 80px) clamp(20px, 5vw, 48px)" }}>
      <SectionTitle n="02 / 10" t="The Gap" />
      <p style={{ fontSize: 18, color: C.mid, maxWidth: 720, marginBottom: 32 }}>
        52 HYROX-listed gyms in Jakarta. Zero purpose-built compounds in South Jakarta's premium residential corridor.
      </p>
      <Card p={0}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead>
            <tr style={{ background: C.card2 }}>
              {["", "Area", "Format", "Price", "HYROX", "Gym", "Compound", "No Rent"].map(h => (
                <th key={h} style={{ padding: 12, textAlign: "left", color: C.dim, fontSize: 10, letterSpacing: 1, fontWeight: 600, borderBottom: `1px solid ${C.border}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {competitorData.map((c) => (
              <tr key={c.name} style={{ borderBottom: `1px solid ${C.border}` }}>
                <td style={{ padding: 12, color: C.off }}>{c.name}</td>
                <td style={{ padding: 12, color: C.mid }}>{c.area}</td>
                <td style={{ padding: 12, color: C.mid }}>{c.format}</td>
                <td style={{ padding: 12, color: C.mid }}>{c.price}</td>
                <td style={{ padding: 12, color: c.hyrox ? C.white : C.mute }}>{c.hyrox ? "●" : "○"}</td>
                <td style={{ padding: 12, color: c.openGym ? C.white : C.mute }}>{c.openGym ? "●" : "○"}</td>
                <td style={{ padding: 12, color: C.mute }}>○</td>
                <td style={{ padding: 12, color: C.mute }}>○</td>
              </tr>
            ))}
            <tr style={{ background: C.white, color: C.bg }}>
              <td style={{ padding: 12, fontWeight: 800 }}>TOM'S HYROX</td>
              <td style={{ padding: 12, fontWeight: 600 }}>Cilandak</td>
              <td style={{ padding: 12, fontWeight: 600 }}>COMPOUND</td>
              <td style={{ padding: 12, fontWeight: 600 }}>850K–2.5M</td>
              <td style={{ padding: 12, fontWeight: 800 }}>●</td>
              <td style={{ padding: 12, fontWeight: 800 }}>●</td>
              <td style={{ padding: 12, fontWeight: 800 }}>●</td>
              <td style={{ padding: 12, fontWeight: 800 }}>●</td>
            </tr>
          </tbody>
        </table>
      </Card>
      <div style={{ marginTop: 32, height: 360 }}>
        <ResponsiveContainer>
          <RadarChart data={radarData}>
            <PolarGrid stroke={C.border2} />
            <PolarAngleAxis dataKey="s" tick={{ fill: C.mid, fontSize: 11 }} />
            <PolarRadiusAxis tick={{ fill: C.dim, fontSize: 10 }} stroke={C.border2} />
            <Radar name="Tom's HYROX" dataKey="us" stroke={C.white} fill={C.white} fillOpacity={0.3} strokeWidth={2} />
            <Radar name="Best Competitor" dataKey="best" stroke={C.dim} fill={C.dim} fillOpacity={0.1} strokeDasharray="4 4" />
            <Legend wrapperStyle={{ fontSize: 11, color: C.mid }} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function S3() {
  const zones = [
    { z: "HYROX Performance Zone", m: 220, pct: 29, desc: "6× ski ergs, 6× rowers, 2× sleds w/ 20m turf, wall balls, sandbags, farmer's carry. Capacity: 20-person classes." },
    { z: "Strength Floor", m: 180, pct: 24, desc: "4× power racks, Olympic platforms, full dumbbell wall, cable machines, cardio row. Open gym for all tiers." },
    { z: "Flex Studio", m: 80, pct: 11, desc: "Group classes, pilates, yoga, mobility. Doubles as corporate event space and workshop venue." },
    { z: "Lockers & Showers", m: 90, pct: 12, desc: "Premium finishes. Towel service for Elite. 15 lockers + 6 showers. The retention zone." },
    { z: "Reception + Lounge", m: 50, pct: 7, desc: "Check-in, retail display (2–3 units), smoothie counter (outsourced operator)." },
    { z: "Back of House", m: 30, pct: 4, desc: "Storage, staff area, cleaning supplies, utilities." },
    { z: "Circulation & Structure", m: 100, pct: 13, desc: "Hallways, walls, structural columns. Non-negotiable in any layout." },
  ];
  return (
    <div style={{ minHeight: "100vh", padding: "clamp(48px, 8vw, 80px) clamp(20px, 5vw, 48px)" }}>
      <SectionTitle n="03 / 10" t="The Compound" />
      <p style={{ fontSize: 18, color: C.mid, maxWidth: 720, marginBottom: 32 }}>
        750m². 4 revenue-driving zones. Every square meter earns or retains. Not a gym — a compound with spa, café, and flex space.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
        {zones.map((z) => (
          <Card key={z.z}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <div style={{ fontSize: 15, fontWeight: 700 }}>{z.z}</div>
              <div style={{ fontSize: 11, color: C.dim }}>{z.m}m² · {z.pct}%</div>
            </div>
            <div style={{ height: 4, background: C.border2, marginBottom: 12 }}>
              <div style={{ height: "100%", width: `${z.pct * 3}%`, background: C.white }} />
            </div>
            <p style={{ fontSize: 13, color: C.mid, lineHeight: 1.5, margin: 0 }}>{z.desc}</p>
          </Card>
        ))}
      </div>
      <div style={{ marginTop: 32, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        {[
          ["Sports Spa", "Outsourced operator. Zero CAPEX. Revenue share 15–20%."],
          ["Café Counter", "Counter-service smoothie & coffee. Creates daily habit."],
          ["Flex Studio", "Pilates, yoga, workshops. IDR 100–150K per drop-in."],
          ["Retail Display", "Branded merch + partner products. Full-margin."],
        ].map(([t, d]) => (
          <Card key={t}><div style={{ fontSize: 13, fontWeight: 700, marginBottom: 6 }}>{t}</div><p style={{ fontSize: 12, color: C.dim, margin: 0, lineHeight: 1.5 }}>{d}</p></Card>
        ))}
      </div>
    </div>
  );
}

function S4() {
  const team = [
    { name: "Amelie Poerwoko", tag: "CEO / HEAD OF OPERATIONS", bio: "5 years at F45 Kemang — Coach to Studio Manager. HYROX 365 Foundation certified. 85% client retention. Brand activations with Uniqlo, Rexona, BliBli.", owns: "Member experience · Programming · Coaching team · Community · Brand", strength: "The floor general. This business rises or falls on her daily execution." },
    { name: "Tom", tag: "TOMS VENTURES · CO-FOUNDER", bio: "Founder-operator across Tom's Padel, Two Dragon Sport Capital, SuperFans Pro, SuperSaaS.ai, and Rýù Coffee. Experienced in capital-efficient sports ventures.", owns: "Fundraising · Financial architecture · Investor relations · Strategic oversight", strength: "Brings the capital lens: leverage, moats, asymmetric risk." },
    { name: "Edward Triharto", tag: "DESIGN & BUILDOUT LEAD", bio: "6+ years interior design. Principal at Inhaustudio since 2020. UPH Interior Design graduate. Leads space layout, material sourcing, contractor coordination.", owns: "Space design · Buildout PM · Vendor coordination · Aesthetics", strength: "Can design a premium space on a controlled budget." },
  ];
  return (
    <div style={{ minHeight: "100vh", padding: "clamp(48px, 8vw, 80px) clamp(20px, 5vw, 48px)" }}>
      <SectionTitle n="04 / 10" t="The Team" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 32 }}>
        {team.map((p) => (
          <Card key={p.name}>
            <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>{p.name}</div>
            <div style={{ fontSize: 9, color: C.dim, letterSpacing: 1.5, marginBottom: 16 }}>{p.tag}</div>
            <p style={{ fontSize: 12, color: C.off, lineHeight: 1.6, marginBottom: 16 }}>{p.bio}</p>
            <div style={{ paddingTop: 12, borderTop: `1px solid ${C.border}`, marginBottom: 8 }}>
              <div style={{ fontSize: 9, color: C.dim, letterSpacing: 1, marginBottom: 4 }}>OWNS</div>
              <div style={{ fontSize: 12, color: C.off }}>{p.owns}</div>
            </div>
            <div style={{ paddingTop: 12, borderTop: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 9, color: C.dim, letterSpacing: 1, marginBottom: 4 }}>STRENGTH</div>
              <div style={{ fontSize: 12, color: C.mid, fontStyle: "italic" }}>{p.strength}</div>
            </div>
          </Card>
        ))}
      </div>
      <div style={{ marginBottom: 12, fontSize: 10, color: C.dim, letterSpacing: 2 }}>FIRST HIRES</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {[["Finance / Ops Manager", "IDR 15–20M/mo", "Cash flow, vendor payments, reporting."],
          ["Head Coach (HYROX Cert)", "IDR 18M/mo", "Class programming, coach quality."],
          ["Marketing & Community", "IDR 12M/mo", "Instagram, founding campaign. Launches Month 2."],
        ].map(([r, c, d]) => (
          <Card key={r}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <div style={{ fontSize: 13, fontWeight: 700 }}>{r}</div>
              <div style={{ fontSize: 11, color: C.dim }}>{c}</div>
            </div>
            <p style={{ fontSize: 12, color: C.mid, margin: 0 }}>{d}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}

function S5() {
  const tiers = [
    { name: "OPEN", price: "850K", target: "45%", who: "Independent gym-goers", features: ["Full strength floor access", "Locker rooms", "3 group classes/week", "App booking", "Community events"] },
    { name: "HYROX", price: "1.5M", target: "40%", who: "HYROX athletes & serious fitness", features: ["Everything in Open", "Unlimited HYROX classes", "Performance tracking", "Race prep programs", "Priority booking", "1 guest pass/month"] },
    { name: "ELITE", price: "2.5M", target: "15%", who: "Executives & transformation clients", features: ["Everything in HYROX", "2× PT sessions/month", "Body composition scans", "Towel service", "Priority lockers", "Exclusive events", "Recovery access"] },
  ];
  return (
    <div style={{ minHeight: "100vh", padding: "clamp(48px, 8vw, 80px) clamp(20px, 5vw, 48px)" }}>
      <SectionTitle n="05 / 10" t="Membership" />
      <p style={{ fontSize: 18, color: C.mid, marginBottom: 32 }}>3 tiers. Clear value steps. Blended ARPU: IDR 1.15M.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 32 }}>
        {tiers.map((t, i) => (
          <div key={t.name} style={{ padding: 24, background: i === 1 ? C.white : C.card, color: i === 1 ? C.bg : C.off, border: `1px solid ${i === 1 ? C.white : C.border}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.5 }}>{t.name}</div>
              {i === 1 && <span style={{ fontSize: 9, padding: "3px 8px", background: C.bg, color: C.white, letterSpacing: 1 }}>POPULAR</span>}
            </div>
            <div style={{ fontSize: 36, fontWeight: 800, letterSpacing: -1 }}>IDR {t.price}</div>
            <div style={{ fontSize: 11, opacity: 0.6, marginBottom: 16 }}>/month · {t.target} of mix</div>
            <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 16, fontStyle: "italic" }}>{t.who}</div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {t.features.map(f => (
                <li key={f} style={{ fontSize: 12, padding: "6px 0", borderTop: `1px solid ${i === 1 ? "#0001" : C.border}` }}>{f}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        {[["Founding Members", "100 spots at 25% discount, 6-month lock-in."],
          ["Annual Commitment", "15% discount. Reduces churn from ~5% to ~3%/mo."],
          ["Corporate Bulk", "5+ employees = 20% discount. TB Simatupang corridor."],
          ["Drop-in", "IDR 150K open gym, 200K HYROX. 15–20% convert."],
        ].map(([t, d]) => (
          <Card key={t}><div style={{ fontSize: 13, fontWeight: 700, marginBottom: 6 }}>{t}</div><p style={{ fontSize: 12, color: C.dim, margin: 0, lineHeight: 1.5 }}>{d}</p></Card>
        ))}
      </div>
    </div>
  );
}

type CollapseRow = { label: string; cost: number; notes?: string };

function CollapsibleSection({
  title, total, items, isOpen, onToggle,
}: {
  title: string; total: string; items: CollapseRow[];
  isOpen: boolean; onToggle: () => void;
}) {
  return (
    <div style={{ borderBottom: `1px solid ${C.border}` }}>
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        style={{
          width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "14px 16px", background: isOpen ? C.card2 : "transparent",
          border: "none", color: "inherit", cursor: "pointer", textAlign: "left",
          transition: "background .15s",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0, flex: 1 }}>
          <span style={{
            display: "inline-block", color: C.dim, fontSize: 10, lineHeight: 1,
            transform: isOpen ? "rotate(90deg)" : "rotate(0deg)", transition: "transform .2s",
          }}>▶</span>
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1.2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {title}
          </span>
          <span style={{ fontSize: 10, color: C.dim, fontVariantNumeric: "tabular-nums", flexShrink: 0 }}>
            ({items.length})
          </span>
        </div>
        <div style={{ fontFamily: "monospace", fontSize: 13, fontWeight: 700, whiteSpace: "nowrap", marginLeft: 12 }}>
          {total}
        </div>
      </button>
      <div style={{
        display: "grid", gridTemplateRows: isOpen ? "1fr" : "0fr",
        transition: "grid-template-rows .3s ease", background: C.card2,
      }}>
        <div style={{ overflow: "hidden" }}>
          <div style={{ padding: "4px 16px 14px 32px" }}>
            {items.map((it, idx) => (
              <div key={it.label} style={{
                display: "grid", gridTemplateColumns: "1fr auto", gap: 12,
                padding: "8px 0", borderTop: idx === 0 ? "none" : `1px solid ${C.border}`,
                fontSize: 12,
              }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ color: C.off, lineHeight: 1.4 }}>{it.label}</div>
                  {it.notes && (
                    <div style={{ color: C.dim, fontSize: 11, fontStyle: "italic", marginTop: 2, lineHeight: 1.4 }}>
                      {it.notes}
                    </div>
                  )}
                </div>
                <div style={{ color: C.white, fontFamily: "monospace", fontWeight: 600, whiteSpace: "nowrap" }}>
                  IDR {it.cost}M
                </div>
              </div>
            ))}
            <div style={{
              display: "flex", justifyContent: "space-between",
              padding: "10px 0 0", marginTop: 6, borderTop: `1px solid ${C.border2}`,
              fontSize: 10, color: C.dim, letterSpacing: 1.5,
            }}>
              <span>SUBTOTAL</span>
              <span style={{ fontFamily: "monospace", color: C.off }}>{total}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function fmtIDR(m: number) {
  return `IDR ${m >= 1000 ? (m / 1000).toFixed(1) + "B" : m + "M"}`;
}

function S6() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div style={{ minHeight: "100vh", padding: "clamp(48px, 8vw, 80px) clamp(20px, 5vw, 48px)" }}>
      <SectionTitle n="06 / 10" t="CAPEX · IDR 8.2B" />
      <p style={{ fontSize: 18, color: C.mid, marginBottom: 32 }}>Every line item. Tap to expand. 48% below original IDR 15.7B proposal.</p>
      <div style={{ height: 280, marginBottom: 32 }}>
        <ResponsiveContainer>
          <BarChart data={capexDetailed} margin={{ top: 10, right: 10, left: 0, bottom: 60 }}>
            <CartesianGrid stroke={C.border} vertical={false} />
            <XAxis dataKey="cat" tick={{ fill: C.dim, fontSize: 9 }} angle={-30} textAnchor="end" interval={0} height={60} />
            <YAxis tick={{ fill: C.dim, fontSize: 10 }} tickFormatter={v => `${v}M`} />
            <Tooltip contentStyle={tt} formatter={(v: number) => `IDR ${v}M`} />
            <Bar dataKey="total" fill={C.white} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <Card p={0}>
        {capexDetailed.map((cat, i) => (
          <CollapsibleSection
            key={cat.cat}
            title={cat.cat}
            total={fmtIDR(cat.total)}
            items={cat.items.map(it => ({ label: it.name, cost: it.cost }))}
            isOpen={open === i}
            onToggle={() => setOpen(open === i ? null : i)}
          />
        ))}
        <div style={{ display: "flex", justifyContent: "space-between", padding: "16px 20px", background: C.white, color: C.bg, fontWeight: 800 }}>
          <span style={{ letterSpacing: 1 }}>TOTAL CAPEX</span>
          <span style={{ fontFamily: "monospace" }}>IDR 8.2B</span>
        </div>
      </Card>
    </div>
  );
}

function S7() {
  const [openOp, setOpenOp] = useState<number | null>(0);
  return (
    <div style={{ minHeight: "100vh", padding: "clamp(48px, 8vw, 80px) clamp(20px, 5vw, 48px)" }}>
      <SectionTitle n="07 / 10" t="OPEX & P&L" />
      <p style={{ fontSize: 18, color: C.mid, marginBottom: 32 }}>Monthly operating cost: IDR 225M. No rent. That's the thesis.</p>
      <Card p={0}>
        {opexDetailed.map((cat, i) => (
          <CollapsibleSection
            key={cat.cat}
            title={cat.cat}
            total={`IDR ${cat.total}M`}
            items={cat.items.map(it => ({ label: it.role, cost: it.cost, notes: it.notes }))}
            isOpen={openOp === i}
            onToggle={() => setOpenOp(openOp === i ? null : i)}
          />
        ))}
        <div style={{ display: "flex", justifyContent: "space-between", padding: "16px 20px", background: C.white, color: C.bg, fontWeight: 800 }}>
          <span style={{ letterSpacing: 1 }}>TOTAL MONTHLY OPEX</span>
          <span style={{ fontFamily: "monospace" }}>IDR 225M</span>
        </div>
      </Card>

      <div style={{ marginTop: 24, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {[["IDR 2.54B", "Annual NOI"], ["IDR 583K", "Revenue / m² / mo"], ["IDR 3.9–6.6B", "5yr rent savings vs competitors"]].map(([v, l]) => (
          <Card key={l}><div style={{ fontSize: 22, fontWeight: 800 }}>{v}</div><div style={{ fontSize: 11, color: C.dim, marginTop: 6 }}>{l}</div></Card>
        ))}
      </div>
      <div style={{ marginTop: 32 }}>
        <div style={{ fontSize: 10, color: C.dim, letterSpacing: 2, marginBottom: 12 }}>SENSITIVITY ANALYSIS</div>
        <Card p={0}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ background: C.card2 }}>
                {["Scenario", "Members", "ARPU", "Revenue", "Opex", "NOI", "Margin", "Payback"].map(h => (
                  <th key={h} style={{ padding: 10, textAlign: "left", color: C.dim, fontSize: 10, letterSpacing: 1, borderBottom: `1px solid ${C.border}` }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sensitivity.map((s, i) => (
                <tr key={s.scenario} style={{ borderBottom: `1px solid ${C.border}`, background: i === 2 ? C.card2 : "transparent" }}>
                  <td style={{ padding: 10, fontWeight: 700, color: i === 2 ? C.white : C.off }}>{s.scenario}</td>
                  <td style={{ padding: 10, color: C.mid, fontFamily: "monospace" }}>{s.members}</td>
                  <td style={{ padding: 10, color: C.mid, fontFamily: "monospace" }}>{s.arpu}M</td>
                  <td style={{ padding: 10, color: C.mid, fontFamily: "monospace" }}>{s.revenue}M</td>
                  <td style={{ padding: 10, color: C.mid, fontFamily: "monospace" }}>{s.opex}M</td>
                  <td style={{ padding: 10, color: C.off, fontFamily: "monospace" }}>{s.noi}M</td>
                  <td style={{ padding: 10, color: C.off, fontFamily: "monospace" }}>{s.margin}</td>
                  <td style={{ padding: 10, color: C.mid, fontFamily: "monospace" }}>{s.payback}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}

function S8() {
  return (
    <div style={{ minHeight: "100vh", padding: "clamp(48px, 8vw, 80px) clamp(20px, 5vw, 48px)" }}>
      <SectionTitle n="08 / 10" t="Cash Flow & Ramp" />
      <p style={{ fontSize: 18, color: C.mid, marginBottom: 32 }}>Break-even Month 5–6. Working capital recovered by Month 9. IDR 636M cash generated in Year 1.</p>
      <div style={{ height: 300, marginBottom: 24 }}>
        <ResponsiveContainer>
          <ComposedChart data={cashFlow}>
            <CartesianGrid stroke={C.border} vertical={false} />
            <XAxis dataKey="month" tick={{ fill: C.dim, fontSize: 11 }} />
            <YAxis tick={{ fill: C.dim, fontSize: 10 }} />
            <Tooltip contentStyle={tt} />
            <Legend wrapperStyle={{ fontSize: 11, color: C.mid }} />
            <Bar dataKey="inflow" fill={C.mute} name="Revenue (IDR M)" />
            <Line type="monotone" dataKey="cumulative" stroke={C.white} strokeWidth={2} dot={{ fill: C.white, r: 3 }} name="Cumulative Cash" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div style={{ height: 120, marginBottom: 32 }}>
        <ResponsiveContainer>
          <AreaChart data={cashFlow}>
            <XAxis dataKey="month" tick={{ fill: C.dim, fontSize: 10 }} />
            <YAxis hide />
            <Tooltip contentStyle={tt} />
            <Area type="monotone" dataKey="members" stroke={C.white} fill={C.white} fillOpacity={0.15} name="Members" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16 }}>
        {[
          { yr: "Y1", rev: "3,740M", noi: "636M", note: "Ramp year" },
          { yr: "Y2", rev: "5,244M", noi: "2,544M", note: "Steady state" },
          { yr: "Y3", rev: "5,506M", noi: "2,706M", note: "+5% growth" },
          { yr: "Y4", rev: "5,782M", noi: "2,882M", note: "Phase 2 triggers" },
          { yr: "Y5", rev: "6,071M", noi: "3,071M", note: "Expansion ready" },
        ].map((y) => (
          <Card key={y.yr}>
            <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: -0.5, marginBottom: 8 }}>{y.yr}</div>
            <div style={{ fontSize: 9, color: C.dim, letterSpacing: 1 }}>REV</div>
            <div style={{ fontSize: 13, fontFamily: "monospace", marginBottom: 6 }}>{y.rev}</div>
            <div style={{ fontSize: 9, color: C.dim, letterSpacing: 1 }}>NOI</div>
            <div style={{ fontSize: 13, fontFamily: "monospace", marginBottom: 6 }}>{y.noi}</div>
            <div style={{ fontSize: 10, color: C.mid, fontStyle: "italic" }}>{y.note}</div>
          </Card>
        ))}
      </div>
      <p style={{ marginTop: 24, fontSize: 13, color: C.mid, textAlign: "center" }}>
        5-Year Cumulative NOI: <strong style={{ color: C.white }}>IDR 11.84B</strong> · CAPEX Multiple: <strong style={{ color: C.white }}>1.44×</strong>
      </p>
    </div>
  );
}

function S9() {
  const phases = [
    { ph: "01–02", t: "Design & Procure", items: ["Finalize layout (Edward leads)", "Equipment POs placed", "PT company formation", "Founding member waitlist opens", "Instagram content seeding begins", "Tom secures funding close"] },
    { ph: "03–04", t: "Build & Hire", items: ["Construction starts", "Head Coach + 2 coaches hired", "Pre-sale: 100 founding members target", "Corporate outreach (TB Simatupang)", "Community HYROX practice events", "Finance/Ops manager onboarded"] },
    { ph: "05–06", t: "Launch", items: ["Equipment install & testing", "Full staff training (2 weeks)", "Invite-only soft launch", "Feedback loop → fix operations", "Full public opening", "First community race event"] },
  ];
  return (
    <div style={{ minHeight: "100vh", padding: "clamp(48px, 8vw, 80px) clamp(20px, 5vw, 48px)" }}>
      <SectionTitle n="09 / 10" t="Go-to-Market" />
      <p style={{ fontSize: 18, color: C.mid, marginBottom: 32 }}>Build community before walls. Pre-sell before opening. The product is the marketing.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 32 }}>
        {phases.map((p) => (
          <Card key={p.ph}>
            <div style={{ fontSize: 10, color: C.dim, letterSpacing: 2 }}>MONTH {p.ph}</div>
            <div style={{ fontSize: 22, fontWeight: 800, margin: "6px 0 16px", letterSpacing: -0.5 }}>{p.t}</div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {p.items.map((it) => (
                <li key={it} style={{ fontSize: 12, padding: "6px 0", borderTop: `1px solid ${C.border}`, color: C.off }}>{it}</li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
      <div style={{ display: "grid", gap: 12 }}>
        {[
          ["The only HYROX compound in South Jakarta", "No one else has HYROX + strength + compound + free land in this corridor. We're the only option."],
          ["We can price 15–20% below boutiques", "Free land = permanently lower cost structure. IDR 850K vs boutique IDR 1.2M+ for comparable quality."],
          ["Not a gym visit — a daily habit", "Spa, café, flex classes create reasons to come on rest days. 4+ visits/week vs typical 2.5."],
          ["Community creates lock-in", "Race teams, leaderboards, 8-week training cycles. Once on a team for HYROX Jakarta, you don't cancel."],
          ["Amelie's existing network", "500+ member relationships from F45 Kemang. Day 1 is not cold start."],
        ].map(([t, d], i) => (
          <Card key={t}>
            <div style={{ display: "flex", gap: 16 }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: C.dim, fontFamily: "monospace", minWidth: 32 }}>0{i + 1}</div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{t}</div>
                <p style={{ fontSize: 13, color: C.mid, margin: 0, lineHeight: 1.5 }}>{d}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function S10() {
  return (
    <div style={{ minHeight: "100vh", padding: "clamp(48px, 8vw, 80px) clamp(20px, 5vw, 48px)" }}>
      <SectionTitle n="10 / 10" t="The Investment" />
      <div style={{ background: C.white, color: C.bg, padding: 48, marginBottom: 32, textAlign: "center" }}>
        <div style={{ fontSize: 11, letterSpacing: 3, opacity: 0.6 }}>TOTAL RAISE</div>
        <div style={{ fontSize: 96, fontWeight: 900, letterSpacing: -4, lineHeight: 1, margin: "8px 0" }}>IDR 8.2B</div>
        <div style={{ fontSize: 14, opacity: 0.6, letterSpacing: 2 }}>~USD 500,000</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1, background: C.border, marginBottom: 32 }}>
        {[["380", "Target Members"], ["IDR 437M", "Monthly Revenue"], ["IDR 212M", "Monthly NOI"], ["49%", "Operating Margin"],
          ["33 mo", "Payback Period"], ["IDR 11.84B", "5-Year Cum. NOI"], ["1.44×", "5-Yr CAPEX Multiple"], ["IDR 0", "Monthly Rent"]].map(([v, l]) => (
          <div key={l} style={{ background: C.bg, padding: 20 }}>
            <div style={{ fontSize: 20, fontWeight: 800 }}>{v}</div>
            <div style={{ fontSize: 10, color: C.dim, letterSpacing: 1, marginTop: 4 }}>{l}</div>
          </div>
        ))}
      </div>
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 10, color: C.dim, letterSpacing: 2, marginBottom: 12 }}>KEY ASSUMPTIONS</div>
        <div style={{ display: "grid", gap: 1, background: C.border }}>
          {[
            "Amelie is full-time, on-floor operator from Day 1",
            "Tom manages all fundraising, financial architecture, and investor relations",
            "Finance/Ops hire in place before construction starts",
            "Pre-sale achieves 80–100 founding members before opening",
            "HYROX continues growing in Indonesia (global trajectory supports this)",
            "Edward delivers buildout on budget and on time",
          ].map((t, i) => (
            <div key={t} style={{ background: C.bg, padding: 14, display: "flex", gap: 16, fontSize: 13 }}>
              <span style={{ color: C.dim, fontFamily: "monospace", minWidth: 32 }}>0{i + 1}</span>
              <span style={{ color: C.off }}>{t}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ marginBottom: 48 }}>
        <div style={{ fontSize: 10, color: C.dim, letterSpacing: 2, marginBottom: 12 }}>RISK MITIGATION</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
          {[
            ["HYROX doesn't go mainstream", "Position as strength + conditioning with HYROX as hero. Format-agnostic space."],
            ["Slow member ramp", "Pre-sale 100+ founders. IDR 1B working capital covers 6mo burn."],
            ["Construction overrun", "Fixed-price contracts. Edward manages. 10% contingency."],
            ["Key person risk", "Equity vesting tied to tenure. Strong Head Coach bench."],
            ["Competitive entry", "Free land = permanent cost moat. Community lock-in."],
          ].map(([r, m]) => (
            <Card key={r}>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>{r}</div>
              <p style={{ fontSize: 12, color: C.mid, margin: 0, lineHeight: 1.5 }}>{m}</p>
            </Card>
          ))}
        </div>
      </div>
      <div style={{ textAlign: "center", padding: "80px 0", borderTop: `1px solid ${C.border}` }}>
        <div style={{ fontSize: 64, fontWeight: 900, letterSpacing: -3, lineHeight: 1 }}>TOM'S HYROX</div>
        <div style={{ fontSize: 11, color: C.mid, letterSpacing: 4, marginTop: 24 }}>BUILT FOR PERFORMANCE</div>
        <div style={{ fontSize: 11, color: C.mid, letterSpacing: 4, marginTop: 6 }}>DESIGNED FOR COMMUNITY</div>
        <div style={{ fontSize: 11, color: C.mid, letterSpacing: 4, marginTop: 6 }}>CAPITALIZED FOR REAL</div>
      </div>
    </div>
  );
}

function Deck() {
  const slides = [S0, S1, S2, S3, S4, S5, S6, S7, S8, S9, S10];
  return (
    <div style={{ background: C.bg, color: C.off, fontFamily: "ui-sans-serif, system-ui, -apple-system, 'Helvetica Neue', sans-serif", maxWidth: 1280, margin: "0 auto" }}>
      {slides.map((S, i) => (
        <div key={i} style={{ borderBottom: i < slides.length - 1 ? `1px solid ${C.border}` : "none" }}>
          <S />
        </div>
      ))}
    </div>
  );
}
