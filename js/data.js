/* ------------------------------------------------------------------
   Single source of truth for the whole site.
   To add a project, certificate or job: add one object to the right list.
   ------------------------------------------------------------------ */
window.PORTFOLIO = {
  email: 'hk.harsh.khandal@gmail.com',

  /* ---------- Moments: real photos (certificate handovers, wins, events) ----------
     Put image files in assets/moments/ and add one entry per photo. Empty list = section stays hidden.
     { img: 'assets/moments/phq-certificate.jpg', caption: 'Receiving my certificate at Rajasthan Police HQ', date: 'Aug 2026', note: 'Optional longer text for the pop-up.' } */
  gallery: [],

  /* ---------- Projects (newest first) ---------- */
  projects: [
    {
      id: 'whats-going-on',
      title: 'What’s Going On: Automated Short-Form Video & News Distribution Platform',
      short: 'A fully autonomous, end-to-end AI media ecosystem that ingests breaking news, verifies facts via serverless API workers, generates custom 4K vertical graphics with FLUX.2, and compiles faceless short-form videos with dynamic subtitle ducking for programmatic cross-platform distribution.',
      full: 'What’s Going On is an autonomous multimedia generation and omnichannel publishing engine that transforms real-time data inputs into text updates, high-fidelity graphics, and fully rendered video assets without human intervention. The system leverages a serverless Cloudflare Worker API to extract keywords and cross-reference live global news databases for context building, while integrating FLUX.2 [klein] 9B via custom multipart FormData streams to generate vertical 1024x1024 graphics with crisp typography. These assets are processed by a standalone FastAPI and FFmpeg backend that handles real-time text-to-speech with precise word-boundary tracking, dynamic audio ducking, and automated subtitle burning. Finally, a sophisticated asynchronous routing pipeline built on Make.com utilizes strict JSON sanitization layers to simultaneously distribute platform-optimized content to Blogger, Facebook, Instagram Feeds & Reels, LinkedIn, and Telegram.',
      tags: ['ai', 'n8n', 'automation', 'js', 'python'],
      img: "assets/images/projects/What's-Going-On.png",
      links: [
        { label: 'View GitHub', url: "https://github.com/Hk-Hacker-Harsh/Workflows/tree/main/What's%20Going%20On" },
        { label: 'Blogger', url: 'https://whatsgoingon.harshkhandal.dev/' },
        { label: 'Instagram', url: 'https://www.instagram.com/whats_.going_on/' },
        { label: 'Facebook', url: 'https://www.facebook.com/people/Whats-Going-On/61589833215074/' },
        { label: 'LinkedIn', url: 'https://www.linkedin.com/company/whats-goingon/' }
      ]
    },
    {
      id: 'ccrm',
      title: 'Cyber Cell Record Mapper (CCRM)',
      short: 'An open-source, lightweight forensic link-analysis intelligence tool designed for local Cyber Cell units to automatically cross-examine and visualize multi-modal operational data sheets.',
      full: 'This specialized investigative platform features Multi-Modal Link Analysis to seamlessly render telephone numbers, UPI/bank accounts, and transactional vectors into a unified graph dashboard. Designed for high-efficiency intelligence workflows, the system supports Batch Document Staging to upload multiple tracking files simultaneously, intelligently abstracting primary column headers to configure the entire batch at once. To ensure absolute flexibility across varying telecom providers (like Jio and Airtel) or financial institutions (such as SBI and HDFC), its Dynamic Schema-Agnostic Mapping utilizes a drag-and-drop UI panel for on-the-fly column mapping without rigid system locks. Operating with a focus on data integrity, the platform leverages Volatile In-Memory Processing to parse application streams entirely within memory, bypassing disk storage writes to eliminate forensic cross-contamination on host machines. Finally, investigators can save and resume operations at any point using Custom Forensic Workspace Backups, which export active graph layers and pipeline configurations into a single, transportable .ccrm project file.',
      tags: ['python', 'js', 'html', 'cyber', 'css'],
      img: 'assets/images/projects/CCRM.png',
      links: [{ label: 'View GitHub', url: 'https://github.com/Hk-Hacker-Harsh/Cyber_Cell_Record_Mapper' }]
    },
    {
      id: 'placement-portal',
      title: 'College Placement Portal',
      short: 'College Placement Portal Web Application using Python Flask. IITM BS in Data Science MAD-1 Project, Jan 2026.',
      full: 'A comprehensive, role-based Web Application built to streamline campus recruitments. The portal facilitates seamless interactions between the Institute Admin, Corporate Recruiters (Companies), and Students throughout the hiring lifecycle.',
      tags: ['python', 'js', 'html', 'bootstrap'],
      img: 'assets/images/projects/Placement_Portal.png',
      links: [{ label: 'View GitHub', url: 'https://github.com/Hk-Hacker-Harsh/College-Placement-Portal' }]
    },
    {
      id: 'honeypot',
      title: 'Admin Login HoneyPot',
      short: 'Fake login page honeypot for attackers and hackers.',
      full: 'A proactive security mechanism designed to identify and log malicious conduct through deception. This project implements a "trap" in the form of a spoofed administrative portal to capture unauthorized access attempts.',
      tags: ['python', 'cyber', 'html', 'bootstrap'],
      img: 'assets/images/projects/HoneyPot.png',
      links: [{ label: 'View GitHub', url: 'https://github.com/Hk-Hacker-Harsh/HoneyPot' }]
    },
    {
      id: 'logging-system',
      title: 'Tamper-Evident Logging System Using Python',
      short: 'Python logging system inspired by the blockchain hash method.',
      full: 'A security-conscious logging application that utilizes cryptographic chaining to ensure data integrity. This system detects if log entries have been modified, deleted, or re-ordered by creating a mathematical "link" between every entry.',
      tags: ['python', 'cyber', 'html', 'bootstrap'],
      img: 'assets/images/projects/Logging_System.png',
      links: [{ label: 'View GitHub', url: 'https://github.com/Hk-Hacker-Harsh/Logging-System' }]
    },
    {
      id: 'ctf-recon',
      title: 'CTF Reconnaissance Automation Bash Script',
      short: 'It saves time, reduces manual effort, and ensures you don’t miss critical recon steps.',
      full: 'This script automates the reconnaissance phase for CTFs and penetration testing. It handles target setup, scanning, enumeration, and reporting in a structured and efficient way.',
      tags: ['bash', 'cyber', 'ctf'],
      img: 'assets/images/projects/CTF_Recon_Tool.png',
      links: [{ label: 'View GitHub', url: 'https://github.com/Hk-Hacker-Harsh/CTF-Recon-Automator' }]
    },
    {
      id: 'portfolio',
      title: 'Harsh K. Portfolio',
      short: 'A high-performance, responsive personal portfolio engineered with a "Cyber-Hacker" aesthetic to showcase my expertise in Data Science and Cybersecurity.',
      full: 'This repository contains the source code for my professional identity, built using a modular architecture of HTML, CSS, and JavaScript. The site features a data-driven project gallery, an interactive link-analysis hero, a command menu, and an integrated credential viewer for verified certifications. By focusing on clean UI/UX and optimized SEO, this project serves as a live demonstration of my ability to merge creative design with robust frontend engineering, while documenting my journey through IIT Madras and various industry internships.',
      tags: ['html', 'css', 'js'],
      img: 'assets/images/projects/Portfolio.png',
      links: [{ label: 'View GitHub', url: 'https://github.com/Hk-Hacker-Harsh/Hk-Hacker-Harsh.github.io' }]
    },
    {
      id: 'n8n-vault',
      title: 'N8n Workflows Vault',
      short: 'My custom n8n workflows for utility bots and AI agents.',
      full: 'This repository contains my custom n8n workflows for utility bots and AI agents.',
      tags: ['ai', 'n8n', 'automation'],
      img: 'https://raw.githubusercontent.com/Hk-Hacker-Harsh/N8n-Workflows/refs/heads/main/assets/n8n_logo.png',
      links: [{ label: 'View GitHub', url: 'https://github.com/Hk-Hacker-Harsh/N8n-Workflows' }]
    },
    {
      id: 'hk-store',
      title: 'Hk Store - Multi-Vendor E-commerce Platform',
      short: 'A custom-built PHP e-commerce system featuring distinct portals for Administrators, Vendors, and Customers.',
      full: 'A custom-built PHP e-commerce system featuring distinct portals for Administrators, Vendors, and Customers. This project serves as a comprehensive demonstration of full-stack PHP development, focusing on session management, secure authentication, and relational database architecture.',
      tags: ['sql', 'php', 'html', 'css', 'js', 'bootstrap'],
      img: 'https://raw.githubusercontent.com/Hk-Hacker-Harsh/Web_Projects/main/ECommerce_Project/Screenshots/4.png',
      links: [
        { label: 'View GitHub', url: 'https://github.com/Hk-Hacker-Harsh/Web_Projects/tree/main/ECommerce_Project' },
        { label: 'Live demo', url: 'http://ecoproject.infinityfree.me/' }
      ]
    },
    {
      id: 'marghazi-ctf',
      title: 'Marghazi\'26 Cyber CTF',
      short: 'Capture the flag short game. Cyber CTF walkthrough and task details.',
      full: 'Welcome to the repository for the Paradox\'26 CTF challenges. This collection contains the tasks, source files, and configurations used during the event.',
      tags: ['ctf', 'server', 'cyber'],
      img: 'https://raw.githubusercontent.com/Hk-Hacker-Harsh/CTF_Project/refs/heads/main/Poster.jpeg',
      links: [{ label: 'View GitHub', url: 'https://github.com/Hk-Hacker-Harsh/CTF_Project' }]
    },
    {
      id: 'ctf-walkthroughs',
      title: 'CTF Walkthroughs',
      short: 'A technical log of my journey through competitive cybersecurity platforms.',
      full: 'A systematic archive of security challenge write-ups, documenting exploitation methodologies, privilege escalation paths, and vulnerability research. This repository serves as a technical log for my journey through competitive cybersecurity platforms.',
      tags: ['ctf', 'cyber'],
      img: 'assets/images/projects/CTF_Walkthroughs.png',
      links: [{ label: 'View GitHub', url: 'https://github.com/Hk-Hacker-Harsh/CTF-Walkthroughs' }]
    },
    {
      id: 'onshape-mouse',
      title: 'Onshape Mouse',
      short: '3D CAD mouse built in Onshape.',
      full: '3D CAD mouse built in Onshape.',
      tags: ['cad'],
      img: 'https://raw.githubusercontent.com/Hk-Hacker-Harsh/Onshape-Mouse/refs/heads/main/Images/9.png',
      links: [{ label: 'View GitHub', url: 'https://github.com/Hk-Hacker-Harsh/Onshape-Mouse' }]
    },
    {
      id: 'hangman',
      title: 'Hangman Game : Python CLI',
      short: 'Fun CLI Hangman game.',
      full: 'Welcome to the Hangman CLI Game built with Python3! It is a simple command line game: guess the secret word one letter at a time before the man is hanged! A fun terminal-based game to kill boredom and sharpen your brain.',
      tags: ['python'],
      img: 'https://raw.githubusercontent.com/Hk-Hacker-Harsh/Hangman/main/Images/1%20(4).png',
      links: [{ label: 'View GitHub', url: 'https://github.com/Hk-Hacker-Harsh/Hangman' }]
    },
    {
      id: 'morse',
      title: 'GUI Morse Code System',
      short: 'Read and write Morse code from text, transmit it through sound, and tap out manual Morse.',
      full: 'GUI Morse Code System is a Python based project which can read and write Morse code from text and even transmit it through sound. Manual Morse coding is also available. As a GUI project it is easy to use. The aim of the project is to make Morse encoding and decoding easy for beginners.',
      tags: ['python'],
      img: 'https://raw.githubusercontent.com/Hk-Hacker-Harsh/GUI_Morse_Code_System/refs/heads/main/Images/New.png',
      links: [{ label: 'View GitHub', url: 'https://github.com/Hk-Hacker-Harsh/GUI_Morse_Code_System' }]
    },
    {
      id: 'converter-v2',
      title: 'Converter V2 Python',
      short: 'Project 1 Converter (computer number systems and Morse), version 2 with a GUI.',
      full: 'Converter_v2 is the updated version with GUI ability. It is written in Python3 and converts one computer number system to another, or encodes and decodes URLs and Morse.',
      tags: ['python'],
      img: 'https://raw.githubusercontent.com/Hk-Hacker-Harsh/Converter_v2/refs/heads/Root/Images/3.jpg',
      links: [{ label: 'View GitHub', url: 'https://github.com/Hk-Hacker-Harsh/Converter_v2' }]
    },
    {
      id: 'ai-assistant',
      title: 'Python GUI AI Assistant',
      short: 'A simple GUI AI assistant that runs completely on your local machine. Python3 Tkinter for the GUI and Ollama for the AI.',
      full: 'A simple GUI AI assistant that runs completely on your local machine. Made using Python3 Tkinter for the GUI and Ollama for AI capabilities. Completely offline, with a wide variety of language models. You can even upload text (.txt) files.',
      tags: ['python', 'ai'],
      img: 'https://raw.githubusercontent.com/Hk-Hacker-Harsh/AI_Assistant/main/Images/Front.png',
      links: [{ label: 'View GitHub', url: 'https://github.com/Hk-Hacker-Harsh/AI_Assistant' }]
    },
    {
      id: 'go-up',
      title: 'Go Up : Simple Godot Game',
      short: 'Simple game built in Godot.',
      full: 'A short rage game built in Godot. The aim is to reach the top. The higher the player climbs, the harder it gets and the more likely a fall, which will make players rage.',
      tags: ['godot'],
      img: 'https://raw.githubusercontent.com/Hk-Hacker-Harsh/Godot-Game/refs/heads/main/Demo/image.png',
      links: [
        { label: 'View GitHub', url: 'https://github.com/Hk-Hacker-Harsh/Godot-Game' },
        { label: 'Play demo', url: 'https://hk-hacker.itch.io/go-up' }
      ]
    },
    {
      id: 'pustakmart',
      title: 'PustakMart : Buy & Sell Second Hand Books Online',
      short: 'WordPress site for buying and selling second-hand books online.',
      full: 'Your go-to platform for buying and selling second-hand books. Enjoy affordable prices and a wide selection, all while promoting sustainability by giving used books a new home. Join our community of book lovers and make reading accessible and eco-friendly!',
      tags: ['wordpress', 'startup'],
      img: 'assets/images/projects/Pustakmart.png',
      links: [{ label: 'Visit site', url: 'https://pustakmart.com/' }]
    },
    {
      id: 'converter-v1',
      title: 'Converter V1 Python',
      short: 'Project Converter (computer number systems and Morse), version 1 as a CLI.',
      full: 'This program is written in Python3. It is a CLI that converts hexadecimal, octal and binary to decimal, and decimal to hexadecimal, binary and octal, and can also encode and decode Morse code.',
      tags: ['python'],
      img: 'assets/images/projects/Converter_v1.png',
      links: [{ label: 'View GitHub', url: 'https://github.com/Hk-Hacker-Harsh/Converter/' }]
    },
    {
      id: 'payload-generator',
      title: 'Bash Script : Payload Generator',
      short: 'My first project.',
      full: 'This is my first project, so there can be some issues. If you find any issue or error, please report it to hk.harsh.khandal@gmail.com or try installing the packages used in the script.',
      tags: ['bash', 'cyber'],
      img: 'assets/images/projects/Payload_Generator.png',
      links: [{ label: 'View GitHub', url: 'https://github.com/Hk-Hacker-Harsh/Payload_Generator' }]
    }
  ],

  /* ---------- Skills ---------- */
  skills: {
    cyber: {
      title: 'Cyber Security & Web Defense', mastery: 70,
      items: [
        { name: 'Cyber Projects', level: 70, tag: 'cyber' },
        { name: 'Networking', level: 85, tag: 'networking' },
        { name: 'VAPT', level: 70, tag: 'vapt' },
        { name: 'CTF Strategy', level: 75, tag: 'ctf' }
      ]
    },
    ai: {
      title: 'Artificial Intelligence & Data Science', mastery: 50,
      items: [
        { name: 'n8n Automation', level: 60, tag: 'n8n' },
        { name: 'Ollama / LLMs', level: 40, tag: 'ai' },
        { name: 'Workflow Logic', level: 60, tag: 'automation' }
      ]
    },
    lang: {
      title: 'Programming Languages', mastery: 70,
      items: [
        { name: 'Python', level: 80, tag: 'python' },
        { name: 'Bash & Linux', level: 60, tag: 'bash' },
        { name: 'HTML', level: 70, tag: 'html' },
        { name: 'CSS', level: 60, tag: 'css' },
        { name: 'JS', level: 50, tag: 'js' },
        { name: 'PHP', level: 50, tag: 'php' },
        { name: 'SQL', level: 60, tag: 'sql' }
      ]
    },
    web: {
      title: 'Web Development', mastery: 70,
      items: [
        { name: 'WordPress', level: 80, tag: 'wordpress' },
        { name: 'Backend Servers and API', level: 75, tag: 'server' },
        { name: 'HTML', level: 70, tag: 'html' },
        { name: 'CSS', level: 60, tag: 'css' },
        { name: 'JS', level: 50, tag: 'js' },
        { name: 'PHP', level: 50, tag: 'php' },
        { name: 'SQL', level: 60, tag: 'sql' },
        { name: 'Bootstrap', level: 60, tag: 'bootstrap' }
      ]
    },
    startups: {
      title: 'Startups', mastery: 30,
      items: [{ name: 'Startups', level: null, tag: 'startup' }]
    },
    others: {
      title: 'Others', mastery: null,
      items: [
        { name: 'CAD', level: 60, tag: 'cad' },
        { name: 'Godot', level: 40, tag: 'godot' }
      ]
    }
  },

  /* ---------- Experience (newest first) ---------- */
  experience: [
    {
      id: 'phq',
      title: 'Rajasthan Police Headquarters Cyber Crime Investigation Internship',
      org: 'Rajasthan Police',
      period: '10 August 2026 - Ongoing',
      desc: 'Assisted state cybercrime investigators in analyzing digital evidence, tracking network logs, and tracing online financial fraud patterns. Gained practical experience in digital forensics, OSINT tools, and law enforcement case-reporting procedures.',
      learnings: 'Gained hands-on experience in digital forensics, chain-of-custody protocols, and technical evidence extraction from seized devices. Developed practical skills in analyzing IP logs, Call Detail Records (CDRs), and financial transaction trails to investigate online fraud and cyber threats using OSINT tools.',
      status: { type: 'ongoing', text: 'Ongoing' },
      // photo: 'assets/moments/phq.jpg', photoCaption: 'Optional caption',
      links: []
    },
    {
      id: 'apcsip',
      title: 'Amroha Police Cyber Security Internship Program (APCSIP) \'26',
      org: 'Amroha (U.P.) Police',
      period: '11 June 2026 - 22 June 2026',
      desc: 'Intensive 12-day core operational cybersecurity internship with the Amroha (U.P.) Police Department, focusing on infrastructure security mapping and threat analysis.',
      learnings: 'Automated defensive security tasks using custom Python scripting. Acquired practical experience in penetration testing, law enforcement infrastructure vulnerability assessments, and threat mitigation tactics.',
      status: { type: 'success', text: 'Success - Completed all operational deliverables, security assessments, and code submissions successfully.' },
      links: [
        { label: 'Certificates', url: 'viewer.html?file=assets/experience/APCSIP_Certificates.pdf' },
        { label: 'Project link', url: 'https://github.com/Hk-Hacker-Harsh/Cyber_Cell_Record_Mapper' }
      ]
    },
    {
      id: 'pustakmart',
      title: 'Founder & CEO',
      org: 'PustakMart (Startup Test)',
      period: 'May 2025 - Apr 2026',
      desc: 'Engineered a full-scale e-commerce platform using WordPress and WooCommerce to facilitate the buying and selling of used books.',
      learnings: 'Developed and scaled PustakMart, an organic e-commerce platform, where I mastered WordPress development and SEO while navigating the Indian consumer market, startup networking, and government support ecosystems to drive sales with zero marketing spend.',
      status: { type: 'fail', text: 'Failed - Low ROI. At the time of winding up, I managed to generate 50% profit of total investment. One year completed, and I got enough experience to move on and try something new. One problem I faced was that I didn\'t have enough capital. So, next time, I will try to raise capital first and then start something.' },
      statsTitle: 'Final stats (Google Site/Analytics, Jetpack, WordPress)',
      stats: [
        { v: '40K+', l: 'Impressions on site' },
        { v: '~20K', l: 'Views' },
        { v: '~8K', l: 'Visitors' },
        { v: '200+', l: 'Sell requests' },
        { v: '7', l: 'Orders completed' },
        { v: '~20', l: 'Donation requests' }
      ],
      links: [{ label: 'Pustakmart.com (not active now)', url: 'https://pustakmart.com/' }]
    },
    {
      id: 'shadowfox',
      title: 'Cyber Security and Python Intern (Unpaid)',
      org: 'ShadowFox',
      period: 'Nov 2024 - Dec 2024',
      desc: 'Intensive internship focused on Python and cybersecurity.',
      learnings: 'Automated security tasks using Python scripts. Gained hands-on experience in vulnerability assessment and penetration testing.',
      status: { type: 'success', text: 'Success - Completed all deliverables and certificate earned.' },
      links: [
        { label: 'Python Development Certificate', url: 'viewer.html?file=assets/experience/ShadowFox-Python.pdf' },
        { label: 'CyberSecurity Certificate', url: 'viewer.html?file=assets/experience/ShadowFox-Cyber.pdf' }
      ]
    },
    {
      id: 'cfss',
      title: 'Cyber Security & Ethical Hacking Intern (Unpaid)',
      org: 'CFSS',
      period: 'Aug 2024 - Sep 2024',
      desc: 'Cyber & Forensics Security Solutions - penetration testing.',
      learnings: 'Deep dive into network forensics and web application security testing.',
      status: { type: 'success', text: 'Success - Successfully identified vulnerabilities in test environments.' },
      links: [
        { label: 'CFSS Certificate', url: 'viewer.html?file=assets/experience/CFSS-Cyber.png' },
        { label: 'CFSS Letter of Recommendation', url: 'viewer.html?file=assets/experience/CFSS_LOR.png' }
      ]
    }
  ],

  /* ---------- Certificates (newest first) ---------- */
  /* cat: cert | course | comp | other */
  certs: [
    { cat: 'course', title: 'PentesterLab Recon Badge', issuer: 'PentesterLab', date: '16 Apr 2026', file: 'assets/certificates/PTL_Recon.pdf', links: [{ label: 'Verify', url: 'https://pentesterlab.com/certs/2f4b243dadaa5258946503fac0f790' }] },
    { cat: 'comp', title: 'HackJKLU v5.0 Hackathon', issuer: 'JKLU', date: '23 Mar 2026', file: 'assets/certificates/HackJKLU.pdf', links: [{ label: 'View project', url: 'https://github.com/Hk-Hacker-Harsh/LifePath-AI' }] },
    { cat: 'cert', title: 'EC-Council CEH v13', issuer: 'EC-Council', date: '5 Mar 2026', file: 'assets/certificates/ECC-CEH-Certificate.pdf', links: [] },
    { cat: 'course', title: 'Web Development Course Completion', issuer: 'TuteDude', date: '12 Feb 2026', file: 'assets/certificates/TuteDude-Web.pdf', links: [] },
    { cat: 'other', title: 'IIT Madras CyberCTF Event Head', issuer: 'IIT Madras Paradox', date: '6 Feb 2026', file: 'assets/certificates/CyberCTF-Event_Head.pdf', links: [] },
    { cat: 'comp', title: 'AoC 2025 - Challenge Completion', issuer: 'TryHackMe', date: '31 Dec 2025', file: 'assets/certificates/TryHackMe-AOC25.pdf', links: [] },
    { cat: 'course', title: 'Ethical Hacking Course Completion', issuer: 'TuteDude', date: '4 Nov 2025', file: 'assets/certificates/TuteDude-EH.pdf', links: [] },
    { cat: 'other', title: 'Volunteer @ JagrukFest - 2025', issuer: 'LLA', date: '8 Jun 2025', file: 'assets/certificates/JagrukFest-Volunteer-2025.pdf', links: [] },
    { cat: 'course', title: 'Pre Security Path Completion', issuer: 'TryHackMe', date: '8 Mar 2024', file: 'assets/certificates/TryHackMe-PreSec.png', links: [] },
    { cat: 'course', title: 'Beginner Path Completion', issuer: 'TryHackMe', date: '20 Feb 2024', file: 'assets/certificates/TryHackMe-Beginner.png', links: [] },
    { cat: 'comp', title: 'AoC 2023 - Challenge Completion', issuer: 'TryHackMe', date: '26 Dec 2023', file: 'assets/certificates/TryHackMe-AOC23.png', links: [] },
    { cat: 'course', title: 'Cybersecurity Course Completion', issuer: 'Google x Coursera', date: '23 Sep 2023', file: 'assets/certificates/Google_Cyber.pdf', links: [] },
    { cat: 'course', title: 'Cyber Security Course Completion', issuer: 'WsCube Tech', date: '31 May 2022', file: 'assets/certificates/WsCube_EH.pdf', links: [] }
  ],

  /* ---------- Verified badges ---------- */
  badges: [
    {
      title: 'EC-Council v13 CEH Certification',
      desc: 'EC-Council CEH v13 (Certified Ethical Hacker) certification focused on mastering the latest AI-driven hacking methodologies and advanced penetration testing. Certificate No. : ECC7125834960',
      img: 'assets/badges/CEH.png', verify: 'https://aspen.eccouncil.org/verify'
    },
    {
      title: 'AWS Academy Graduate - Cloud Foundations - Training Badge',
      desc: 'Validates core knowledge of AWS cloud computing, architecture, and security best practices. Demonstrates hands-on familiarity with fundamental AWS services, pricing, and support structures.',
      img: 'assets/badges/AWS.png', verify: 'https://www.credly.com/go/jpnAzDwL'
    },
    {
      title: 'Google Cybersecurity Professional',
      desc: 'Hands-on training in Python, Linux, SQL, and SIEM tools. Focus on threat detection and risk management.',
      img: 'assets/badges/google-cyber.png', verify: 'https://www.credly.com/badges/d6751849-c303-4e10-bbcc-1ad2c5e508f6/public_url'
    }
  ],

  /* ---------- Education ---------- */
  education: [
    {
      title: 'BS in Data Science & Applications', where: 'IIT Madras',
      meta: 'Current enrollment · Focus: Data Analytics & Security',
      chips: [{ t: 'Active', k: 'ongoing' }, { t: 'CGPA 7.60 / 10', k: 'score' }],
      url: 'https://app.onlinedegree.iitm.ac.in/student/25F2000906'
    },
    {
      title: 'O / A / B / C Level', where: 'NIELIT',
      meta: 'Current enrollment · Focus: Computer Science & Programming',
      chips: [{ t: 'O Level: completed', k: 'ok' }, { t: 'A Level: on-going', k: 'ongoing' }, { t: 'B Level: future', k: 'future' }, { t: 'C Level: future', k: 'future' }]
    },
    {
      title: '12th (Commerce)', where: 'Kendriya Vidyalaya No. 2 JPR',
      meta: 'Completed 2024-25 · CBSE Commerce',
      chips: [{ t: 'Completed', k: 'mute' }, { t: '91.4%', k: 'score' }]
    },
    {
      title: '10th', where: 'Kendriya Vidyalaya No. 2 JPR',
      meta: 'Completed 2022-23 · CBSE',
      chips: [{ t: 'Completed', k: 'mute' }, { t: '82.0%', k: 'score' }]
    }
  ]
};
