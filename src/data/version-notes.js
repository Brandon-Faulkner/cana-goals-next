export const versionNotes = {
  currentVersion: '1.5.1',
  versions: [
    {
      version: '1.5.1',
      features: [
        {
          title: 'Fixed groups not loading on log in',
          items: [
            "Fixed a bug where the Switch Group badge for the active group and groups a user is assigned to weren't showing on first log in.",
          ],
        },
      ],
    },
    {
      version: '1.5.0',
      features: [
        {
          title: 'Admin Dashboard',
          items: [
            'For admins, there is now a dedicated portal to manage users, semesters, and groups.',
            'At the bottom of the sidebar, above the new Switch Group button, admins will find a link to the Admin Dashboard.',
            'In the admin portal, admins can switch between tables that allow creating, updating, and deleting data.',
          ],
        },
      ],
    },
    {
      version: '1.4.0',
      features: [
        {
          title: 'Group Assignments',
          items: [
            'Semesters and users are now assigned to different groups.',
            'Each semester will be assigned to a singular group, while users can be assigned to multiple groups.',
            'Each group will contain its own semesters and users.',
            'If a user is part of more than one group, they can switch between them at the bottom of the sidebar.',
          ],
        },
        {
          title: 'UI Adjustments',
          items: [
            'Converted the rest of the visible semester dates to be in Month Day, Year format instead of MM/DD/YY.',
          ],
        },
        {
          title: 'Improved Performance',
          items: [
            'Converted hooks such as useSemesters and useGroups to be context based to only limit database calls to mounts/unmounts.',
          ],
        },
        {
          title: 'Removed Some Tooltips',
          items: [
            'Removed some tooltips that were not needed for actions that are clear on their own.',
          ],
        },
      ],
    },
    {
      version: '1.3.0',
      features: [
        {
          title: 'Jump to User Goal Card',
          items: [
            'In the sidebar, under Goal Semesters and the current selected semester, there is a list of all the users with goals for that semester.',
            'Clicking on one of those names will close the sidebar (on mobile) and scroll the page to the selected users card. It will also briefly highlight the card.',
          ],
        },
        {
          title: 'Tooltips',
          items: ['Added some tooltips in the sidebar and various places on the main page.'],
        },
      ],
    },
    {
      version: '1.2.0',
      features: [
        {
          title: 'Improved Semester Overview',
          items: [
            'Added 3 toggle buttons: Goal Completion, Goals, and Blocks.',
            'Goal Completion shows a table of each user and their goal, block, and completion counts.',
            'Goals and Blocks show bar charts of goal or block counts per status.',
          ],
        },
        {
          title: 'Added Slack Integration',
          items: ['Setup the existing Slack integration to now work with this application.'],
        },
        {
          title: 'UI Fixes',
          items: ['Fixed some style issues for smaller devices, and better UI consistencies.'],
        },
      ],
    },
    {
      version: '1.1.0',
      features: [
        {
          title: 'Migration to Next.js, Vercel Hosting, and Firestore Database',
          items: [
            'The entire application has been rewritten from the ground up using Next.js, React, and modern web technologies for improved performance, maintainability, and user experience.',
            'Vercel hosting is now used to deploy the application.',
            'Migrated from Firebase Realtime Database to Firebase Firestore.',
          ],
        },
        {
          title: 'Modern UI Framework',
          items: [
            'Migrated from custom CSS to Tailwind CSS with Shadcn/ui components for a more consistent and maintainable design system.',
            'Replaced traditional popup dialogs with modern modal components that are more accessible and responsive.',
            'Updated sidebar navigation with collapsible sections and improved mobile responsiveness.',
          ],
        },
        {
          title: 'Redesigned Navigation System',
          items: [
            'Completely redesigned the sidebar menu to be persistent on the left side of the screen instead of a hamburger overlay menu.',
            'Integrated semester selection directly into the sidebar with visual indicators for the current semester.',
          ],
        },
        {
          title: 'Improved Table Interactions',
          items: [
            'Added three-dot menu buttons to table rows and headers for cleaner, more intuitive interactions instead of buttons.',
            'Improved the context (right-click) menu for tables and rows for better performance ans user experience.',
            'Added keyboard navigation support for all dropdown menus and table interactions.',
          ],
        },
        {
          title: 'Enhanced Auto-Save',
          items: [
            'Updated the auto-save to improve performance and only re-render the specific item in the table that needs updating.',
          ],
        },
        {
          title: 'Accessibility Improvements',
          items: [
            'Enhanced keyboard navigation throughout the application.',
            'Improved screen reader support with proper ARIA labels and semantic HTML.',
            'Better focus management for modal dialogs and interactive elements.',
          ],
        },
      ],
    },
  ],
};
