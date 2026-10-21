import fs from 'fs';
import path from 'path';

const projectRoot = process.cwd();

function walkHtmlFiles(dir, fileList = []) {
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    if (item.name.startsWith('.') || item.name === 'node_modules') continue;
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      walkHtmlFiles(fullPath, fileList);
    } else if (item.isFile() && item.name.endsWith('.html')) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

const htmlFiles = walkHtmlFiles(projectRoot);
let cleanedTitles = 0;
let cleanedFooters = 0;

for (const filePath of htmlFiles) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // 1. Fix duplicate "| GreenNext | GreenNext" or "| GreenNext Solutions | GreenNext"
  const titleRegex = /<title>(.*?)<\/title>/i;
  const titleMatch = content.match(titleRegex);
  if (titleMatch) {
    let originalTitle = titleMatch[1];
    let newTitle = originalTitle
      .replace(/\s*\|\s*GreenNext\s*\|\s*GreenNext\s*$/i, ' | GreenNext')
      .replace(/\s*\|\s*GreenNext Solutions\s*\|\s*GreenNext\s*$/i, ' | GreenNext Solutions')
      .replace(/\s*\|\s*GreenNext\s*\|\s*GreenNext\b/i, ' | GreenNext');

    if (newTitle !== originalTitle) {
      content = content.replace(titleRegex, `<title>${newTitle}</title>`);
      cleanedTitles++;
      modified = true;
    }
  }

  // 2. Fix placeholder email & phone in footers
  const isSubdir = path.dirname(filePath) !== projectRoot;
  const contactPath = isSubdir ? '../contact.html' : 'contact.html';

  const placeholderSnippetRegex = /<li><a href="mailto:hello@greennext\.example">hello@greennext\.example<\/a><\/li>\s*<li><a href="tel:\+910000000000">\+91 00000 00000<\/a><\/li>/g;
  if (placeholderSnippetRegex.test(content)) {
    const replacement = `<li><a href="${contactPath}#schedule-consultation">Schedule Live Consultation &rarr;</a></li>\n          <li><a href="${contactPath}#enquiry">Submit Infrastructure Enquiry &rarr;</a></li>`;
    content = content.replace(placeholderSnippetRegex, replacement);
    cleanedFooters++;
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${path.relative(projectRoot, filePath)}`);
  }
}

console.log(`\nCleaned titles in ${cleanedTitles} files.`);
console.log(`Cleaned footer placeholders in ${cleanedFooters} files.`);
