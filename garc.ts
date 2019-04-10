import { AutoArchiveConfig, SearchConfig } from "./model/config";

function getSearchString(search: SearchConfig): string {

  const categoryString = search.categories
    .map(c => `category:${c}`)
    .join(' ');
  
  return `{${categoryString}} in:${search.location} older_than:${search.age}`;
}

function sendEmailReport(trashedCount: number) {

  const now = new Date();
  GmailApp.sendEmail(
    Session.getEffectiveUser().getEmail(),
    `Gmail Archive Report for ${now.toISOString()}`,
    `Found and trashed ${trashedCount} threads.`
  );
}

function getOrCreateLabel(name: string): GoogleAppsScript.Gmail.GmailLabel {
  const label = GmailApp.getUserLabelByName(name);
  return (label ? label : GmailApp.createLabel(name));
}

function gark(search: SearchConfig, config: AutoArchiveConfig) {

  let trashedCount = 0;
  let threads: GoogleAppsScript.Gmail.GmailThread[] = [];

  const searchString = getSearchString(search);
  console.log(`search string: ${searchString}`);
  const archiveLabel = getOrCreateLabel(config.archiveLabelName);
  console.log(`archive label: ${archiveLabel.getName()}`);
  
  do {
    threads = GmailApp.search(searchString, 1, 100);
    let count = threads.length;

    if (count > 0) {
      console.log(`found ${count} eligible threads. Preparing to label and trash...`);
      GmailApp.moveThreadsToTrash(threads);
      archiveLabel.addToThreads(threads);
      console.log(`trashed ${count} threads`);
      trashedCount += count;
    }
  } while (threads.length > 0);

  if (config.shouldSendEmail) {
    sendEmailReport(trashedCount);
  }

  console.log(`trashed total ${trashedCount} threads`);
}

function main() {
  gark({
    age: '7d',
    categories: ['social', 'promotions', 'updates'],
    location: 'inbox'
  }, {
    shouldDeletePermenantly: false,
    shouldSendEmail: true,
    archiveLabelName: 'Auto Archive'
  });
}
