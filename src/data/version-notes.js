export const versionNotes = {
  currentVersion: '1.2.0',
  versions: [
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
