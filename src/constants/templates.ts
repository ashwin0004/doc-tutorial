export const templates = [
    { 
        id: "blank", 
        label: "Blank Document", 
        imageUrl: "/blank-document.svg",
        initialContent: "",
    },
    {
  id: "software-proposal",
  label: "Software development proposal",
  imageUrl: "/software-proposal.svg",
  initialContent: `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>Software Development Proposal</title>
  <style>
    body { font-family: "Nunito", "Montserrat", Arial, sans-serif; color: #333; line-height: 1.4; padding: 28px; max-width: 900px; margin: auto; background: #fff; }
    h1.title { color: #0b6374; font-family: "Maven Pro", sans-serif; font-size: 32px; margin-bottom: 6px; }
    h2, h3 { color: #424242; margin-top: 28px; margin-bottom: 8px; }
    h3.small { color: #0b6374; font-family: "Maven Pro", sans-serif; font-size: 13px; margin-bottom: 6px; }
    p { margin: 0 0 12px 0; }
    .meta { margin-bottom: 18px; }
    .two-column { display:flex; gap: 28px; }
    .col { flex:1; }
    .address { text-align:right; font-size: 0.95rem; color:#666; }
    .section { margin-top: 18px; }
    table { width:100%; border-collapse: collapse; margin-top: 12px; }
    td, th { padding: 8px; border: 1px solid #e6e6e6; text-align:left; }
    .signature { margin-top: 28px; }
    .placeholder { color: #666; font-style: italic; }
    ul { margin: 8px 0 12px 20px; }
  </style>
</head>
<body>

  <header>
    <h1 class="title">SOFTWARE DEVELOPMENT PROPOSAL</h1>
    <div class="meta two-column">
      <div class="col">
        <h3 class="small">PREPARED FOR</h3>
        <p class="placeholder">Client’s name</p>
        <p class="placeholder">Client’s company name</p>
      </div>
      <div class="col address">
        <p class="placeholder">[YOUR COMPANY’S LETTERHEAD]</p>
        <p>JUN 07, 20XX</p>
      </div>
    </div>

    <div class="meta">
      <h3 class="small">PREPARED BY</h3>
      <p class="placeholder">Your name</p>
      <p class="placeholder">Your company name</p>
    </div>
  </header>

  <section class="section cover-letter">
    <p>Dear <span class="placeholder">[CLIENT’S NAME]</span>,</p>

    <p>Re: Enclosed Software Development Proposal</p>

    <p>Please find enclosed our detailed software proposal for your kind consideration.</p>

    <p>At <strong>[YOUR COMPANY’S NAME]</strong> we are aware that creating client-oriented software takes a mixture of technical excellence and clear communication. Our firm hires only the very best to ensure you receive both. We know that every client is unique and we strive to deliver an individual, innovative and affordable proposal every time and to follow it through with an outstanding delivery which is both on time and within budget.</p>

    <p>We have over <span class="placeholder">[YEARS]</span> of development experience in this area and our previous clients include <span class="placeholder">[PREVIOUS CLIENTS]</span>. Please let us know if you would like to get in touch with our existing clients from whom you will receive nothing but positive endorsements. You may also wish to review our website at <span class="placeholder">[WEBSITE]</span> to see our portfolio of previous work and learn more about our organization.</p>

    <p>We also pride ourselves on our after-sales client-care including our guarantees, staff-training and onsite and offsite support.</p>

    <p>Finally, we realize that you are very busy and wanted to thank you in advance for your time spent reviewing our proposal.</p>

    <div class="signature">
      <p>Yours Truly,</p>
      <p class="placeholder">[YOUR NAME]</p>
    </div>
  </section>

  <hr/>

  <section class="section executive-summary">
    <h2>EXECUTIVE SUMMARY</h2>
    <p class="placeholder">[150–600 word summary of the report that provides a high-level overview of the project]</p>
  </section>

  <section class="section acceptance">
    <h2>Signed as accepted by client</h2>
    <table>
      <tr>
        <td>
          <strong>Client signature</strong>
          <div style="height:60px;"></div>
          <p class="placeholder">[NAME], [TITLE]</p>
        </td>
        <td>
          <strong>Date</strong>
          <div style="height:60px;"></div>
          <p class="placeholder">[DATE]</p>
        </td>
      </tr>
    </table>
  </section>

  <section class="section">
    <h2>1. Project Overview</h2>
    <p class="placeholder">[A detailed description of the project stating the aims, scope and intended operation]</p>
  </section>

  <section class="section">
    <h2>2. Obstacles</h2>
    <p class="placeholder">[A description of the possible risks involved with the project and how you will manage them]</p>
  </section>

  <section class="section">
    <h2>3. Technical Obstacles</h2>
    <p class="placeholder">[Any technical obstacles like integration between different systems, as well as mitigation strategies]</p>
  </section>

  <section class="section">
    <h2>4. Industry and Market Risks</h2>
    <p class="placeholder">[Any industry or market-related risks]</p>
  </section>

  <section class="section">
    <h2>5. Budgetary Risks</h2>
    <p class="placeholder">[Budgetary risks]</p>
  </section>

  <section class="section">
    <h2>6. Proposed Approach & Deliverables</h2>
    <p class="placeholder">[High-level delivery plan, milestones, and key deliverables]</p>

    <h3>Project Phases</h3>
    <ul>
      <li><strong>Initiation & Planning:</strong> <span class="placeholder">[timeframe]</span></li>
      <li><strong>Development:</strong> <span class="placeholder">[timeframe]</span></li>
      <li><strong>Testing & Deployment:</strong> <span class="placeholder">[timeframe]</span></li>
      <li><strong>Support & Training:</strong> <span class="placeholder">[timeframe]</span></li>
    </ul>
  </section>

  <section class="section">
    <h2>7. Pricing</h2>
    <p class="placeholder">[Estimated cost breakdown, payment terms and assumptions]</p>
  </section>

  <section class="section">
    <h2>8. Training Schedule (example)</h2>
    <table>
      <thead>
        <tr>
          <th>Section</th>
          <th>Activity</th>
          <th>Location</th>
          <th>Duration (days)</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>5.1</td>
          <td>Inhouse training</td>
          <td>Client meeting</td>
          <td>16</td>
          <td>14/06/15</td>
        </tr>
        <tr>
          <td>5.2</td>
          <td>AdHoc training</td>
          <td>None</td>
          <td>4</td>
          <td>30/06/15</td>
        </tr>
      </tbody>
    </table>
  </section>

  <section class="section">
    <h2>9. Support & Maintenance</h2>
    <p class="placeholder">[Support offerings, SLA, response times, etc.]</p>
  </section>

  <section class="section">
    <h2>10. Terms & Conditions</h2>
    <p class="placeholder">[Legal terms and contract conditions]</p>
  </section>

  <footer style="margin-top:40px; font-size:0.95rem; color:#666;">
    <p class="placeholder">Contact: your.email@example.com | Your Company Name | Address line</p>
  </footer>

</body>
</html>`,
},

    { 
        id: "project-proposal", 
        label: "Project proposal", 
        imageUrl: "/project-proposal.svg",
        initialContent: `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>Project Proposal</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.5; color:#333; padding: 28px; max-width: 900px; margin: auto; }
    h1, h2, h3 { margin-top: 24px; }
    h1.title { font-size: 32px; color:#554c3b; font-weight:700; margin-top: 40px; }
    .date { margin-top: 8px; font-size: 14px; }
    .contact { margin-top: 40px; }
    .contact p { margin: 4px 0; }
    .section { margin-top: 32px; }
    ol { padding-left: 22px; }
  </style>
</head>
<body>

  <!-- HEADER + HERO SECTION -->
  <h1 class="title">Project Name</h1>
  <p class="date">09.04.20XX</p>

  <div class="contact">
    <p><strong>Your Name</strong></p>
    <p>Your Company</p>
    <p>123 Your Street</p>
    <p>Your City, ST 12345</p>
  </div>

  <!-- PAGE 2 CONTENT -->
  <div class="section">
    <h2>1. Overview</h2>
    <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet 
      dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper.</p>
  </div>

  <div class="section">
    <h2>Goals</h2>
    <ol>
      <li>Lorem ipsum dolor sit amet, consectetuer adipiscing elit</li>
      <li>Sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.</li>
    </ol>
  </div>

  <div class="section">
    <h2>Specifications</h2>
    <p>Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer 
      possim assum. Typi non habent claritatem insitam; est usus legentis in iis qui facit eorum claritatem. Investigationes 
      demonstraverunt lectores legere me lius quod ii legunt saepius.</p>
  </div>

  <div class="section">
    <h2>Lorem Ipsum</h2>
    <p>Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu 
      feugiat nulla facilisis at vero eros et accumsan.</p>
  </div>

  <div class="section">
    <h2>Milestones</h2>

    <h3>I. Lorem ipsum</h3>
    <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet 
      dolore magna aliquam erat volutpat.</p>

    <h3>II. Dolor sit amet</h3>
    <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet 
      dolore magna aliquam erat volutpat.</p>
  </div>

</body>
</html>
`,
    },

    { 
        id: "business-letter", 
        label: "Business letter", 
        imageUrl: "/business-letter.svg",
        initialContent: `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<title>Business Letter</title>
<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;700&display=swap" rel="stylesheet">
<style>
  body{font-family:"Nunito", Arial, sans-serif; max-width:760px;margin:30px auto;padding:28px;color:#222;}
  header{font-weight:700;color:#0b6374;}
  .meta{margin-top:8px;color:#777;}
  p{line-height:1.6;}
</style>
</head>
<body>
  <header>YOUR COMPANY</header>
  <div class="meta">123 YOUR STREET • YOUR CITY, ST 12345 • (123) 456-7890 • NO_REPLY@EXAMPLE.COM</div>

  <div style="margin-top:20px;">September 04, 20XX</div>

  <p>Dear Ms. Reader,</p>
  <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.</p>

  <p>Sincerely,<br/>YOUR NAME</p>
</body>
</html>
`,
    },

    {
    id: "resume",
    label: "Resume",
    imageUrl: "/resume.svg",
    initialContent: `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<title>Resume — Your Name</title>
<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;700&family=Maven+Pro:wght@700&display=swap" rel="stylesheet">
<style>
  body{font-family:"Nunito", Arial, sans-serif; max-width:900px;margin:28px auto;padding:32px;color:#222;}
  .name{font-family:"Maven Pro",sans-serif;font-size:28px;color:#222;}
  .contact{color:#666;margin-bottom:18px;}
  h2{color:#222;margin-top:18px;}
  .skills, .experience{margin-top:12px;}
  .photo{float:right;margin-left:12px;}
  .photo img{width:140px;border-radius:6px;}
</style>
</head>
<body>
  <div class="header">
    <div class="name">Your Name</div>
    <div class="contact">Creative Director • 123.456.7890 • no_reply@example.com</div>
  </div>

  <div class="photo"><img src="/resume-1.png" alt="photo"></div>

  <section class="skills">
    <h2>Skills</h2>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean ac interdum nisi.</p>
  </section>

  <section class="experience">
    <h2>Experience</h2>
    <p><strong>Company Name / Job Title</strong><br/>MONTH 20XX - PRESENT, LOCATION<br/>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
    <p><strong>Company Name / Job Title</strong><br/>MONTH 20XX - MONTH 20XX, LOCATION</p>
  </section>

  <section class="education">
    <h2>Education</h2>
    <p>School Name / Degree • MONTH 20XX - MONTH 20XX</p>
  </section>

  <div style="clear:both;"></div>
</body>
</html>
`,
},

    {
    id: "cover-letter",
    label: "Cover letter",
    imageUrl: "/cover-letter.svg",
    initialContent: `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<title>Informal Letter</title>
<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;700&display=swap" rel="stylesheet">
<style>
  body{font-family:"Nunito", Arial, sans-serif; max-width:700px;margin:30px auto;padding:32px;color:#222;background:#fff;}
  .from{color:#1f6f7a;}
  p{line-height:1.6;}
</style>
</head>
<body>
  <div class="from">Your Band<br/>September 04, 20XX</div>
  <p>Hellofan,</p>
  <p>First, a big thank you!</p>
  <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.</p>
  <p>Lots of love,<br/>Your Name</p>
</body>
</html>
`,
},

    {
    id: "letter",
    label: "Letter",
    imageUrl: "/letter.svg",
    initialContent: `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<title>Formal Letter</title>
<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;700&display=swap" rel="stylesheet">
<style>
  body{font-family:"Nunito", Arial, sans-serif; max-width:720px;margin:30px auto;padding:28px;color:#222;}
  .header p{margin:0;}
  .date{margin-top:14px;margin-bottom:18px;color:#666;}
  p{line-height:1.6;}
  .signature{margin-top:28px;}
</style>
</head>
<body>
  <div class="header">
    <p>Your Name</p>
    <p>123 Your Street</p>
    <p>Your City, ST 12345</p>
    <p>(123) 456-7890 • no_reply@example.com</p>
  </div>
  <div class="date">4th September 20XX</div>

  <p>Ronny Reader<br/>CEO, Company Name<br/>123 Address St<br/>Anytown, ST 12345</p>

  <p>Dear Ms. Reader,</p>
  <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.</p>

  <p class="signature">Sincerely,<br/>Your Name</p>

  <div style="margin-top:20px;"><img src="/letter-1.png" alt="letter decorative" style="max-width:220px;"></div>
</body>
</html>
`,
},

    {
    id: "report",
    label: "Report",
    imageUrl: "/Report.png",
    initialContent: `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<title>Report Title</title>
<link href="https://fonts.googleapis.com/css2?family=Maven+Pro:wght@700&family=Nunito:wght@400&display=swap" rel="stylesheet">
<style>
  body{font-family:"Nunito", Arial, sans-serif; max-width:900px;margin:30px auto;padding:28px;color:#222;}
  .eyebrow{font-size:12px;color:#999;}
  h1{font-family:"Maven Pro",sans-serif;font-size:42px;margin:6px 0;color:#222;}
  .hero-image{margin-top:18px;}
  .hero-image img{width:100%;height:auto;border-radius:4px;}
  h2{margin-top:22px;}
  p{line-height:1.6;color:#444;}
</style>
</head>
<body>
  <div class="eyebrow">COURSE NAME</div>
  <h1>REPORT TITLE<br/>LOREM IPSUM DOLOR SIT AMET</h1>
  <div class="hero-image"><img src="/report-1.png" alt="Report image"></div>

  <section>
    <h2>Introduction</h2>
    <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.</p>
  </section>

  <section>
    <h2>Content</h2>
    <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.</p>
    <img src="/report-2.jpeg" alt="decor" style="max-width:100%;margin-top:12px;border-radius:4px;">
  </section>
</body>
</html>
`,
},

    {
    id: "recipe",
    label: "Recipe",
    imageUrl: "/Recipe.png",
    initialContent: `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<title>Strawberry Vanilla Pancakes</title>
<link href="https://fonts.googleapis.com/css2?family=Maven+Pro:wght@700&family=Nunito:wght@400&display=swap" rel="stylesheet">
<style>
  body{font-family:"Nunito", Arial, sans-serif; max-width:780px;margin:28px auto;padding:24px;color:#333;}
  h1{font-family:"Maven Pro",sans-serif;color:#d9486f;font-size:36px;margin-bottom:6px;}
  .meta{color:#777;font-weight:600;margin-bottom:16px;}
  .layout{display:flex;gap:20px;align-items:flex-start;}
  .layout img{width:260px;border-radius:6px;}
  .col{flex:1}
  ul{margin-left:18px;}
</style>
</head>
<body>
  <h1>Strawberry Vanilla Pancakes</h1>
  <div class="meta">Ready in 20 minutes • Serves 8 • 280 calories</div>

  <div class="layout">
    <img src="/recipe-1.jpeg" alt="Pancakes">
    <div class="col">
      <h2>Ingredients</h2>
      <ul>
        <li>Lorem ipsum dolor sit amet</li>
        <li>Consectetuer adipiscing elit</li>
        <li>Suspendisse scelerisque</li>
        <li>Libero interdum auctor</li>
      </ul>

      <h2>Preparation</h2>
      <ol>
        <li>Lorem ipsum dolor sit amet, consectetuer adipiscing elit sed do tempor incididunt ut labore et dolore magna aliqua.</li>
        <li>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</li>
        <li>Suspendisse scelerisque mi a mi.</li>
        <li>Vestibulum ante ipsum primis elementum, libero interdum auctor cursus.</li>
        <li>Phasellus vehicula nonummy nunc.</li>
        <li>Ullamco laboris nisi ut aliquip ex ea commodo consequat.</li>
      </ol>

      <h3>Tips</h3>
      <p>Lorem ipsum dolor sit amet consectetuer adipiscing elit sed do tempor incididunt ut labore et dolore magna aliqua.</p>
    </div>
  </div>
</body>
</html>
`,
},

    {
    id: "brochure",
    label: "Brochure",
    imageUrl: "/Brochure.png",
    initialContent: `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<title>Product Brochure</title>
<link href="https://fonts.googleapis.com/css2?family=Maven+Pro:wght@700&family=Nunito:wght@400;700&display=swap" rel="stylesheet">
<style>
  body{font-family:"Nunito", Arial, sans-serif; color:#333; max-width:920px; margin:30px auto; padding:32px;}
  .brand{font-family:"Maven Pro", sans-serif; color:#6b56d9; font-size:18px;}
  h1{font-family:"Maven Pro", sans-serif; font-size:40px; color:#26388b; margin:8px 0;}
  .date{color:#d0639b;}
  .hero{display:flex; gap:28px; align-items:flex-start; margin-top:18px;}
  .hero img{max-width:320px; border-radius:8px;}
  h2{margin-top:22px;color:#222;}
  p{line-height:1.6;color:#555;}
  .accent{color:#d63d79;font-weight:700;}
</style>
</head>
<body>
  <div class="brand">Your Company<br/><small>123 Your Street • Your City, ST 12345 • (123) 456 - 7890</small></div>
  <h1>Product Brochure</h1>
  <div class="date">September 04, 20XX</div>

  <section class="hero">
    <div style="flex:1">
      <h2>Product Overview</h2>
      <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
      <p class="accent">Lorem ipsum</p>
      <p>Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum.</p>
    </div>
    <div>
      <img src="/brochure-1.png" alt="Product image">
    </div>
  </section>

  <section>
    <h2>Details</h2>
    <p>Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. Investigationes demonstraverunt lectores legere me lius quod ii legunt saepius.</p>
    <img src="/brochure-2.jpeg" alt="decorative" style="max-width:100%;margin-top:12px;border-radius:6px;">
    <p style="margin-top:12px;">Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis.</p>
  </section>

  <footer style="margin-top:28px;color:#666;font-size:14px;">Contact: your.email@example.com</footer>
</body>
</html>
`,
},

    {
    id: "class-note",
    label: "Class-note",
    imageUrl: "/Class-note.png",
    initialContent: `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<title>Class Notes — Biology</title>
<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;700&family=Montserrat:wght@400;700&display=swap" rel="stylesheet">
<style>
  body{font-family:"Nunito", "Montserrat", Arial, sans-serif; background:#fbf7f0; color:#222; max-width:760px; margin:32px auto; padding:28px;}
  .school{font-size:13px;color:#444;}
  h1{font-family:"Montserrat", sans-serif; font-size:36px; color:#0b7a6f; margin:16px 0;}
  h2{font-size:22px;color:#333;margin-top:18px;}
  p, li{font-size:15px;line-height:1.6;color:#333;}
  ul{margin-left:20px;}
</style>
</head>
<body>
  <p class="school">Brookside School for Science<br/>Fall Semester 20XX<br/>Teacher: Ms. Wendy Writer<br/>Email: no_reply@example.com</p>
  <h1>9TH GRADE<br/>BIOLOGY</h1>
  <h2>Notes</h2>
  <h3>Introduction: Why Biology?</h3>
  <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet
     dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper
     suscipit lobortis nisl ut aliquip ex ea commodo consequat.</p>

  <ul>
    <li>At vero eos et accusam et justo duo dolores et ea rebum
      <ul>
        <li>Ut wisi enim ad minim veniam.</li>
        <li>Quis nostrud exerci tation ullamcorper.</li>
        <li>Suscipit lobortis nisl ut aliquip ex ea commodo consequat.</li>
      </ul>
    </li>
  </ul>

  <p>Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu
     feugiat nulla facilisis at vero eros et accumsan.</p>

  <h3>Lorem ipsum dolor</h3>
  <ul>
    <li>At vero eos et accusam et justo duo dolores et ea rebum</li>
    <li>Ut wisi enim ad minim veniam.</li>
  </ul>
</body>
</html>
`,
},
];