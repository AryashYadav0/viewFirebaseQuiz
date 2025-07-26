# Vue 3 + Firebase Programming Question App

A comprehensive web application built with Vue 3 (Nuxt 3) and Firebase that allows users to solve programming questions and administrators to manage submissions and users.

## 🚀 Features

### 🧑 Visitor Features
- **Google Authentication**: Secure login using Firebase Auth
- **Programming Challenge**: Interactive coding environment with syntax highlighting
- **Code Execution**: Real-time Python code testing with Pyodide
- **Solution Submission**: Save coding solutions to Firebase Firestore
- **Responsive Design**: Optimized for desktop and mobile devices

### 🛠️ Admin Features
- **Admin Dashboard**: Comprehensive management interface
- **Submission Management**: View all user submissions with code details
- **User Administration**: Add/remove admin users
- **Statistics**: View total admins, submissions, and unique users
- **Role-based Access**: Secure admin-only routes and functionality

### 🔐 Security Features
- **Firebase Authentication**: Google Sign-In integration
- **Firestore Security Rules**: Proper data access controls
- **Role-based Access Control**: Admin/visitor permission management
- **Secure Data Storage**: All submissions and admin data stored in Firebase

## 🛠️ Tech Stack

- **Frontend**: Vue 3 with Nuxt 3
- **State Management**: Pinia
- **Authentication**: Firebase Auth
- **Database**: Firebase Firestore
- **Styling**: TailwindCSS
- **Code Editor**: CodeMirror with syntax highlighting
- **Code Execution**: Pyodide (Python in browser)
- **Icons**: Heroicons

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd vue-firebase-programming-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Firebase Setup**
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication with Google Sign-In provider
   - **IMPORTANT**: Add authorized domains for development:
     - Go to Authentication > Settings > Authorized domains
     - Add `localhost` and `localhost:3000` to the authorized domains list
     - This is required to prevent `auth/unauthorized-domain` errors during development
   - Create a Firestore database
   - Copy your Firebase configuration

4. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   Fill in your Firebase configuration values in the `.env` file.

5. **Deploy Firestore Security Rules**
   Copy the contents from `firestore.rules` to your Firebase Console > Firestore Database > Rules

6. **Create Initial Admin**
   In Firestore, manually create the first admin document:
   - Collection: `admins`
   - Document ID: your-email@gmail.com
   - Fields:
     ```javascript
     {
       addedAt: new Date(),
       addedBy: "system"
     }
     ```

## 🚦 Usage

### Development Server
```bash
npm run dev
```
Visit `http://localhost:3000`

### Production Build
```bash
npm run build
npm run preview
```

## 📱 Application Flow

### For Visitors:
1. Visit the homepage
2. Sign in with Google
3. Navigate to the question page
4. Write code solution in the editor
5. Test code execution with "Run Code"
6. Submit final solution

### For Admins:
1. Sign in with Google (must be pre-approved admin)
2. Access Admin Dashboard
3. View all user submissions
4. Manage admin users (add/remove)
5. Monitor application statistics

## 🔧 Firebase Configuration

### Firestore Collections:

#### `users`
```javascript
{
  email: string,
  displayName: string,
  photoURL: string,
  lastLogin: Date,
  createdAt: Date
}
```

#### `submissions`
```javascript
{
  userEmail: string,
  userName: string,
  code: string,
  language: string,
  question: string,
  submittedAt: Date,
  result: {
    output?: string,
    error?: string
  }
}
```

#### `admins`
```javascript
{
  addedAt: Date,
  addedBy: string
}
```

### Security Rules
The included `firestore.rules` ensure:
- Users can only read/write their own data
- Only authenticated users can submit solutions
- Only admins can view all submissions
- Only admins can manage admin users

## 🎨 UI/UX Features

- **Modern Design**: Clean, professional interface with gradient backgrounds
- **Responsive Layout**: Optimized for all screen sizes
- **Interactive Elements**: Smooth animations and hover effects
- **Code Editor**: Syntax highlighting with Dracula theme
- **Real-time Feedback**: Instant code execution results
- **Loading States**: Proper loading indicators throughout the app

## 🔐 Security Best Practices

- Firebase Authentication for secure user management
- Firestore security rules for data protection
- Role-based access control for admin features
- Client-side route protection middleware
- Secure API key management through environment variables

## 📸 Screenshots

### Homepage
![Homepage](screenshots/homepage.png)

### Question Page
![Question Page](screenshots/question.png)

### Admin Dashboard
![Admin Dashboard](screenshots/admin.png)

## 🎥 Demo Video

[Watch the application in action](demo/app-demo.mp4)

## 🐛 Troubleshooting

### Common Issues:

1. **Authentication not working**
   - Check Firebase configuration in `.env`
   - Verify Google Sign-In is enabled in Firebase Console
   - Ensure authorized domains are configured

2. **Pyodide loading issues**
   - Pyodide requires a modern browser with WebAssembly support
   - Check browser console for loading errors
   - Try refreshing the page

3. **Admin access denied**
   - Ensure your email is added to the `admins` collection in Firestore
   - Check Firestore security rules are properly deployed

## 🚀 Deployment

The application can be deployed to various platforms:

### Netlify
1. Build the project: `npm run build`
2. Deploy the `.output/public` folder to Netlify
3. Configure environment variables in Netlify dashboard

### Vercel
1. Connect your repository to Vercel
2. Configure environment variables
3. Deploy automatically on push

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

For issues and questions:
- Open an issue on GitHub
- Check the troubleshooting section above
- Review Firebase documentation for backend issues

---

**Note**: This is a demo application. For production use, ensure proper error handling, monitoring, and additional security measures are implemented.