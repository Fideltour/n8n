// Inspects the local n8n dev database to see which workflows and credentials
// exist. Read-only. Uses Node's built-in SQLite (Node 22+), so it needs no deps.
import { DatabaseSync } from 'node:sqlite';
import { join } from 'node:path';
import { homedir } from 'node:os';

const dbPath = join(homedir(), '.n8n-node-cli', '.n8n', 'database.sqlite');
const db = new DatabaseSync(dbPath, { readOnly: true });

console.log('DB:', dbPath, '\n');

console.log('=== Credentials ===');
for (const c of db.prepare('SELECT id, name, type FROM credentials_entity').all()) {
	console.log(`  ${c.id}  ${c.name}  (type=${c.type})`);
}

console.log('\n=== Workflows ===');
for (const w of db.prepare('SELECT id, name, active, nodes FROM workflow_entity').all()) {
	const nodes = JSON.parse(w.nodes);
	console.log(`\n  [${w.id}] ${w.name}  active=${w.active}  nodes=${nodes.length}`);
	for (const n of nodes) {
		const p = n.parameters ?? {};
		const detail = [p.resource, p.operation].filter(Boolean).join(':');
		const creds = Object.entries(n.credentials ?? {})
			.map(([k, v]) => `${k}=${v.name}`)
			.join(',');
		console.log(
			`      - ${n.name} (${n.type})${detail ? '  ' + detail : ''}${creds ? '  [' + creds + ']' : ''}`,
		);
		if (n.type.includes('fideltour')) console.log(`        params: ${JSON.stringify(p)}`);
	}
}

db.close();
