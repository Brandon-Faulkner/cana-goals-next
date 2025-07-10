# Cana Goals

Cana Goals is a progressive web app for tracking ministry goals during 100‑ or 300‑day semesters. It provides a modern React interface backed by Firebase for authentication, data storage and serverless functions. The app was built with [Next.js](https://nextjs.org/) and offers offline support so team members can review or update goals anywhere.

## Features

- **Goal management** – create goals with building blocks, track completion status and discuss them via comments
- **Semester overview** – visualize progress for each user with tables and charts
- **Realtime updates** – powered by Firebase Authentication and Firestore
- **Slack & email notifications** – Cloud Functions forward goal changes and comments to Slack and send emails through EmailJS
- **Installable PWA** – offline page, update prompts and an optional home‑screen install experience
- **Responsive UI** – built with Tailwind CSS and shadcn/ui components with light and dark themes

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Provide Firebase and integration keys in a `.env.local` file:
   ```bash
   NEXT_PUBLIC_FIREBASE_API_KEY=your-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-domain
   NEXT_PUBLIC_FIREBASE_DATABASE_URL=your-db-url
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_ID=your-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement
   ```
   Cloud Functions also require the following variables which can be configured in a `.env.local` file or with with `firebase functions:config:set`:
   `SLACK_MESSAGE_WEBHOOK_KEY`, `SLACK_STATUS_WEBHOOK_KEY`, `EMAILJS_PUBLIC_KEY`, `EMAILJS_PRIVATE_KEY`, `EMAILJS_SERVICE_ID` and `EMAILJS_TEMPLATE_ID`.
3. Start the development server:
   ```bash
   npm run dev
   ```
   Visit [http://localhost:3000](http://localhost:3000) to access the app.

## Deployment

The front‑end can be deployed to [Vercel](https://vercel.com/) or any Node.js hosting platform. Test your build first by running:

```bash
npm run build
npm start
```

Firebase Cloud Functions live in the `functions/` directory and can be deployed with the Firebase CLI:

```bash
cd functions
npm install
firebase deploy --only functions
```

## License

This project is licensed under the [GPL‑3.0](https://www.gnu.org/licenses/gpl-3.0.txt) license. See the [LICENSE](LICENSE) file for full details.
