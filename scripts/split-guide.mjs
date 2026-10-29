// Splits the single-file usage guide (docs/guide/README.md in the boldie repo) into Starlight pages.
// Usage: node scripts/split-guide.mjs <path to README.md>
// Rewrites in-guide anchors to page links and image paths to src/assets. Re-run after the guide changes.
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import GithubSlugger from 'github-slugger';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const source = process.argv[2];
if (!source) {
	console.error('Usage: node scripts/split-guide.mjs <path to docs/guide/README.md>');
	process.exit(1);
}

/** Section number → page slug and short description. */
const pages = {
	1: { slug: 'getting-started', description: 'Signing in, setting up a new salon, light and dark, language.' },
	2: { slug: 'roles', description: 'What owners, managers and staff can see and change.' },
	3: { slug: 'calendar', description: 'Reading the calendar, booking, blocking time and the booking sheet.' },
	4: { slug: 'services-and-resources', description: 'Services, their steps and processing time, chairs and rooms.' },
	5: { slug: 'clients', description: 'Finding, adding, erasing and merging clients; the client profile.' },
	6: { slug: 'import-and-export', description: 'Importing from Treatwell, Fresha or a spreadsheet, and exporting everything.' },
	7: { slug: 'online-booking', description: 'The booking page, requests, the manage link and the waitlist.' },
	8: { slug: 'notifications', description: 'Reminders, texts and emails, the delivery log and templates.' },
	9: { slug: 'marketing', description: 'Automations, campaigns and unsubscribing.' },
	10: { slug: 'forms', description: 'Building consultation forms and filling them in.' },
	11: { slug: 'reports', description: 'Bookings, revenue, utilisation and clients.' },
	12: { slug: 'billing', description: 'Plans, prices and the trial.' },
	13: { slug: 'calendar-subscription', description: 'See your Boldie calendar in Google, Apple or Outlook.' },
	14: { slug: 'push-alerts', description: 'Phone alerts for new bookings, changes and arrivals.' },
	15: { slug: 'team', description: 'Inviting people, roles and removing members.' },
	16: { slug: 'settings', description: 'Every setting and what it does.' },
	17: { slug: 'staff-apps', description: 'The Boldie app for iPhone and Android.' },
	18: { slug: 'tutorials', description: 'Step-by-step walkthroughs of everyday jobs.' },
	19: { slug: 'troubleshooting', description: 'Common problems and what to do.' },
	20: { slug: 'not-yet', description: 'What Boldie does not do yet.' },
};

const lines = readFileSync(source, 'utf8').split('\n');

/** @type {{ num: number, title: string, body: string[] }[]} */
const sections = [];
for (const line of lines) {
	const top = /^## (\d+)\. (.+)$/.exec(line);
	if (top) {
		sections.push({ num: Number(top[1]), title: top[2], body: [] });
	} else if (sections.length > 0) {
		sections[sections.length - 1].body.push(line);
	}
}

// Map every anchor the guide links to (section and sub-heading) to its new page URL.
/** @type {Map<string, string>} */
const anchors = new Map();
const titles = new Map();
for (const section of sections) {
	const page = pages[section.num];
	if (!page) throw new Error(`No page for section ${section.num}`);
	const url = `/${page.slug}/`;
	anchors.set(new GithubSlugger().slug(`${section.num}. ${section.title}`), url);
	titles.set(url, section.title);
	const slugger = new GithubSlugger();
	for (const line of section.body) {
		const sub = /^### (.+)$/.exec(line);
		if (!sub) continue;
		const id = slugger.slug(sub[1]);
		if (!anchors.has(id)) anchors.set(id, `${url}#${id}`);
	}
}

/** @param {string} line */
function rewrite(line) {
	return line
		.replace(/\[([^\]]+)\]\(#([^)]+)\)/g, (_match, text, id) => {
			const target = anchors.get(id);
			if (!target) throw new Error(`Unknown anchor #${id}`);
			const label = /^section \d+$/.test(text) ? (titles.get(target.split('#')[0]) ?? text) : text;
			return `[${label}](${target})`;
		})
		.replace(/\]\(img\/(web|ios|android)\//g, '](../../assets/$1/')
		.replace(/\]\(\.\.\/qa\//g, '](../../assets/qa/');
}

for (const section of sections) {
	const page = pages[section.num];
	let body = section.body.map((line) => (line.startsWith('### ') ? line.slice(1) : rewrite(line)));
	// Drop the horizontal rules that separated sections in the single file.
	while (body.length > 0 && (body[body.length - 1].trim() === '' || body[body.length - 1].trim() === '---')) body.pop();
	while (body.length > 0 && body[0].trim() === '') body.shift();
	const frontmatter = [
		'---',
		`title: ${JSON.stringify(section.title)}`,
		`description: ${JSON.stringify(page.description)}`,
		'---',
		'',
	];
	writeFileSync(join(root, 'src/content/docs', `${page.slug}.md`), `${[...frontmatter, ...body].join('\n')}\n`);
	console.log(`${page.slug}.md`);
}
