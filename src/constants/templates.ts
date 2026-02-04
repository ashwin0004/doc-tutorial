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
    initialContent: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Project Proposal</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px;
        }
        .header {
            margin-bottom: 40px;
        }
        .project-name {
            font-size: 2.5em;
            font-weight: bold;
            margin-bottom: 5px;
        }
        .date {
            font-size: 1.2em;
            color: #666;
            margin-bottom: 20px;
        }
        .divider {
            border-top: 2px solid #000;
            width: 100px;
            margin: 20px 0;
        }
        .contact-info {
            margin-top: 20px;
        }
        h1 {
            border-bottom: 1px solid #ccc;
            padding-bottom: 10px;
            margin-top: 40px;
            color: #2c3e50;
        }
        h2 {
            color: #34495e;
            margin-top: 30px;
        }
        ul, ol {
            margin-bottom: 20px;
        }
    </style>
</head>
<body>

    <div class="header">
        <div class="project-name">Project Name</div>
        <div class="date">09.04.20XX</div>
        <div class="divider"></div>
        <div class="contact-info">
            <strong>Your Name</strong><br>
            Your Company<br>
            123 Your Street<br>
            Your City, ST 12345
        </div>
    </div>

    <h1>Overview</h1>
    <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. [cite_start]Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper. [cite: 1]</p>

    <h1>Goals</h1>
    <ol>
        [cite_start]<li>Lorem ipsum dolor sit amet, consectetuer adipiscing elit [cite: 1]</li>
        [cite_start]<li>Sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. [cite: 1]</li>
    </ol>

    <h1>Specifications</h1>
    <p>Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. Typi non habent claritatem insitam; est usus legentis in iis qui facit eorum claritatem. [cite_start]Investigationes demonstraverunt lectores legere me lius quod ii legunt saepius. [cite: 1]</p>

    <h2>Lorem Ipsum</h2>
    [cite_start]<p>Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan. [cite: 1]</p>

    <h1>Milestones</h1>
    <ol>
        <li>
            <h2>Lorem ipsum</h2>
            [cite_start]<p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. [cite: 1]</p>
        </li>
        <li>
            <h2>Dolor sit amet</h2>
            [cite_start]<p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. [cite: 1]</p>
        </li>
    </ol>

</body>
</html>
`,
  },

  {
    id: "business-letter",
    label: "Business letter",
    imageUrl: "/business-letter.svg",
    initialContent: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Business Letter Template</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px;
        }
        .header {
            margin-bottom: 40px;
        }
        h1 {
            font-size: 24px;
            font-weight: bold;
            color: #d32f2f; /* Approximating the red color often found in this template style */
            margin-bottom: 5px;
            margin-top: 0;
        }
        .sender-info {
            font-size: 14px;
            color: #555;
            margin-bottom: 20px;
        }
        .date {
            margin-bottom: 20px;
        }
        .recipient-info {
            margin-bottom: 20px;
        }
        .content {
            margin-bottom: 20px;
        }
        p {
            margin-bottom: 15px;
        }
        .signature {
            margin-top: 40px;
        }
    </style>
</head>
<body>

    <div class="header">
        <h1>Your Company</h1>
        <div class="sender-info">
            123 Your Street<br>
            Your City, ST 12345<br>
            (123) 456-7890<br>
            no_reply@example.com
        </div>
    </div>

    <div class="date">
        September 04, 20XX
    </div>

    <div class="recipient-info">
        Ms. Ronny Reader<br>
        123 Address St<br>
        Anytown, ST 12345
    </div>

    <div class="content">
        <p>Dear Ms. Reader,</p><br>

        <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.</p>

        <p>Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan.</p>

        <p>Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. Typi non habent claritatem insitam; est usus legentis in iis qui facit eorum claritatem. Investigationes demonstraverunt lectores legere me lius quod ii legunt saepius.</p>
    </div>

    <div class="signature">
        <p>Best regards,</p>
        <p><strong>Your Name</strong><br>
        CEO, Your Company</p>
    </div>

</body>
</html>
`,
  },

  {
    id: "resume",
    label: "Resume",
    imageUrl: "/resume.svg",
    initialContent: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Resume Template</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.5;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px;
        }
        .header {
            text-align: center;
            margin-bottom: 40px;
        }
        .name {
            font-size: 2em;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 2px;
            margin-bottom: 10px;
            color: #2c3e50;
        }
        .contact-info {
            font-size: 0.9em;
            color: #555;
            margin-bottom: 20px;
        }
        h1 {
            font-size: 1.2em;
            color: #2c3e50; /* Dark blue/grey often used in this style */
            text-transform: uppercase;
            border-bottom: 2px solid #2c3e50;
            padding-bottom: 5px;
            margin-top: 30px;
            letter-spacing: 1px;
        }
        h2 {
            font-size: 1em;
            font-weight: bold;
            margin-top: 20px;
            margin-bottom: 5px;
        }
        .date-location {
            font-size: 0.9em;
            color: #666;
            margin-bottom: 10px;
            font-style: italic;
        }
        ul {
            margin-top: 5px;
            padding-left: 20px;
        }
        li {
            margin-bottom: 5px;
        }
        p {
            margin-bottom: 10px;
        }
    </style>
