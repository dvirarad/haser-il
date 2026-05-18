#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';
import nodemailer from 'nodemailer';
import { program } from 'commander';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

function loadBrokers() {
  const dir = path.join(ROOT, 'brokers');
  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.yaml') && !f.startsWith('_'))
    .map(f => ({ file: f, ...yaml.load(fs.readFileSync(path.join(dir, f), 'utf8')) }));
}

function renderTemplate(templateName, user) {
  const tplPath = path.join(ROOT, 'templates', `${templateName}.txt`);
  let tpl = fs.readFileSync(tplPath, 'utf8');
  for (const [k, v] of Object.entries(user)) {
    tpl = tpl.replaceAll(`{{${k}}}`, v || '');
  }
  const lines = tpl.split('\n');
  const subject = lines[0].replace('Subject: ', '').trim();
  const body = lines.slice(2).join('\n').trim();
  return { subject, body };
}

function loadState(stateFile) {
  if (fs.existsSync(stateFile)) return JSON.parse(fs.readFileSync(stateFile, 'utf8'));
  return {};
}

function saveState(stateFile, state) {
  fs.writeFileSync(stateFile, JSON.stringify(state, null, 2));
}

program
  .name('haser-il')
  .description('Israeli data broker removal engine')
  .version('0.1.0');

program
  .command('run')
  .description('Send removal requests to all email-based brokers')
  .requiredOption('--name <name>', 'Full name in Hebrew')
  .requiredOption('--email <email>', 'Your email address')
  .requiredOption('--phone <phone>', 'Your phone number')
  .requiredOption('--address <address>', 'Your address')
  .option('--dob <dob>', 'Date of birth (DD/MM/YYYY)')
  .option('--smtp-host <host>', 'SMTP host', process.env.SMTP_HOST)
  .option('--smtp-user <user>', 'SMTP user', process.env.SMTP_USER)
  .option('--smtp-pass <pass>', 'SMTP password', process.env.SMTP_PASS)
  .option('--dry-run', 'Preview emails without sending')
  .option('--state-file <file>', 'Path to state JSON file', './haser-state.json')
  .option('--broker <id>', 'Run only for a specific broker ID')
  .action(async (opts) => {
    const brokers = loadBrokers().filter(b => b.method === 'email');
    const state = loadState(opts.stateFile);
    const user = {
      full_name: opts.name,
      email: opts.email,
      phone: opts.phone,
      address: opts.address,
      date_of_birth: opts.dob || 'לא סופק',
    };

    const filtered = opts.broker ? brokers.filter(b => b.id === opts.broker) : brokers;
    if (!filtered.length) { console.error('No matching brokers found.'); process.exit(1); }

    let transport;
    if (!opts.dryRun) {
      transport = nodemailer.createTransport({
        host: opts.smtpHost, port: 587, secure: false,
        auth: { user: opts.smtpUser, pass: opts.smtpPass },
      });
    }

    for (const broker of filtered) {
      const key = broker.id;
      if (state[key]?.status === 'sent') {
        console.log(`⏭  ${broker.name} — already sent (${state[key].sent_at}), skipping`);
        continue;
      }

      const { subject, body } = renderTemplate(broker.template, user);

      if (opts.dryRun) {
        console.log(`\n📧 DRY RUN — ${broker.name}`);
        console.log(`   To: ${broker.contact_email}`);
        console.log(`   Subject: ${subject}`);
        console.log(`   Body preview: ${body.slice(0, 120)}...`);
        continue;
      }

      try {
        await transport.sendMail({
          from: opts.email,
          to: broker.contact_email,
          subject,
          text: body,
        });
        state[key] = { status: 'sent', sent_at: new Date().toISOString(), broker_name: broker.name };
        saveState(opts.stateFile, state);
        console.log(`✅ ${broker.name} — sent to ${broker.contact_email}`);
      } catch (err) {
        state[key] = { status: 'error', error: err.message, attempted_at: new Date().toISOString() };
        saveState(opts.stateFile, state);
        console.error(`❌ ${broker.name} — failed: ${err.message}`);
      }
    }

    console.log('\nDone. State saved to', opts.stateFile);
  });

program
  .command('status')
  .description('Show current removal request status')
  .option('--state-file <file>', 'Path to state JSON file', './haser-state.json')
  .action((opts) => {
    const state = loadState(opts.stateFile);
    const brokers = loadBrokers();
    console.log('\nStatus report:');
    for (const broker of brokers) {
      const s = state[broker.id];
      if (!s) console.log(`  ⬜ ${broker.name} — not sent`);
      else if (s.status === 'sent') console.log(`  ✅ ${broker.name} — sent ${s.sent_at}`);
      else if (s.status === 'confirmed') console.log(`  ✔️  ${broker.name} — confirmed removed`);
      else console.log(`  ❌ ${broker.name} — ${s.status}: ${s.error || ''}`);
    }
  });

program
  .command('list')
  .description('List all brokers in the registry')
  .action(() => {
    const brokers = loadBrokers();
    console.log(`\n${brokers.length} brokers in registry:\n`);
    for (const b of brokers) {
      console.log(`  ${b.name.padEnd(25)} [${b.id}]  method:${b.method}  categories:${(b.category||[]).join(',')}`);
    }
  });

program.parse();
