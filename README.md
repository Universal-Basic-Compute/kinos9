# Kinos9 - Swarm Management Platform

A Next.js application for managing Swarms, their services, news, and other related data using Airtable as a backend.

## Features

- **Swarm Management**: View and edit detailed information about Swarms
- **News Management**: Create, read, update, and delete news items
- **Service Tracking**: View services offered by each Swarm
- **Mission Tracking**: Monitor missions led by Swarms
- **Thought Collection**: Capture and display thoughts related to Swarms
- **Redistribution Tracking**: Track token redistributions for Swarms

## Tech Stack

- **Frontend**: Next.js 15, React 19, TailwindCSS 4
- **Backend**: Airtable API
- **Data Fetching**: Server Components with Client Components for interactive features
- **Styling**: TailwindCSS for responsive design

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Airtable account with a base set up

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/kinos9.git
   cd kinos9
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with your Airtable credentials:
   ```
   AIRTABLE_API_KEY=your_api_key_here
   AIRTABLE_BASE_ID=your_base_id_here
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Airtable Schema

The application uses the following tables in Airtable:

- **Swarms**: Main entities with details like name, description, revenue, etc.
- **News**: News items related to Swarms
- **Services**: Services offered by Swarms
- **Thoughts**: Thoughts related to Swarms
- **Missions**: Tasks or projects led by Swarms
- **Redistributions**: Token redistributions for Swarms

You can generate a schema of your Airtable base by running:
```bash
npm run schema
```

This will create an `airtable-schema.json` file with the structure of your Airtable base.

## Project Structure

- `app/`: Next.js app directory
  - `components/`: Reusable React components
  - `services/`: API services for data fetching
  - `scripts/`: Utility scripts
  - `swarms/`: Swarm-related pages
  - `news/`: News management pages
  - `api/`: API routes
  - `layout.tsx`: Root layout component
  - `page.tsx`: Home page

## Development

### Adding New Features

1. Create new components in the `app/components/` directory
2. Add new API functions in `app/services/airtable.ts`
3. Create new pages in the appropriate directories

### Styling

The project uses TailwindCSS for styling. Customize the design by editing the component classes.

## Deployment

Deploy the application to Vercel:

1. Push your code to a GitHub repository
2. Connect the repository to Vercel
3. Add your environment variables in the Vercel dashboard
4. Deploy!

## License

This project is licensed under the MIT License.