</head>
<body>

    <div class="header">
        <div class="name">Your Name</div>
        <div class="contact-info">
            123 Your Street, Your City, ST 12345<br>
            (123) 456-7890 | no_reply@example.com
        </div>
    </div>

    <h1>Skills</h1>
    <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.</p>

    <h1>Experience</h1>

    <h2>Company Name, Location — Job Title</h2>
    <div class="date-location">Month 20XX - Present</div>
    <ul>
        <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
        <li>Aenean ac interdum nisi. Sed in consequat mi.</li>
        <li>Sed in consequat mi, sed pulvinar lacinia felis eu finibus.</li>
    </ul>

    <h2>Company Name, Location — Job Title</h2>
    <div class="date-location">Month 20XX - Month 20XX</div>
    <ul>
        <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
        <li>Aenean ac interdum nisi. Sed in consequat mi.</li>
    </ul>

    <h2>Company Name, Location — Job Title</h2>
    <div class="date-location">Month 20XX - Month 20XX</div>
    <ul>
        <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
        <li>Aenean ac interdum nisi. Sed in consequat mi.</li>
        <li>Sed pulvinar lacinia felis eu finibus.</li>
    </ul>

    <h1>Education</h1>

    <h2>School Name, Location — Degree</h2>
    <div class="date-location">Month 20XX - Month 20XX, Location</div>
    <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore.</p>

    <h1>Awards</h1>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
    <p>Aenean ac interdum nisi.</p>

