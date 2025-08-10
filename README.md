# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/0ea76660-9d8e-4aab-b25a-26cad15a67b6

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/0ea76660-9d8e-4aab-b25a-26cad15a67b6) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## HITAM Tree Loading Animation

The project includes a custom HITAM tree logo loading animation with the following features:

### Animation Components
- `HITAMTreeLoading` - Basic tree loading animation
- `HITAMTreeLoadingDetailed` - Advanced version with progress control and phases
- `HITAMTreeLoadingSimple` - Minimal version for inline use
- `AuthenticationLoading` - Full-screen authentication loading experience
- `ResponsiveHITAMLoading` - Responsive loading that adapts to screen size

### Features
- **Progressive Filling**: Tree fills from white (roots) to green (leaves)
- **Progress Control**: Can be controlled with progress prop (0-100%)
- **Responsive Design**: Adapts to mobile and desktop screens
- **Multiple Variants**: Different sizes and complexity levels
- **Brand Integration**: Uses official HITAM tree logo and brand colors
- **Performance Optimized**: Lightweight SVG animations

### Usage Examples

```tsx
// Basic usage
<HITAMTreeLoading size="lg" showText={true} />

// Controlled progress
<HITAMTreeLoadingDetailed 
  progress={loadingProgress} 
  onComplete={() => console.log('Loading complete!')}
/>

// Authentication loading
<AuthenticationLoading 
  userRole="employee"
  onComplete={() => navigate('/dashboard')}
/>

// Responsive loading
<ResponsiveHITAMLoading 
  variant="auth"
  message="Authenticating..."
/>
```

### Integration Points
- Login/Authentication screens
- Page transitions
- Document upload progress
- Form submissions
- API call loading states

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/0ea76660-9d8e-4aab-b25a-26cad15a67b6) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
