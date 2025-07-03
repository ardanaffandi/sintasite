# Personal Endorsement Site

A comprehensive platform for managing brand partnerships, affiliate marketing, and UMKM collaborations.

## Features

### 🎯 **Core Functionality**
- **Homepage Management**: Dynamic profile and content management
- **Affiliate Lookbook**: Product recommendations with Indonesian pricing
- **Big Brands Portal**: Enterprise partnership management
- **UMKM Partnership**: Small business collaboration platform

### 👥 **Admin System**
- **Multi-level User Management**: Super Admin, Admin, Editor, Viewer roles
- **Granular Permissions**: 9 different permission levels
- **Secure Authentication**: Session management and security controls
- **Activity Tracking**: User login and action logging

### 📊 **Analytics & Management**
- **Dashboard Analytics**: Page views, clicks, conversions
- **Order Management**: UMKM order tracking and status updates
- **Inquiry System**: Customer inquiry management
- **Data Export/Import**: Complete backup and restore functionality

### 🎨 **Content Management**
- **Dynamic Sections**: Flexible content blocks for Big Brands page
- **File Upload**: Image management with validation
- **Category Management**: Dynamic affiliate categories
- **Price Attributes**: Indonesian currency with custom attributes

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
\`\`\`bash
git clone <repository-url>
cd personal-endorsement-site
\`\`\`

2. **Install dependencies**
\`\`\`bash
npm install
\`\`\`

3. **Set up environment variables**
\`\`\`bash
cp .env.example .env.local
# Edit .env.local with your configuration
\`\`\`

4. **Run development server**
\`\`\`bash
npm run dev
\`\`\`

5. **Access the application**
- Frontend: http://localhost:3000
- Admin Panel: http://localhost:3000/admin
- Default Login: admin / admin123

## Deployment

### Static Export (Recommended)
\`\`\`bash
npm run export
\`\`\`
This creates a `out/` folder that can be deployed to any static hosting service.

### Hosting Options

#### 1. **Vercel** (Recommended)
\`\`\`bash
npm install -g vercel
vercel
\`\`\`

#### 2. **Netlify**
1. Connect your GitHub repository
2. Build command: `npm run export`
3. Publish directory: `out`

#### 3. **GitHub Pages**
\`\`\`bash
npm run export
# Upload the 'out' folder contents to your GitHub Pages repository
\`\`\`

#### 4. **Traditional Web Hosting**
1. Run `npm run export`
2. Upload the `out` folder contents to your web server

## Configuration

### Admin Users
Default admin credentials:
- Username: `admin`
- Password: `admin123`

**⚠️ Important**: Change the default password immediately after deployment!

### Permission Levels
- **Super Admin**: Full system access
- **Admin**: Content and order management
- **Editor**: Content management only
- **Viewer**: Read-only access

### Security Features
- Session timeout management
- Login attempt limiting
- Two-factor authentication ready
- Maintenance mode
- Debug mode controls

## Data Management

### Backup & Restore
- **Export**: Download complete site backup as JSON
- **Import**: Restore from backup file
- **Auto-backup**: Configurable frequency

### Data Storage
- Uses localStorage for demo/development
- Ready for database integration
- All data structures documented

## Customization

### Styling
- Tailwind CSS for styling
- Custom gradient themes
- Responsive design
- Dark mode ready

### Content
- Dynamic section management
- File upload system
- Multi-language ready
- SEO optimized

## API Integration Ready

The system is structured to easily integrate with:
- **Database**: PostgreSQL, MySQL, MongoDB
- **Authentication**: JWT, OAuth, SAML
- **Email**: SendGrid, Mailgun, SMTP
- **Analytics**: Google Analytics, Mixpanel
- **Payment**: Stripe, PayPal, Midtrans
- **Storage**: AWS S3, Cloudinary

## Production Checklist

### Security
- [ ] Change default admin password
- [ ] Set up proper environment variables
- [ ] Enable HTTPS
- [ ] Configure session secrets
- [ ] Set up proper CORS policies

### Performance
- [ ] Optimize images
- [ ] Enable compression
- [ ] Set up CDN
- [ ] Configure caching headers

### Monitoring
- [ ] Set up error tracking
- [ ] Configure analytics
- [ ] Set up uptime monitoring
- [ ] Enable backup automation

### SEO
- [ ] Configure meta tags
- [ ] Set up sitemap
- [ ] Add robots.txt
- [ ] Optimize for Core Web Vitals

## Support

For technical support or customization requests:
- Email: admin@your-domain.com
- Documentation: Available in `/docs`
- Issues: GitHub Issues

## License

This project is proprietary software. All rights reserved.

---

**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS**
\`\`\`

Let's also create a loading page component for better UX:
