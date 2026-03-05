
# FundLink

FundLink is a full-stack funding platform built for anyone who needs funding to bring a project to life. Whether you are a student, a professional, a team, a club, a research group, or an independent builder, if you are working on something that needs financial backing, FundLink is for you. That includes software applications, engineering projects, robotics, providing technology to communities that lack access to it, or any large-scale technical build that requires real funding to get off the ground.

You create a profile, describe your project and what you need, and the platform matches you with the right investors, companies, and funding bodies that are actively looking to fund work like yours. No more sending the same generic application to whoever you can find.

Live: [fundlink.vercel.app](https://fundlink.vercel.app)

---

## What is this exactly?

Most funding platforms are just directories. You still have to figure out who is relevant, find the right contact, and hope your cold email lands in the right inbox.

FundLink is built around a different idea entirely:

1. You fill out your profile once covering your industry, project stage, funding needs, and skills
2. The platform runs a matching algorithm that scores every company and investor against your profile across 7 weighted factors
3. You get a ranked list of who you should actually be talking to, not just who exists
4. You apply directly through the platform and track every submission from your dashboard

**What the full vision includes (not in demo yet):**
The platform was designed to include an AI-powered external matcher that goes beyond the companies listed on the site. It would take your profile and project details, search across the broader funding landscape, identify the best-fit opportunities that exist outside the platform, and then do something most tools skip entirely: find the specific person inside that organisation who handles exactly what you are building. Not the general inbox. Not the contact form. The right person, with their direct contact details, based on what you need and what they fund. That piece is not live in the demo but it is the core of where FundLink is going.

---

## Features

- Auth with sign up, sign in, and protected routes
- Company browser with live search and filters by industry, size, and funding range
- Smart matching scored and ranked by how well each company fits your project
- Multi-step funding application form linked to your account
- Dashboard showing all applications with real-time status tracking
- 5-step profile builder covering background, skills, portfolio, and funding goals
- Opportunities page bringing VCs, grants, accelerators, and angel investors into one feed
- Success stories page showing real funded projects
- Role switcher between Funding Seeker and Funding Provider views
- Settings with notification preferences and privacy controls

---

## Built with

| Layer | Technology | Why |
|---|---|---|
| Framework | Next.js 15 (App Router) | Fast, file-based routing, server components out of the box |
| Language | TypeScript | Catches errors at build time, keeps large codebases clean |
| Styling | Tailwind CSS 4 | Utility-first, no separate CSS files, easy to stay consistent |
| Backend | Supabase | Postgres database and authentication in one, with row-level security |
| Deployment | Vercel | Instant deploys from GitHub, zero config needed |

---

## How the matching works

### Why it exists

The biggest problem with finding funding is not that opportunities do not exist. It is that most people apply to the wrong ones. They either apply to companies that fund completely different industries, ask for amounts outside what a funder typically offers, or pitch at the wrong stage of their project. The result is a lot of effort with a very low success rate.

The matching system exists to solve that. Instead of showing every user the same list of companies, FundLink builds a score for each company based on how well it fits that specific user's profile and project. The result is a personalised, ranked list where the companies at the top are genuinely worth applying to.

### How the score is calculated

When a user completes their profile, the algorithm runs silently in the background and evaluates every company in the database against that profile. Each company receives a score out of 100. That score is built from 7 individual factors, each given a weight that reflects how much it actually matters in a real funding decision:

| Factor | Weight | What it checks |
|---|---|---|
| Industry alignment | 25% | Does the company fund your field, for example AI, clean energy, healthcare, or robotics |
| Funding amount range | 20% | Is what you are asking for within what the company typically invests |
| Experience level | 15% | Does the company work with first-time founders, experienced teams, or researchers |
| Project stage | 15% | Are you at idea stage, prototype, MVP, or scaling, and does that match what they fund |
| Skills overlap | 15% | Do your technical skills line up with what the company looks for in applicants |
| Timeline | 5% | Does your expected timeline to completion align with the company's investment horizon |
| Company success rate | 5% | How often does the company's funded projects actually succeed, used as a quality signal |

Industry alignment carries the most weight because applying to a company that does not fund your field is an automatic rejection regardless of everything else. Funding amount comes second because even a perfect project will be turned down if the number is outside what a funder typically writes cheques for.

### What the score means in practice

Once all factors are calculated and combined, each company is placed into one of three tiers:

- **Perfect Match** is 85% and above. These are companies where nearly everything lines up. The industry fits, the amount is within range, the stage is right, and the skills match. These are the applications worth prioritising.
- **Great Match** is 70 to 84%. These companies are a strong fit on most factors with one or two things slightly off, perhaps the funding range is close but not exact, or the stage is adjacent. Still worth applying to.
- **Good Match** is 50 to 69%. There is meaningful overlap but some misalignment. These are shown so users have options but are ranked lower so attention naturally goes to the better fits first.

Anything below 50% is filtered out entirely. There is no value in showing a hardware robotics project a company that exclusively funds mobile apps, so those results do not appear.

### Why this approach matters

The alternative is what every other platform does: show everyone the same list and let them figure it out. That puts the burden entirely on the user and leads to scattered, low-quality applications. The matching system shifts that burden to the platform. By the time a user is looking at their matches page, the heavy lifting of filtering, comparing, and ranking has already been done. They are looking at a list of companies where applying actually makes sense.

---

## Folder structure

```
src/
├── app/
│   ├── page.tsx                  # Landing page
│   ├── apply/                    # Application form
│   ├── companies/                # Browse + company detail
│   ├── opportunities/            # Grants, VCs, accelerators
│   ├── success-stories/
│   ├── auth/login & signup
│   └── dashboard/
│       ├── page.tsx              # Overview + stats
│       ├── applications/         # Track submissions
│       ├── matches/              # Matched companies
│       ├── profile/              # View + edit profile
│       └── settings/
├── components/Navigation.tsx
├── contexts/AuthContext.tsx
└── lib/
    ├── supabase.ts
    ├── companiesData.ts
    └── matchingAlgorithm.ts
```

---

## What's next

- [ ] AI external matcher that finds funding opportunities outside the platform and surfaces the right contact person with direct details
- [ ] Company-side dashboard so investors and organisations can browse applicants and reach out
- [ ] Direct messaging between founders and funding providers inside the platform
- [ ] Email and push notifications when application status changes
- [ ] Profile analytics showing how your project compares to previously funded ones
- [ ] Public project pages so teams can share their funding pitch as a standalone link
- [ ] Collaborative profiles for teams and clubs applying together
- [ ] Funding progress tracker showing how close you are to your goal across all active applications
- [ ] Verified company badges and funding history to help applicants assess credibility
- [ ] Mobile app

---

Made by [Sohan Mirpuri](https://www.linkedin.com/in/sohan-mirpuri/) -- if this is useful to you, a star on the repo goes a long way.
