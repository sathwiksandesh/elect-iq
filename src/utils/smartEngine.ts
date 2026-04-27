import type { CountryCode } from '../types';
import { ELECTION_DATA } from '../data/electionData';

// ─── Intent detection ─────────────────────────────────────────────────────────
type Intent =
  | 'register'
  | 'id_documents'
  | 'booth_location'
  | 'eligibility'
  | 'counting'
  | 'campaigning'
  | 'voting_day'
  | 'results'
  | 'system'
  | 'faq'
  | 'authority'
  | 'compulsory'
  | 'postal'
  | 'nota'
  | 'mcc'
  | 'electoral_college'
  | 'preferential'
  | 'two_votes'
  | 'threshold'
  | 'greeting'
  | 'thanks'
  | 'unknown';

const PATTERNS: Array<{ intent: Intent; keywords: string[] }> = [
  { intent: 'greeting',         keywords: ['hello', 'hi', 'hey', 'good morning', 'good evening', 'namaste', 'hola', 'bonjour'] },
  { intent: 'thanks',           keywords: ['thank', 'thanks', 'thank you', 'thx', 'great', 'perfect', 'awesome', 'helpful'] },
  { intent: 'register',         keywords: ['register', 'enrol', 'enroll', 'sign up', 'sign-up', 'voter roll', 'electoral roll', 'how to vote', 'voter id card', 'form 6', 'epic'] },
  { intent: 'id_documents',     keywords: ['id', 'identification', 'documents', 'what do i bring', 'what to carry', 'proof', 'aadhaar', 'passport', 'licence', 'license', 'pan card', 'driving'] },
  { intent: 'booth_location',   keywords: ['booth', 'polling station', 'polling place', 'where to vote', 'my booth', 'find booth', 'where do i vote', 'location', 'address'] },
  { intent: 'eligibility',      keywords: ['eligible', 'eligibility', 'can i vote', 'am i', 'qualify', 'requirement', 'age', 'citizen', 'citizenship', 'who can vote', 'minimum age'] },
  { intent: 'counting',         keywords: ['count', 'counting', 'how are votes', 'evm', 'vvpat', 'verify', 'verified', 'scrutiny', 'audit'] },
  { intent: 'campaigning',      keywords: ['campaign', 'canvass', 'rally', 'advertisement', 'ads', 'spend', 'spending', 'mcc', 'model code', 'cvigil'] },
  { intent: 'voting_day',       keywords: ['voting day', 'polling day', 'election day', 'on the day', 'at the booth', 'at the polls', 'ink', 'indelible', 'evm', 'ballot', 'how to vote', 'press button'] },
  { intent: 'results',          keywords: ['result', 'results', 'winner', 'who won', 'announce', 'declared', 'majority', 'government formed', 'coalition'] },
  { intent: 'authority',        keywords: ['authority', 'commission', 'eci', 'aec', 'fec', 'electoral commission', 'who runs', 'who manages', 'who oversees'] },
  { intent: 'compulsory',       keywords: ['compulsory', 'mandatory', 'must vote', 'have to vote', 'fine', 'penalty', 'forced to vote'] },
  { intent: 'postal',           keywords: ['postal', 'mail', 'absentee', 'post', 'mail-in', 'vote from home', 'briefwahl'] },
  { intent: 'nota',             keywords: ['nota', 'none of the above', 'reject all', 'no candidate'] },
  { intent: 'mcc',              keywords: ['model code of conduct', 'mcc', 'code of conduct', 'election rules', 'election code'] },
  { intent: 'electoral_college',keywords: ['electoral college', 'electors', '270', 'swing state'] },
  { intent: 'preferential',     keywords: ['preferential', 'ranked choice', 'rank', 'number candidates', 'how to fill ballot', 'preferences', '1 2 3'] },
  { intent: 'two_votes',        keywords: ['two votes', 'erststimme', 'zweitstimme', 'first vote', 'second vote', 'split vote'] },
  { intent: 'threshold',        keywords: ['threshold', '5%', 'five percent', 'hurdle', 'minimum seats', 'small party'] },
  { intent: 'faq',              keywords: ['faq', 'question', 'help', 'explain', 'what is', 'what are', 'tell me', 'how does'] },
];