</body>
</html>
`,
  },

  {
    id: "cover-letter",
    label: "Cover letter",
    imageUrl: "/cover-letter.svg",
    initialContent: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cover Letter - Jamie Andrews</title>
    <style>
        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px;
            background-color: #ffffff;
        }
        .header {
            border-bottom: 2px solid #333;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .name {
            font-size: 24px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 10px;
        }
        .contact-info {
            font-size: 14px;
            color: #555;
        }
        .date {
            margin-bottom: 30px;
            font-weight: bold;
        }
        .recipient-section {
            margin-bottom: 30px;
        }
        .recipient-name {
            font-weight: bold;
        }
        .content p {
            margin-bottom: 15px;
            text-align: justify;
        }
        .signature-section {
            margin-top: 40px;
        }
        .signature {
            font-family: 'Courier New', Courier, monospace; /* Simulating a typed signature or leave blank for wet signature */
            font-size: 18px;
            font-weight: bold;
            margin-top: 30px;
            color: #000;
        }
    </style>
</head>
<body>

    <div class="header">
        <div class="name">Jamie Andrews</div>
        <div class="contact-info">
            1111 Main St.<br>
            St. Louis, MO 63115<br>
            314-111-1111<br>
            jamiesneverwrong@yahoo.com
        </div>
    </div>

    <div class="date">
        November 5, 2014
    </div>

    <div class="recipient-section">
        <div class="recipient-name">Hiring Manager</div>
        Gold’s Gym<br>
        Maryland Heights
    </div>

    <div class="content">
        <p>Dear Hiring Manager,</p>

        <p>I am writing today to apply for the position of Front Desk Associate at Gold’s Gym in Maryland Heights.</p>

        <p>My previous experience a a sales clerk at IGA as well as my personal interest in your company makes me a ideal candidate for this position.</p>

        <p>As a sales clerk, I was responsible for interacting with customers on a daily basis. I’m a punctual and dependable employee who always come to work with a smile. I prided myself on ensuring that every person who went through my aisle had a positive experience and many of them was repeat customers.</p>

        <p>In that position, I learned many valuable skills. I was able to use the cash register effectively. In fact, I was repeatedly one of the most accurate cashier, receiving no warnings for inaccurate totals during my two years on the job. I also learn many new valuable computer skills when our store switched to a new cash register system ten months ago.</p>

        <p>In addition, I am an avid weight lifter and would bring to this position my personal enthusiasm and expertise I would be able to inform Gold’s Gym customers of there options when it comes to personal fitness and help them make choices that will ensure they are satisfied with their experience.</p>

        <p>I look forward to meeting with you too further discuss how my skills and expertises would match the needs of Gold’s Gym for this position. Thank you for your consideration.</p>
    </div>

    <div class="signature-section">
        <p>Sincerely,</p>
        <div class="signature">Jamie Andrews</div>
    </div>

</body>
</html>
`,
  },

  {
    id: "letter",
    label: "Letter",
    imageUrl: "/letter.svg",
    initialContent: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cover Letter – Jamie Andrews</title>

    <style>
        body {
            font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
            background-color: #ffffff;
            color: #222;
            margin: 0;
            padding: 0;
        }

        .page {
            max-width: 820px;
            margin: 50px auto;
            padding: 50px;
            box-sizing: border-box;
        }

        /* HEADER */
        .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            border-bottom: 2px solid #222;
            padding-bottom: 25px;
            margin-bottom: 40px;
        }

        .name {
            font-size: 26px;
            font-weight: 700;
            letter-spacing: 1px;
            text-transform: uppercase;
        }

        .contact-info {
            text-align: right;
            font-size: 14px;
            line-height: 1.6;
            color: #444;
        }

        /* DATE */
        .date {
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 35px;
        }

        /* RECIPIENT */
        .recipient {
            margin-bottom: 30px;
            font-size: 15px;
            line-height: 1.5;
        }

        .recipient strong {
            display: block;
            font-weight: 700;
        }

        /* CONTENT */
        .content p {
            margin-bottom: 16px;
            text-align: justify;
            font-size: 15px;
            line-height: 1.7;
        }

        /* SIGNATURE */
        .signature-section {
            margin-top: 50px;
        }

        .signature-name {
            margin-top: 35px;
            font-size: 18px;
            font-weight: 700;
        }

        /* PRINT FRIENDLY */
        @media print {
            body {
                background: none;
            }
            .page {
                margin: 0;
                padding: 40px;
            }
        }
    </style>
</head>
<body>

    <div class="page">

        <!-- HEADER -->
        <div class="header">
            <div class="name">Jamie Andrews</div>
            <div class="contact-info">
                1111 Main St.<br>
                St. Louis, MO 63115<br>
                314-111-1111<br>
                jamiesneverwrong@yahoo.com
            </div>
        </div>

        <!-- DATE -->
        <div class="date">
            November 5, 2014
        </div>

        <!-- RECIPIENT -->
        <div class="recipient">
            <strong>Hiring Manager</strong>
            Gold’s Gym<br>
            Maryland Heights
        </div>

        <!-- CONTENT -->
        <div class="content">
            <p>Dear Hiring Manager,</p><br>

            <p>
                I am writing to apply for the position of Front Desk Associate at Gold’s Gym in Maryland Heights.
            </p><br>

            <p>
                My previous experience as a sales clerk at IGA, combined with my personal interest in your company, makes me an ideal candidate for this position.
            </p>

            <p>
                As a sales clerk, I interacted with customers daily and developed strong communication and customer service skills. I am a punctual and dependable employee who consistently arrives with a positive attitude. I took pride in ensuring every customer had a positive experience, many of whom became repeat customers.
            </p>

            <p>
                During my time at IGA, I gained valuable technical skills, including operating the cash register accurately and efficiently. I was repeatedly recognized as one of the most accurate cashiers, receiving no warnings for incorrect totals throughout my two years of employment. I also adapted quickly when the store transitioned to a new register system.
            </p>

            <p>
                Additionally, I am an avid weight lifter and would bring genuine enthusiasm and fitness knowledge to this role. I would enjoy helping Gold’s Gym members understand their fitness options and ensuring they feel confident and satisfied with their experience.
            </p>

            <p>
                I look forward to the opportunity to further discuss how my skills and experience align with the needs of Gold’s Gym. Thank you for your time and consideration.
            </p>
        </div>

        <!-- SIGNATURE -->
        <div class="signature-section">
            <p>Sincerely,</p>
            <div class="signature-name">Jamie Andrews</div>
        </div>

    </div>

