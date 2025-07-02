# Sinta Nuriyah - Professional Endorsement Site

A modern, responsive website for professional endorsement and partnership services with a built-in CMS for content management.

## Features

- **Professional Landing Page**: Showcase services and expertise
- **UMKM Partnership Portal**: Application system for small business partnerships
- **Big Brands Collaboration**: Enterprise inquiry system
- **Affiliate Products**: Product recommendation system
- **Admin CMS**: Complete content management system
- **Real-time Updates**: Changes reflect immediately on the live site
- **Responsive Design**: Works perfectly on all devices
- **SEO Optimized**: Built for search engine visibility

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS + shadcn/ui components
- **Authentication**: Simple session-based auth
- **Storage**: LocalStorage with sync capabilities
- **Deployment**: Vercel-ready configuration

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
\`\`\`bash
git clone <your-repo-url>
cd endorsement-site
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Admin Access

- **URL**: `/admin`
- **Username**: `sinta`
- **Password**: `Ketemudibandung1`

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Deploy with one click

The site will be automatically deployed and any CMS changes will be reflected immediately.

### Environment Variables

Set these in your Vercel dashboard:

- `NEXT_PUBLIC_SITE_URL`: Your production URL
- `NEXT_PUBLIC_API_URL`: Your API endpoint URL
- `NEXT_PUBLIC_GA_ID`: Google Analytics ID (optional)

## Project Structure

\`\`\`
├── app/                    # Next.js app directory
│   ├── admin/             # Admin CMS pages
│   ├── api/               # API routes
│   ├── umkm/              # UMKM partnership pages
│   ├── big-brands/        # Enterprise collaboration pages
│   ├── affiliate/         # Affiliate products pages
│   └── page.tsx           # Homepage
├── components/            # Reusable components
│   └── ui/               # shadcn/ui components
├── lib/                  # Utility libraries
│   ├── storage.ts        # Data management
│   ├── auth.ts           # Authentication
│   └── file-utils.ts     # File handling
└── public/               # Static assets
\`\`\`

## CMS Features

### Homepage Management
- Hero section customization
- About section editing
- Services management
- Testimonials management
- Contact information

### Application Management
- UMKM partnership applications
- Big brand inquiries
- Status tracking and updates

### Settings
- Site configuration
- SEO settings
- Social media links
- Analytics integration

## API Endpoints

- `GET /api/data/[...path]` - Fetch data
- `POST /api/data/[...path]` - Create new entries
- `PUT /api/data/[...path]` - Update existing data

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Support

For support or questions, please contact the development team or create an issue in the repository.

## License

This project is proprietary and confidential.