function detectIntent(input: string): Intent {
  const lower = input.toLowerCase();
  for (const { intent, keywords } of PATTERNS) {
    if (keywords.some(kw => lower.includes(kw))) return intent;
  }
  return 'unknown';
}

// ─── Country-specific responses ───────────────────────────────────────────────
type ResponseMap = Partial<Record<CountryCode, string>>;

const RESPONSES: Record<Intent, string | ResponseMap> = {
  greeting: {
    india:     '🙏 Namaste! I\'m ElectIQ, your free election guide for India. Ask me anything about voter registration, what ID to bring, how EVMs work, or your polling booth. How can I help?',
    usa:       '👋 Hi! I\'m ElectIQ, your free US election guide. I can help with voter registration, ID requirements, the Electoral College, mail-in voting, and more. What would you like to know?',
    uk:        '👋 Hello! I\'m ElectIQ, your free UK election guide. Ask me about registering to vote, photo ID rules, First Past the Post, or finding your polling station. What can I help with?',
    australia: '👋 G\'day! I\'m ElectIQ, your free Australian election guide. I can explain compulsory voting, preferential voting, enrolment, and more. What would you like to know?',
    germany:   '👋 Hallo! I\'m ElectIQ, your free German election guide. Ask me about the two-vote system, your polling card, postal voting, or the 5% threshold. How can I help?',
  },

  thanks: '😊 You\'re welcome! Feel free to ask anything else about the election process. I\'m here to help you vote with confidence!',

  register: {
    india:     '📝 **How to Register to Vote in India**\n\n1. Visit **voters.eci.gov.in** or download the **Voter Helpline App**\n2. Click "New Registration" and fill **Form 6**\n3. Upload proof of age (Aadhaar/birth certificate) and proof of address\n4. Submit and note your reference number\n5. A Booth Level Officer (BLO) may visit to verify\n\n**Requirements:** Indian citizen, aged 18+ on the qualifying date (Jan 1 of election year), and a resident of the constituency.\n\n📞 Helpline: **1950**',
    usa:       '📝 **How to Register to Vote in the USA**\n\n1. Visit **vote.gov** — the official federal registration portal\n2. Select your state — each has different rules\n3. Register online, by mail, or in person at your DMV\n4. **Deadline:** Usually 15–30 days before Election Day (varies by state)\n5. Check your registration status at vote.gov\n\n**Requirements:** US citizen, 18+ by Election Day, meet your state\'s residency requirements.\n\n💡 **Tip:** Many states offer automatic registration at the DMV!',
    uk:        '📝 **How to Register to Vote in the UK**\n\n1. Go to **gov.uk/register-to-vote** (takes ~5 minutes)\n2. Enter your National Insurance number and date of birth\n3. Confirm your address\n4. **Deadline:** 12 working days before polling day\n\n**Requirements:** British, Irish, or qualifying Commonwealth citizen, aged 18+ on polling day (16 in Scotland/Wales for devolved elections).\n\n💡 Check if you\'re already registered — you might be from a previous address!',
    australia: '📝 **How to Enrol to Vote in Australia**\n\nEnrolment is **compulsory** for citizens 18+!\n\n1. Visit **aec.gov.au/enrol**\n2. Check if you\'re already enrolled — you may be automatic\n3. Update your details if you\'ve moved (even within the same suburb!)\n4. **Deadline:** 7 days after writs are issued\n\n⚠️ You can be **fined** for not being enrolled.\n\n**Requirements:** Australian citizen, aged 18+, lived at your address for at least 1 month.',
    germany:   '📝 **Voter Registration in Germany**\n\nGood news — **registration is automatic!**\n\nIf you\'re registered at your local **Einwohnermeldeamt** (residents\' office), you\'re automatically on the voter roll. You\'ll receive a **Wahlbenachrichtigung** (polling card) by post ~21 days before the election.\n\n✅ Just make sure your **Meldeadresse is current** — contact your local Gemeindeverwaltung if it\'s outdated or if your polling card doesn\'t arrive.',
  },

  id_documents: {
    india:     '🪪 **Accepted ID Documents at Indian Polling Booths**\n\n**Primary:**\n- Voter ID Card (EPIC)\n\n**Alternatives (any one):**\n- Aadhaar Card\n- Passport\n- Driving Licence\n- PAN Card\n- MNREGA Job Card\n- Bank/Post Office Passbook with photo\n- Health Insurance Smart Card\n- Pension document with photo\n- Central/State Government issued photo ID\n- NPR Smart Card\n\n💡 Bring **any one** of these. Your voter slip (poll card) is **not** a valid ID.',
    usa:       '🪪 **Voter ID Requirements in the USA**\n\nRules vary by state:\n\n**Strict Photo ID States** (e.g. Georgia, Indiana): Passport, driver\'s licence, state-issued ID, military ID\n\n**Non-Strict / Non-Photo States:** Utility bill, bank statement, or government document with name and address\n\n**No ID Required States** (e.g. California, Nevada): Just state your name and address\n\n🔍 **Check your state\'s exact rules at vote.gov** — it\'s the most important step.',
    uk:        '🪪 **Accepted Photo ID to Vote in the UK**\n\n- UK, Irish, or EU passport\n- UK driving licence (can be expired up to 10 years)\n- Blue Badge\n- Older Person\'s Bus Pass\n- Disabled Person\'s Bus Pass\n- Oyster 60+ card\n- Freedom Pass\n- Scottish National Entitlement Card\n- Voter Authority Certificate (**free from gov.uk**)\n- PASS-accredited proof of age card\n\n⚠️ Your **poll card is NOT accepted**. Apply for a free Voter Authority Certificate if you have none of the above.',
    australia: '🪪 **ID Requirements to Vote in Australia**\n\n✅ **No photo ID required!**\n\nSimply tell the polling clerk your **name and address**. They mark you off the roll.\n\nAustralia\'s compulsory enrolment system keeps the roll very accurate, so ID isn\'t needed. If your name isn\'t found, you can cast a **declaration vote** which is checked later.',
    germany:   '🪪 **What to Bring to Vote in Germany**\n\nBring **both** of these:\n1. Your **Wahlbenachrichtigung** (polling card sent by post)\n2. A **photo ID** — national ID card (Personalausweis) or passport\n\n💡 You can vote at any polling station in your constituency if you have your polling card.',
  },

  booth_location: {
    india:     '📍 **How to Find Your Polling Booth in India**\n\n1. Visit **voters.eci.gov.in** → "Know Your Polling Station"\n2. Use the **Voter Helpline App** → search by EPIC number or name\n3. Call **1950** (Voter Helpline)\n4. Check your **Voter Slip** — posted to your address before elections, it shows booth number, address, and your serial number\n\n💡 Go at least once before election day to confirm the address!',
    usa:       '📍 **How to Find Your Polling Place in the USA**\n\n1. Visit **vote.gov** → "Find My Polling Place"\n2. Or visit your **state election website** directly\n3. Some states allow you to vote at **any precinct** in your county — check yours\n4. Your polling place info is also on your voter registration card\n\n💡 Early voting locations may differ from Election Day locations.',
    uk:        '📍 **How to Find Your Polling Station in the UK**\n\n1. Your **poll card** (sent by post) shows your polling station address\n2. Visit **gov.uk/contact-electoral-registration-office** to ask your local council\n3. You **must** vote at your assigned station (unlike some other countries)\n\n💡 Your poll card is NOT required to vote — but it shows you where to go.',
    australia: '📍 **How to Find Your Polling Place in Australia**\n\n1. Visit **aec.gov.au** → "Find a Polling Place"\n2. Enter your address to find your division\'s booths\n3. You can vote at **any polling booth** within your division on election day\n4. Pre-poll centres are also listed — open 2–3 weeks before polling day\n\n💡 There\'s usually a booth at a nearby school or community hall!',
    germany:   '📍 **How to Find Your Polling Station in Germany**\n\nYour **Wahlbenachrichtigung** (polling card) shows:\n- Your assigned polling station name and address\n- Your voter number\n- Opening hours (usually 8am–6pm)\n\nYou can also vote at **any polling station in your constituency** if you bring your polling card.\n\nFor postal voting (Briefwahl), contact your local **Gemeindeverwaltung**.',
  },

  eligibility: {
    india:     '✅ **Eligibility to Vote in India**\n\nYou can vote if you:\n1. Are a **citizen of India**\n2. Are **18 years or older** on January 1 of the election year\n3. Are **registered** in the electoral roll of your constituency\n4. Are of sound mind and not disqualified by law\n5. Are **not serving a prison sentence** at the time of voting\n\n❌ You cannot vote if you are a non-citizen, under 18, or have been legally disqualified.',
    usa:       '✅ **Eligibility to Vote in the USA**\n\nYou can vote if you:\n1. Are a **US citizen** (naturalised citizens can vote in federal elections)\n2. Are **18 years or older** by Election Day\n3. Meet your **state\'s residency requirements**\n4. Are **registered** by your state\'s deadline\n\n❌ Eligibility for people with felony convictions varies widely by state — check vote.gov for your state.',
    uk:        '✅ **Eligibility to Vote in UK General Elections**\n\nYou can vote if you:\n1. Are a **British, Irish, or qualifying Commonwealth citizen**\n2. Are **18 or older** on polling day (16+ in Scotland/Wales for devolved elections)\n3. Are **registered** on the electoral roll\n4. Are a resident in the UK\n\n❌ Citizens of EU countries (other than Ireland) cannot vote in UK General Elections (though they can in local elections).',
    australia: '✅ **Eligibility to Vote in Australia**\n\nVoting is **compulsory** if you:\n1. Are an **Australian citizen**\n2. Are **18 years or older**\n3. Are **enrolled** to vote\n\n❌ Permanent residents cannot vote in federal elections even if they\'ve lived in Australia for decades (only citizens can vote).',
    germany:   '✅ **Eligibility to Vote in German Federal Elections**\n\nYou can vote if you:\n1. Are a **German citizen**\n2. Are **18 years or older** on election day\n3. Have lived in Germany (or abroad) for at least **3 months** before the election\n4. Have not been legally disqualified\n\n💡 16-year-olds can vote in some **state (Landtag)** elections — check your specific state.',
  },

  counting: {
    india:     '🔢 **How Votes Are Counted in India**\n\n1. Counting begins on the announced counting day (usually days after polling ends)\n2. EVMs are brought from strong rooms to counting centres under security\n3. Party agents, candidates, and observers are present\n4. EVMs are unsealed, checked, and counted round by round\n5. In **5 randomly selected EVMs per constituency**, VVPAT slips are manually counted and cross-checked\n6. Results declared constituency by constituency on the ECI website\n\n✅ The entire process is live-streamed on the ECI website.',
    usa:       '🔢 **How Votes Are Counted in the USA**\n\nCounting varies by state:\n- **In-person votes** are usually counted election night\n- **Mail-in ballots** — some states can\'t count until Election Day, so results take days\n- Each county\'s results go to the state, which certifies its result on its own timeline\n- The Associated Press and networks "call" states when margins are clear\n- **Presidential results** are not official until states certify and Congress certifies on January 6\n\n🔑 **Close elections can take days or weeks to fully resolve.**',
    uk:        '🔢 **How Votes Are Counted in the UK**\n\n1. Polls close at exactly **10pm**\n2. An exit poll is published immediately — it\'s usually very accurate\n3. Ballot boxes go to local counting venues (often sports halls)\n4. Counting begins immediately, supervised by party agents\n5. Returning Officers declare each constituency\'s result individually\n6. Most of the 650 results are declared by **3–4am**\n7. A party needs **326 seats** for a majority\n\n📺 The BBC, ITV, and Sky News cover results live through the night.',
    australia: '🔢 **How Votes Are Counted in Australia**\n\n**House of Representatives (Preferential system):**\n1. First-preference votes counted first\n2. If no candidate reaches 50%+1, the last-place candidate is eliminated\n3. Their ballots go to whoever is marked next\n4. Process repeats until one candidate wins\n\n**Senate (Quota system):**\n- Much more complex — takes 2–4 weeks\n- Each state elects 12 senators; territories elect 2\n- Uses the Single Transferable Vote (STV) system\n\n📊 Live results at aec.gov.au from 6pm on election night.',
    germany:   '🔢 **How Votes Are Counted in Germany**\n\n1. Polls close at **6pm** — postal ballots must arrive by then\n2. Local polling stations count their ballots immediately\n3. Results phoned/transmitted to the Federal Returning Officer\n4. **Preliminary results** published on election night\n5. Seats allocated by the Sainte-Laguë method (proportional)\n6. The 5% threshold filters out small parties before allocation\n7. Final official results certified weeks later\n\n📊 Live results at bundeswahlleiter.de from 6pm.',
  },

  voting_day: {
    india:     '🗳️ **What Happens on Polling Day in India**\n\n1. **Arrive** at your assigned booth — check the time (usually 7am–6pm)\n2. **Queue up** — separate queues for men and women at many booths\n3. Show your **photo ID** to the polling officer\n4. Your name is found on the roll and you\'re **marked in the register**\n5. Your **left index finger** is marked with indelible ink\n6. You\'re given a **voter slip** with your serial number\n7. Enter the voting compartment — **press the button** next to your candidate on the EVM\n8. A **VVPAT slip** appears for 7 seconds showing your vote\n\n🔒 Your vote is completely secret.',
    usa:       '🗳️ **What Happens on Election Day in the USA**\n\n1. Go to your **assigned polling place** (check vote.gov)\n2. Show **ID if your state requires it**\n3. Tell the poll worker your name — they check the roll\n4. You may use a **paper ballot or touchscreen machine** depending on your county\n5. Feed your completed ballot into a scanner or drop it in the box\n6. You\'ll receive an **"I Voted" sticker** 🎉\n\n⚡ **If the line is long at closing time, STAY — you have the right to vote.**',
    uk:        '🗳️ **What Happens on Polling Day in the UK**\n\n1. Arrive at your **polling station** (7am–10pm)\n2. Show your **photo ID** — required since 2023\n3. Tell the clerk your name and address\n4. Receive your **ballot paper**\n5. Go to a voting booth — mark **one X** next to your chosen candidate\n6. Fold the ballot and place it in the **ballot box**\n\n🔒 You must vote at your assigned station — you cannot go elsewhere in the UK.',
    australia: '🗳️ **What Happens on Polling Day in Australia**\n\n1. Go to **any polling booth** in your division (or pre-poll centre earlier)\n2. Tell the clerk your **name and address** — no ID needed\n3. Receive your ballot paper(s) — one for the House, one for the Senate\n4. Go to a booth — **number EVERY candidate** in order of preference (1, 2, 3…)\n5. Fold and place in the ballot box\n6. Grab a **democracy sausage** from the sausage sizzle outside! 🌭\n\n⚠️ Not numbering all candidates makes your vote **informal (invalid)**.',
    germany:   '🗳️ **What Happens on Election Day in Germany**\n\n1. Take your **Wahlbenachrichtigung** (polling card) and **photo ID**\n2. Go to your polling station (or any in your constituency)\n3. Receive your **ballot paper** — it has two columns\n4. **Left column (Erststimme):** Put a cross next to your local candidate\n5. **Right column (Zweitstimme):** Put a cross next to your party\n6. Fold and place in the ballot box\n\n💡 You can **split** your two votes — different candidate and party are allowed.',
  },

  results: {
    india:     '📊 **How Election Results Work in India**\n\nIndia uses **First Past the Post** — the candidate with most votes in each constituency wins that seat.\n\n- **543 Lok Sabha seats** are contested\n- A party/alliance needs **272+ seats** for a majority to form the government\n- The President invites the leader of the largest party/coalition to form the government\n- The PM is sworn in, then the Cabinet\n\nFollow live results at **results.eci.gov.in**',
    usa:       '📊 **How US Election Results Work**\n\n**Congress:** Winner of each district/state by popular vote wins the seat.\n\n**President:** It\'s the Electoral College, not popular vote:\n- 538 electors total\n- Need **270 to win**\n- Most states are winner-take-all\n- Results called state by state as networks project winners\n- Not officially certified until **January 6**',
    uk:        '📊 **How UK Election Results Work**\n\nThe UK uses **First Past the Post**:\n- 650 constituencies, one MP each\n- Candidate with **most votes wins** (not necessarily 50%)\n- Party needing **326 seats** for a majority\n- PM typically resigned/appointed by **the morning after** polling day\n- If no majority: hung parliament → coalition talks',
    australia: '📊 **How Australian Election Results Work**\n\n**House of Representatives:** Preferential voting — winner needs 50%+1.\n- 151 seats; need **76 for majority**\n- Most seats called election night\n\n**Senate:** Quota-based proportional — takes weeks\n- Each state elects 12 senators\n- Complex Single Transferable Vote counting',
    germany:   '📊 **How German Election Results Work**\n\nGermany uses **Mixed-Member Proportional**:\n- 299 direct seats + proportional list seats\n- Party needs **5% of second votes** to enter Bundestag\n- Seats distributed proportionally to parties\n- Leading party invited to form a **coalition** (rarely one party has majority)\n- Coalition talks can take **months**',
  },

  authority: {
    india:     '🏛️ **The Election Commission of India (ECI)**\n\nThe ECI is an **independent constitutional body** established January 25, 1950. It manages all elections at national and state levels.\n\n📍 Website: **eci.gov.in**\n📞 Helpline: **1950**\n📱 Apps: Voter Helpline App, cVIGIL\n\nThe ECI has the power to suspend officials, recommend postponing elections, and take action against MCC violations.',
    usa:       '🏛️ **US Election Authorities**\n\n**Federal:** Federal Election Commission (fec.gov) — regulates campaign finance only. Elections themselves are run by **states and counties**.\n\n**Your state** runs your elections — search "[your state] Secretary of State elections" for the official body.\n\n📍 Federal voter info: **vote.gov**',
    uk:        '🏛️ **The Electoral Commission (UK)**\n\nThe Electoral Commission is an independent body that regulates elections and political finance.\n\n📍 Website: **electoralcommission.org.uk**\n\nActual elections are administered by **local Returning Officers** (usually the local council). Register at **gov.uk/register-to-vote**.',
    australia: '🏛️ **The Australian Electoral Commission (AEC)**\n\nThe AEC is an independent federal body that runs all federal elections.\n\n📍 Website: **aec.gov.au**\n📞 Phone: **13 23 26**\n\nState elections are run by separate state electoral commissions.',
    germany:   '🏛️ **Federal Returning Officer (Bundeswahlleiter)**\n\nThe Bundeswahlleiter is the independent federal authority overseeing Bundestag elections.\n\n📍 Website: **bundeswahlleiter.de**\n\nLocal elections are administered by state Landeswahlleiter and local Gemeindeverwaltungen.',
  },

  compulsory: {
    india:     '❓ **Is voting compulsory in India?**\n\nNo — voting is **voluntary** in India. You will not be fined for not voting. However, the ECI and civil society strongly encourage participation as a civic duty.\n\n📊 India\'s voter turnout is typically 60–70% in Lok Sabha elections.',
    usa:       '❓ **Is voting compulsory in the USA?**\n\nNo — voting is **voluntary** in the United States. There is no penalty for not voting. However, local elections often have very low turnout, meaning a small number of engaged voters can have outsized impact.',
    uk:        '❓ **Is voting compulsory in the UK?**\n\nNo — voting is **voluntary** in the United Kingdom. There is no penalty for not voting. UK turnout in general elections is typically 60–70%.',
    australia: '🟡 **Is voting compulsory in Australia?**\n\nYes — voting is **compulsory** for all enrolled citizens aged 18+!\n\n- **First offence:** $22 penalty notice\n- **Without valid reason:** Fine up to $222\n- **Valid reasons include:** illness, remote location, religious grounds, natural disaster\n\nAustralia has had compulsory voting since 1924, resulting in turnout of 90%+.',
    germany:   '❓ **Is voting compulsory in Germany?**\n\nNo — voting is **voluntary** in Germany. There is no penalty for not voting. German federal election turnout is typically 75–80%.',
  },

  postal: {
    india:     '📮 **Postal Voting in India**\n\nPostal voting is available for:\n- **Service voters** (military, paramilitary, government officials posted away)\n- **Voters abroad** in some circumstances\n- **Persons with disabilities** (40%+) and those aged 85+\n\nApply through your Returning Officer. Regular citizens vote in person at their booth.',
    usa:       '📮 **Mail-In / Absentee Voting in the USA**\n\n1. Check your state\'s rules at **vote.gov**\n2. Request your ballot (deadline varies — usually 1–2 weeks before Election Day)\n3. Fill it out, sign the envelope as instructed\n4. Mail early or drop at an official ballot drop box\n5. **Track your ballot** on your state\'s voter portal\n\n🌟 Oregon, Colorado, and Washington automatically mail ballots to all voters.',
    uk:        '📮 **Postal Voting in the UK**\n\n1. Apply at **gov.uk/apply-postal-vote**\n2. **Deadline:** 11 working days before polling day\n3. Your ballot arrives by post — mark your X and return it\n4. Must arrive by **10pm on polling day** to be counted\n\n💡 Apply early — postal packs take several days to arrive.',
    australia: '📮 **Postal Voting in Australia**\n\n1. Apply at **aec.gov.au** for a postal vote\n2. Or apply through the AEC postal voting form\n3. Complete your ballot and return it\n4. **Must be received within 13 days of polling day**\n5. You can also vote at any pre-poll centre in your division\n\n⚡ Pre-poll in-person is faster and more reliable than postal!',
    germany:   '📮 **Postal Voting (Briefwahl) in Germany**\n\n1. Apply for **Briefwahlunterlagen** at your local Gemeindeverwaltung or online at bundeswahlleiter.de\n2. You can apply until approximately **2 days before election day**\n3. Mark your ballot privately (both votes), seal it, and sign the declaration envelope\n4. Return by post or drop it in person\n5. **Must arrive by 6pm on election day** — don\'t leave it to the last day!\n\n💡 Briefwahl is very popular in Germany — millions vote this way.',
  },

  nota: '🚫 **NOTA — None of the Above**\n\nNOTA is available on Indian EVMs, introduced in 2013 after a Supreme Court order.\n\n- Press the NOTA button (last option) to officially register your rejection of all candidates\n- Your vote **is counted** in the total votes cast\n- But NOTA **does not affect the result** — the candidate with most votes still wins\n- No constituency can be "re-elected" even if NOTA gets the most votes\n\n📊 NOTA usage ranges from 0.5% to 2% in Indian elections.\n\n*(NOTA equivalents exist in some other countries under different names)*',

  mcc: '📋 **Model Code of Conduct (MCC) — India**\n\nThe MCC is a set of guidelines issued by the ECI that all political parties and candidates must follow from the **moment elections are announced** until results are declared.\n\n**It prohibits:**\n- Using government resources (vehicles, officials, buildings) for campaigning\n- Announcing new government schemes after announcement date\n- Making communal or caste-based appeals\n- Bribing voters with cash, goods, or alcohol\n- Appealing to voters on the basis of religion, race, or language\n\n**Report violations:** Use the **cVIGIL app** — complaints are resolved within 100 minutes.',

  electoral_college: '🏛️ **The Electoral College — USA**\n\nThe US doesn\'t directly elect the President by popular vote. Instead:\n\n- There are **538 electors** (one per congressional seat + 3 for D.C.)\n- A candidate needs **270 electoral votes** to win\n- Each state gets electors = its House seats + 2 Senate seats\n- **48 states** use winner-take-all (win the state, win all its electors)\n- **Maine and Nebraska** split electors by congressional district\n- Electors formally vote in **mid-December**\n- Congress certifies on **January 6**\n\n💡 It\'s possible to win the Electoral College while losing the popular vote (happened in 2000 and 2016).',

  preferential: '🔢 **Preferential (Ranked Choice) Voting — Australia**\n\nAustralia uses preferential voting for the House of Representatives:\n\n1. **Number every candidate** in order of preference (1 = favourite)\n2. All "1" votes are counted first\n3. If a candidate has **50%+1**, they win immediately\n4. If not, the candidate with **fewest votes is eliminated**\n5. Their ballots go to whoever is marked as the voter\'s next preference\n6. This repeats until one candidate has a majority\n\n✅ This ensures the winner has **broad support**, not just the most votes in a split field.\n\n⚠️ Leaving any boxes unnumbered makes your ballot **informal (invalid)**.',

  two_votes: '🗳️ **Germany\'s Two-Vote System**\n\n**Erststimme (First Vote — left column)**\n- Vote for a **direct candidate** in your local constituency\n- 299 constituencies across Germany\n- Candidate with most votes wins the seat directly (winner-take-all)\n- Like First Past the Post\n\n**Zweitstimme (Second Vote — right column)**\n- Vote for a **party list**\n- Determines the **overall proportion of seats** each party gets in the Bundestag\n- This is considered the **more important vote** for national outcomes\n- Parties need 5% of second votes to enter the Bundestag\n\n💡 You **can split** your vote — e.g. vote for an independent candidate (first) but a major party (second).',

  threshold: '📊 **Germany\'s 5% Threshold (Fünf-Prozent-Hürde)**\n\nTo enter the Bundestag, a party must receive **either:**\n- At least **5% of national second votes (Zweitstimmen)**, OR\n- Win at least **3 direct constituency seats**\n\n**Why does it exist?**\nIt prevents extreme political fragmentation. The Weimar Republic (1919–1933) had dozens of tiny parties making governance nearly impossible — this contributed to political instability. The threshold was introduced in 1949.\n\n**Effect:** Parties just below 5% get **zero seats**, even if millions voted for them. This is controversial but widely supported for stability.',

  faq: 'I\'m here to help! You can ask me about:\n\n🗳️ **Voting** — how to vote, what to bring, what happens at the booth\n📝 **Registration** — how to register or enrol\n🪪 **ID documents** — what\'s accepted at polling stations\n✅ **Eligibility** — age, citizenship, and other requirements\n📅 **Key dates** — registration deadlines, polling day, results\n🔢 **Counting** — how votes are counted and results declared\n📅 **Timeline** — all important election dates\n🏛️ **Institutions** — who runs elections in your country\n\nJust type your question in plain English — I\'ll do my best to answer it!',

  unknown: 'I\'m not sure I understood that — let me suggest some things I can help with:\n\n- **"How do I register to vote?"**\n- **"What ID do I need at the polling booth?"**\n- **"Am I eligible to vote?"**\n- **"How does vote counting work?"**\n- **"Where is my polling station?"**\n- **"What happens on voting day?"**\n\nTry rephrasing your question, or pick one of the suggestions below! 😊',
};

// ─── Main function ────────────────────────────────────────────────────────────
export function getSmartResponse(userInput: string, country: CountryCode): string {
  const intent = detectIntent(userInput);
  const response = RESPONSES[intent];

  if (typeof response === 'string') return response;

  // Country-specific response
  const countryResponse = (response as ResponseMap)[country];
  if (countryResponse) return countryResponse;

  // Fallback: generic with data from election data
  const data = ELECTION_DATA[country];
  if (data) {
    return `For **${data.name}**, the official electoral authority is the **${data.authority}**. Visit ${data.authorityUrl} for the most accurate information.\n\nYou can also ask me specific questions about registration, ID requirements, voting day, or eligibility!`;
  }

  return RESPONSES.unknown as string;
}

// Simulate a short typing delay for natural UX
export function getTypingDelay(response: string): number {
  // 30–80ms per word, capped at 1500ms
  const words = response.split(' ').length;
  return Math.min(300 + words * 25, 1500);
}