</body>
</html>
`,
  },

  {
    id: "report",
    label: "Report",
    imageUrl: "/Report.png",
    initialContent: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Report Template</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px;
            background-color: #fff;
        }
        .header {
            text-align: center;
            margin-bottom: 60px;
        }
        .course-name {
            font-size: 1.2em;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 2px;
            margin-bottom: 20px;
        }
        .report-title {
            font-size: 3em;
            font-weight: bold;
            color: #2c3e50;
            margin: 0;
            line-height: 1.2;
        }
        .subtitle {
            font-size: 1.5em;
            color: #7f8c8d;
            margin-top: 20px;
            font-style: italic;
        }
        h1 {
            color: #2c3e50;
            font-size: 2em;
            margin-top: 40px;
            border-bottom: 2px solid #eee;
            padding-bottom: 10px;
        }
        h2 {
            color: #34495e;
            font-size: 1.5em;
            margin-top: 30px;
        }
        h3 {
            color: #555;
            font-size: 1.2em;
            margin-top: 25px;
            font-weight: bold;
        }
        p {
            margin-bottom: 15px;
            text-align: justify;
        }
    </style>
</head>
<body>

    <div class="header">
        <div class="course-name">COURSE NAME</div>
        <div class="report-title">REPORT TITLE</div>
        <div class="subtitle">LOREM IPSUM DOLOR SIT AMET</div>
    </div>

    <h1>Introduction</h1>
    <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan.</p>

    <h2>Lorem ipsum</h2>
    <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan. Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. Typi non habent claritatem insitam; est usus legentis in iis qui facit eorum claritatem. Investigationes demonstraverunt lectores legere me lius quod ii legunt saepius.</p>

    <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.</p>

    <h3>Dolor sit amet</h3>
    <p>Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. Typi non habent claritatem insitam; est usus legentis in iis qui facit eorum claritatem. Investigationes demonstraverunt lectores legere me lius quod ii legunt saepius. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan.</p>

</body>
</html>
`,
  },

  {
    id: "recipe",
    label: "Recipe",
    imageUrl: "/Recipe.png",
    initialContent: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Strawberry Vanilla Pancakes</title>

    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
            background: #ffffff;
            color: #222;
        }

        .page {
            max-width: 900px;
            margin: 50px auto;
            padding: 40px;
            box-sizing: border-box;
        }

        .grid {
            display: grid;
            grid-template-columns: 40% 60%;
            gap: 50px;
        }

        /* LEFT COLUMN */
        .label {
            font-size: 12px;
            letter-spacing: 1px;
            text-transform: uppercase;
            color: #888;
            margin-bottom: 10px;
        }

        .title {
            font-size: 40px;
            font-weight: 700;
            line-height: 1.1;
            color: #ff3b30;
            margin-bottom: 25px;
        }

        .image-placeholder {
            width: 100%;
            height: 360px;
            background: #e6e6e6;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #999;
            font-size: 14px;
            margin-bottom: 20px;
        }

        .meta {
            font-size: 13px;
            line-height: 1.7;
            color: #333;
        }

        .meta strong {
            font-weight: 700;
        }

        /* RIGHT COLUMN */
        .section {
            margin-bottom: 30px;
        }

        .section-title {
            font-size: 16px;
            font-weight: 700;
            color: #ff3b30;
            margin-bottom: 12px;
        }

        ul {
            padding-left: 18px;
            margin: 0;
        }

        ul li {
            margin-bottom: 8px;
            font-size: 14px;
        }

        ol {
            padding-left: 18px;
            margin: 0;
        }

        ol li {
            margin-bottom: 12px;
            font-size: 14px;
            line-height: 1.6;
        }

        .tips {
            font-size: 14px;
            line-height: 1.6;
            color: #444;
        }

        /* RESPONSIVE */
        @media (max-width: 768px) {
            .grid {
                grid-template-columns: 1fr;
            }
            .title {
                font-size: 34px;
            }
        }
    </style>
