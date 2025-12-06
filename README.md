# See My Sound 🎵

A Spotify-powered web application that visualizes your music profile and listening data using the Spotify Web API.

## 🌟 About

See My Sound connects to your Spotify account to display personalized music insights and profile data. Built with React and Vite, this application implements secure OAuth 2.0 authentication using the PKCE (Proof Key for Code Exchange) flow to access Spotify's Web API.

## 🚀 Live Demo

Check out the live application: [see-my-sound.vercel.app](https://see-my-sound.vercel.app)

> **⚠️ Development Mode Notice**  
> This app is currently in Spotify development mode and can only be used by users who have been added to the allowlist. If you'd like to test the application, please contact the developer to be added to the user list. Learn more about [Spotify's quota modes](https://developer.spotify.com/documentation/web-api/concepts/quota-modes).

## 🛠️ Technologies Used

- **Frontend**: React + Vite
- **Styling**: CSS
- **Build Tool**: Vite with Hot Module Replacement (HMR)
- **Code Quality**: ESLint
- **Authentication**: OAuth 2.0 with PKCE
- **API**: Spotify Web API
- **Deployment**: Vercel

## 🔌 API Used

- **[Spotify Web API](https://developer.spotify.com/documentation/web-api)** - Accesses user profile data, playlists, listening history, and more

## 🔐 Authentication Flow

This application implements the [Authorization Code with PKCE Flow](https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow), which consists of the following steps:

1. **Code Challenge Generation** - Creates a code verifier and challenge for secure authentication
2. **User Authorization** - Redirects user to Spotify to authorize the application
3. **Authorization Code Retrieval** - Receives authorization code from Spotify callback
4. **Access Token Request** - Exchanges authorization code for an access token
5. **API Calls** - Uses access token to fetch user's Spotify data

### How it Works

When the page loads, the application checks for an authorization code in the callback URL:

- If no code exists, the user is redirected to Spotify's authorization page
- Once authorized, Spotify redirects back with an authorization code
- The code is exchanged for an access token
- The access token is used to call the Spotify Web API
- User profile data is retrieved and displayed in the interface

## 📁 Project Structure

```
see-my-sound/
├── public/           # Static assets
├── src/              # React source code
├── index.html        # Main HTML entry point
├── package.json      # Node.js dependencies and scripts
├── vite.config.js    # Vite configuration
└── eslint.config.js  # ESLint configuration
```

## 💻 Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Spotify Developer account
- Spotify Client ID

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/iccir919/see-my-sound.git
cd see-my-sound
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your Spotify credentials:
```env
VITE_SPOTIFY_CLIENT_ID=your_spotify_client_id_here
VITE_REDIRECT_URI=http://127.0.0.1:5500/
```

> **Getting Your Spotify Client ID:**
> 1. Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
> 2. Log in with your Spotify account
> 3. Create a new app or use an existing one
> 4. Copy your Client ID from the app settings
> 5. Add `http://127.0.0.1:5500/` to your app's Redirect URIs in the settings

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://127.0.0.1:5500/` (or the port shown in your terminal)

### Adding Test Users (Development Mode)

Since this app is in development mode, you'll need to add users to the allowlist:

1. Log in to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Click on your app
3. Go to Settings
4. Click on the "Users and Access" tab
5. Click "Add new user"
6. Enter the name and Spotify email address of the user you want to add
7. The user can now authorize and use your app

## 🔧 Available Scripts

- `npm run dev` - Start the development server with HMR
- `npm run build` - Build the production-ready application
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint to check code quality

## 🌐 Deployment

This project is configured for easy deployment on Vercel:

1. Push your changes to GitHub
2. Connect your repository to Vercel
3. Add your environment variables in Vercel project settings:
   - `VITE_SPOTIFY_CLIENT_ID`
   - `VITE_REDIRECT_URI` (use your production URL)
4. Update your Spotify app's Redirect URIs to include your production URL
5. Vercel will automatically deploy on every push to main

### Environment Variables for Production

```env
VITE_SPOTIFY_CLIENT_ID=your_spotify_client_id
VITE_REDIRECT_URI=https://your-production-url.vercel.app/
```

> **Important:** Don't forget to add your production URL to the Redirect URIs in your Spotify Developer Dashboard!

## 🎯 Features

- Secure OAuth 2.0 authentication with PKCE flow
- Access to Spotify user profile data
- Privacy-focused: No server-side data storage
- Fast and responsive design
- Modern React architecture with Vite

## 📚 Learn More

- [Spotify Web API Documentation](https://developer.spotify.com/documentation/web-api)
- [Authorization Code with PKCE Flow](https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow)
- [Display Spotify Profile Data Tutorial](https://developer.spotify.com/documentation/web-api/howtos/web-app-profile)
- [Spotify Quota Modes](https://developer.spotify.com/documentation/web-api/concepts/quota-modes)

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

This project uses ESLint for code quality. Please ensure your code passes linting before submitting:

```bash
npm run lint
```

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**iccir919**

- GitHub: [@iccir919](https://github.com/iccir919)
- Project Link: [https://github.com/iccir919/see-my-sound](https://github.com/iccir919/see-my-sound)

## ⭐ Show Your Support

Give a ⭐️ if you like this project and want to see more Spotify-powered applications!

---

*Built with React, powered by Spotify Web API* 🎵✨
