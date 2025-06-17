
export const initialEmails = [
  {
    id: 'email-1',
    sender: 'Alice Wonderland',
    avatar: 'https://i.pravatar.cc/40?u=alice',
    to: 'you@example.com',
    subject: 'Meeting Reminder & Agenda',
    snippet: 'Just a friendly reminder about our meeting tomorrow at 10 AM. Please find the agenda attached...',
    body: `<p>Hi Team,</p>
           <p>Just a friendly reminder about our meeting tomorrow, <strong>Tuesday, May 27th, at 10:00 AM PST</strong> via Zoom.</p>
           <p>Please find the agenda attached. Key discussion points include:</p>
           <ul>
             <li>Q2 Project Review</li>
             <li>Brainstorming for New Campaign</li>
             <li>Team Feedback Session</li>
           </ul>
           <p>Come prepared with your updates and ideas!</p>
           <p>Best regards,<br/>Alice Wonderland<br/>Project Manager</p>`,
    date: '2025-05-26T14:30:00Z',
    read: false,
    starred: true,
    folder: 'inbox',
    tags: ['meeting', 'important'],
  },
  {
    id: 'email-2',
    sender: 'Bob The Builder',
    avatar: 'https://i.pravatar.cc/40?u=bob',
    to: 'you@example.com',
    subject: 'Your Recent Order #12345 Shipped!',
    snippet: 'Good news! Your order #12345 has been shipped and is on its way. Track it here...',
    body: `<p>Hello,</p>
           <p>Great news! Your recent order <strong>#12345</strong> from BuildIt Store has been shipped.</p>
           <p>You can track your package using this link: <a href="#" style="color: #38bdf8;">Track Package</a></p>
           <p>Estimated delivery: <strong>May 29th, 2025</strong>.</p>
           <p>Thanks for shopping with us!<br/>The BuildIt Team</p>`,
    date: '2025-05-26T10:15:00Z',
    read: true,
    starred: false,
    folder: 'inbox',
    tags: ['order', 'shipping'],
  },
  {
    id: 'email-3',
    sender: 'Cathy Coder',
    avatar: 'https://i.pravatar.cc/40?u=cathy',
    to: 'you@example.com',
    subject: 'Quick Question about the API',
    snippet: 'Hope you’re having a great day! I had a quick question regarding the user authentication endpoint...',
    body: `<p>Hi there,</p>
           <p>Hope you’re having a great day!</p>
           <p>I was working with the new API documentation and had a quick question regarding the <code>/auth/user</code> endpoint. Is it expected to return the user's full profile or just a summary?</p>
           <p>Any clarification would be much appreciated!</p>
           <p>Thanks,<br/>Cathy Coder<br/>Developer</p>`,
    date: '2025-05-25T18:45:00Z',
    read: false,
    starred: false,
    folder: 'inbox',
    tags: ['dev', 'api', 'question'],
  },
  {
    id: 'email-4',
    sender: 'David Designer',
    avatar: 'https://i.pravatar.cc/40?u=david',
    to: 'you@example.com',
    subject: 'Feedback on New UI Mockups',
    snippet: 'Attached are the latest UI mockups for the dashboard redesign. Would love your feedback when you get a chance...',
    body: `<p>Hey Team,</p>
           <p>Please find attached the latest UI mockups for the dashboard redesign project (v2.1).</p>
           <img  alt="UI Mockup Preview" style="max-width: 100%; border-radius: 8px; margin-top: 10px; margin-bottom: 10px;" src="https://images.unsplash.com/photo-1516383274235-5f42d6c6426d" />
           <p>I've incorporated the feedback from our last session and focused on improving the data visualization components.</p>
           <p>Would love to get your thoughts and feedback when you have a moment. Specifically, I'm interested in your opinions on:</p>
           <ul>
             <li>Color palette and contrast</li>
             <li>Typography choices</li>
             <li>Overall layout intuitiveness</li>
           </ul>
           <p>Cheers,<br/>David Designer<br/>Lead UI/UX Designer</p>`,
    date: '2025-05-24T09:00:00Z',
    read: true,
    starred: true,
    folder: 'inbox',
    tags: ['design', 'feedback', 'ui'],
  },
  {
    id: 'email-5',
    sender: 'Eva Eventplanner',
    avatar: 'https://i.pravatar.cc/40?u=eva',
    to: 'you@example.com',
    subject: 'Invitation: Annual Company Retreat 2025',
    snippet: 'You’re invited to our Annual Company Retreat! Join us for a fun-filled weekend of team building and relaxation...',
    body: `<p>Dear Team Member,</p>
           <p>You are cordially invited to our <strong>Annual Company Retreat 2025!</strong></p>
           <p>Join us for a fun-filled weekend of team building, workshops, and relaxation at the beautiful Lakeside Resort from <strong>July 18th to July 20th, 2025</strong>.</p>
           <p>More details and RSVP link will follow soon. Get ready for an unforgettable experience!</p>
           <p>Warmly,<br/>Eva Eventplanner<br/>HR Department</p>`,
    date: '2025-05-23T16:20:00Z',
    read: true,
    starred: false,
    folder: 'inbox',
    tags: ['event', 'company'],
  },
  {
    id: 'email-6',
    sender: 'You',
    avatar: 'https://i.pravatar.cc/40?u=currentUser',
    to: 'frank@example.com',
    subject: 'Re: Project Update Request',
    snippet: 'Hi Frank, thanks for reaching out. The project is on track, and we expect to hit the next milestone by EOD Friday...',
    body: `<p>Hi Frank,</p>
           <p>Thanks for reaching out regarding the Project Phoenix update.</p>
           <p>The project is currently on track, and the team is working diligently. We expect to hit the next milestone (Phase 2 Completion) by EOD this Friday, May 30th.</p>
           <p>I'll send a more detailed progress report then.</p>
           <p>Best,<br/>[Your Name]</p>`,
    date: '2025-05-26T11:00:00Z',
    read: true,
    starred: false,
    folder: 'sent',
  },
  {
    id: 'email-7',
    sender: 'Grace Growthhacker',
    avatar: 'https://i.pravatar.cc/40?u=grace',
    to: 'you@example.com',
    subject: 'Weekly Marketing Performance Report',
    snippet: 'Hi team, please find attached the weekly marketing performance report. Overall, we saw a 15% increase in engagement...',
    body: `<p>Hi team,</p>
           <p>Please find attached the weekly marketing performance report for the week ending May 25th, 2025.</p>
           <p><strong>Key Highlights:</strong></p>
           <ul>
             <li>Overall engagement increased by <strong>15%</strong> week-over-week.</li>
             <li>Social media reach grew by <strong>20,000 impressions</strong>.</li>
             <li>New campaign "Summer Splash" generated <strong>500+ leads</strong>.</li>
           </ul>
           <p>Full details and channel breakdown are in the attached PDF.</p>
           <p>Let's discuss these numbers in our Monday meeting.</p>
           <p>Regards,<br/>Grace Growthhacker<br/>Marketing Lead</p>`,
    date: '2025-05-22T13:00:00Z',
    read: true,
    starred: false,
    folder: 'trash',
    tags: ['report', 'marketing'],
  },
];