</head>
<body>

<div class="page">
    <div class="grid">

        <!-- LEFT SIDE -->
        <div>
            <div class="label">Recipe</div>
            <div class="title">
                Strawberry<br>
                Vanilla<br>
                Pancakes
            </div>

            <div class="image-placeholder">
                Image Placeholder
            </div>

            <div class="meta">
                Ready in <strong>20 minutes</strong><br>
                Serves <strong>8 people</strong><br>
                <strong>280 calories</strong>
            </div>
        </div>

        <!-- RIGHT SIDE -->
        <div>

            <div class="section">
                <div class="section-title">Ingredients</div>
                <ul>
                    <li>Lorem ipsum dolor sit amet</li>
                    <li>Consectetur adipiscing elit</li>
                    <li>Suspendisse scelerisque</li>
                    <li>Libero interdum auctor</li>
                </ul>
            </div>

            <div class="section">
                <div class="section-title">Preparation</div>
                <ol>
                    <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do tempor incididunt ut labore et dolore magna aliqua.</li>
                    <li>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.</li>
                    <li><strong>Suspendisse scelerisque mi a mi</strong> lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
                    <li><strong>Vestibulum ante ipsum primis</strong> in faucibus orci luctus et ultrices posuere cubilia curae.</li>
                    <li>Phasellus vehicula nonummy nunc. Lorem ipsum dolor sit amet.</li>
                    <li>Ullamco laboris nisi ut aliquip ex ea commodo consequat.</li>
                </ol>
            </div>

            <div class="section">
                <div class="section-title">Tips</div>
                <div class="tips">
                    Lorem ipsum dolor sit amet consectetur adipiscing elit sed do tempor incididunt ut labore et dolore magna aliqua.
                </div>
            </div>

        </div>

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
    initialContent: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Brochure Template</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px;
            background-color: #fff;
        }
        .header {
            margin-bottom: 40px;
            border-bottom: 2px solid #e74c3c; /* Red accent often found in brochure templates */
            padding-bottom: 20px;
        }
        .company-name {
            font-size: 1.5em;
            font-weight: bold;
            color: #e74c3c;
            margin-bottom: 10px;
        }
        .contact-info {
            font-size: 0.9em;
            color: #555;
            margin-bottom: 20px;
        }
        .title-section {
            margin-bottom: 30px;
        }
        .main-title {
            font-size: 2.5em;
            color: #2c3e50;
            margin: 0;
            line-height: 1.2;
        }
        .date {
            font-size: 1.2em;
            color: #7f8c8d;
            margin-top: 10px;
        }
        h1 {
            color: #2c3e50;
            font-size: 1.8em;
            margin-top: 30px;
            border-bottom: 1px solid #ddd;
            padding-bottom: 5px;
        }
        h2 {
            color: #e74c3c;
            font-size: 1.4em;
            margin-top: 25px;
        }
        h3 {
            color: #333;
            font-size: 1.1em;
            font-weight: bold;
            margin-top: 20px;
        }
        p {
            margin-bottom: 15px;
            text-align: justify;
        }
    </style>
</head>
<body>

    <div class="header">
        <div class="company-name">Your Company</div>
        <div class="contact-info">
            123 Your Street<br>
            Your City, ST 12345<br>
            (123) 456 - 7890
        </div>
        <div class="title-section">
            <h1 class="main-title">Product Brochure</h1>
            <div class="date">September 04, 20XX</div>
        </div>
    </div>

    <h1>Product Overview</h1>
    <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.</p>

    <h2>Lorem ipsum</h2>
    <p>Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. Typi non habent claritatem insitam; est usus legentis in iis qui facit eorum claritatem.</p>

    <h3>Lorem ipsum</h3>
    <p>Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan.</p>

    <h2>Dolor sit</h2>
    <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.</p>

    <h1>Details</h1>
    <p>Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. Typi non habent claritatem insitam; est usus legentis in iis qui facit eorum claritatem. Investigationes demonstraverunt lectores legere me lius quod ii legunt saepius. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.</p>

    <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan.</p>

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
  }
];