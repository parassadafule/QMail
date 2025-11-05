# QMail - Quantum-Secure Email Client

QMail is a secure email client application that integrates quantum key distribution (QKD) for end-to-end encryption of emails and attachments. It provides a modern web interface for composing, sending, receiving, and managing emails with advanced security features.

## Features

- **User Authentication**: Secure login and registration with JWT-based authentication
- **Email Composition**: Rich text email composition with attachment support
- **Quantum Encryption**: Uses QKD-generated keys for XOR-based encryption of email content and attachments
- **Secure Storage**: Encrypted emails stored in MongoDB with quantum-secure keys
- **Email Management**: Inbox, Sent, Trash, and Search functionality
- **Real-time Updates**: Live email status and notifications
- **SMTP Integration**: Custom SMTP server for receiving emails
- **File Attachments**: Secure encryption and decryption of email attachments
- **Responsive Design**: Modern UI built with React and Tailwind CSS

## Tech Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible UI components
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **Framer Motion** - Animation library

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework for authentication and API
- **Python Flask** - Microframework for email encryption/decryption services
- **MongoDB** - NoSQL database for user and email data
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing
- **SMTP Server** - Custom SMTP server for email reception

### Security & Encryption
- **Quantum Key Distribution (QKD)** - Generates quantum-secure encryption keys
- **XOR Encryption** - Symmetric encryption for email content
- **Hex Encoding** - Secure encoding of encrypted data

## Architecture

The application consists of three main components:

1. **Client (React App)**: User interface for email management
2. **Authentication Server (Node.js/Express)**: Handles user authentication and basic API
3. **Email Processing Server (Python/Flask)**: Handles encryption, decryption, and email sending
4. **SMTP Server (Node.js)**: Receives incoming emails

## Email Sending Process

1. **Composition**: User composes email with subject, body, and optional attachment
2. **Key Generation**: QKD service generates a quantum-secure key based on content size
3. **Encryption**:
   - Email subject and body are encrypted using XOR with the generated key
   - Attachments are encrypted separately using the same key
   - All encrypted data is hex-encoded for storage
4. **Storage**: Encrypted email, key, and metadata are stored in MongoDB
5. **Transmission**: Encrypted email is sent to recipient via SMTP
6. **Delivery**: Recipient's SMTP server receives the encrypted email

## Email Viewing Process

1. **Fetch**: Client requests email list or specific email from server
2. **Retrieval**: Server fetches encrypted email data from database
3. **Decryption**:
   - Email subject and body are decrypted using stored key
   - Attachments are decrypted on-demand
4. **Display**: Decrypted content is sent to client for display

## Installation

### Prerequisites
- Node.js (v18 or higher)
- Python 3.8+
- MongoDB
- Git

### Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd QMail
   ```

2. **Setup Backend**:
   ```bash
   cd server
   npm install
   # Create .env file with MongoDB URI, JWT secret, etc.
   ```

3. **Setup Email Processing Service**:
   ```bash
   cd app
   pip install -r requirements.txt
   # Configure settings in config/settings.py
   ```

4. **Setup Frontend**:
   ```bash
   cd ../client
   npm install
   ```

5. **Start MongoDB** and ensure it's running on the configured port.

## Usage

### Development

1. **Start Backend Services**:
   ```bash
   # Terminal 1: Authentication server
   cd server
   npm start

   # Terminal 2: Email processing server
   cd app
   python main.py

   # Terminal 3: SMTP server (for receiving emails, hosted on Amazon EC2)
   node smtpServer.js
   ```

2. **Start Frontend**:
   ```bash
   # Terminal 4: Client
   cd client
   npm run dev
   ```

3. **Access the application** at `http://localhost:5173`

### Production Deployment

- Deploy the Node.js servers to a cloud platform (AWS EC2, Heroku, etc.)
- Configure environment variables for production
- Set up MongoDB Atlas or a managed MongoDB instance
- Configure domain and SSL certificates
- For SMTP, ensure port 25 is accessible or use AWS SES for sending

## API Endpoints

### Authentication (Node.js/Express)
- `POST /register` - User registration
- `POST /login` - User login
- `GET /profile` - Get user profile

### Email Processing (Python/Flask)
- `POST /encrypt` - Encrypt and send email
- `POST /decrypt` - Decrypt email content
- `GET /download/<email_id>` - Download decrypted attachment
- `GET /test` - Health check

## Security Features

- **Quantum Key Distribution**: Uses quantum principles for key generation
- **End-to-End Encryption**: Emails encrypted before transmission
- **Secure Storage**: Keys and encrypted data stored separately
- **JWT Authentication**: Secure user sessions
- **Password Hashing**: bcrypt for password security

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Future Enhancements

- Real-time chat integration
- Email templates
- Advanced search and filtering
- Multi-language support
- Mobile app development
- Integration with external email providers