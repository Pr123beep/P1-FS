# QuickPolls - Poll Creation & Voting App

A full-stack web application that allows users to create polls and vote on them with real-time results display.

## Features

- **Create Polls**: Dynamic form with question and multiple options (2-6 options)
- **Vote on Polls**: One-click voting with instant feedback
- **Live Results**: Real-time bar chart visualization of poll results
- **Poll Management**: Browse all polls with vote counts and timestamps
- **Responsive Design**: Modern, mobile-friendly interface

## Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **CORS** enabled for cross-origin requests

### Frontend
- **React 18** with functional components and hooks
- **React Router** for client-side routing
- **Axios** for API communication
- **Modern CSS** with responsive design

## Data Models

### Poll
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  question: string,
  options: [{ text: string, votes: number }],
  createdAt: Date
}
```

### Vote
```javascript
{
  _id: ObjectId,
  pollId: ObjectId,
  userId: ObjectId,
  optionIndex: number,
  createdAt: Date
}
```

## API Endpoints

- `GET /api/polls` - Get all polls
- `POST /api/polls` - Create a new poll
- `GET /api/polls/:id` - Get a specific poll
- `POST /api/polls/:id/vote` - Vote on a poll
- `GET /api/health` - Health check

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd P1-FS
   ```

2. **Install server dependencies**
   ```bash
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd client
   npm install
   cd ..
   ```

4. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/quickpolls
   PORT=5000
   NODE_ENV=development
   ```

5. **Start MongoDB**
   Make sure MongoDB is running on your system:
   ```bash
   # For local MongoDB installation
   mongod
   
   # Or use MongoDB Atlas connection string in .env
   ```

### Running the Application

#### Development Mode

1. **Start the backend server**
   ```bash
   npm run dev
   ```
   Server will run on http://localhost:5000

2. **Start the frontend client** (in a new terminal)
   ```bash
   npm run client
   ```
   Client will run on http://localhost:3000

#### Production Mode

1. **Build the client**
   ```bash
   cd client
   npm run build
   cd ..
   ```

2. **Start the production server**
   ```bash
   npm start
   ```

## Usage

1. **Create a Poll**
   - Navigate to "Create Poll"
   - Enter your question
   - Add 2-6 options
   - Click "Create Poll"

2. **Vote on Polls**
   - Browse polls on the home page
   - Click on any poll to view details
   - Click on an option to vote
   - See live results immediately

3. **View Results**
   - Results are displayed as animated bar charts
   - Percentages and vote counts are shown
   - Results update in real-time after voting

## Project Structure

```
P1-FS/
├── server/
│   ├── models/
│   │   ├── Poll.js
│   │   └── Vote.js
│   ├── routes/
│   │   └── polls.js
│   └── index.js
├── client/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── PollList.js
│   │   │   ├── CreatePoll.js
│   │   │   └── PollDetail.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
├── package.json
└── README.md
```

## API Examples

### Create a Poll
```bash
curl -X POST http://localhost:5000/api/polls \
  -H "Content-Type: application/json" \
  -d '{"question":"Which JS framework?","options":["React","Vue","Angular"]}'
```

### Vote on a Poll
```bash
curl -X POST http://localhost:5000/api/polls/POLL_ID/vote \
  -H "Content-Type: application/json" \
  -d '{"optionIndex":0}'
```

### Get All Polls
```bash
curl http://localhost:5000/api/polls
```

## Features in Detail

- **Dynamic Options**: Add/remove poll options with validation
- **Real-time Updates**: Vote counts update immediately
- **Error Handling**: Comprehensive error messages and retry functionality
- **Responsive Design**: Works on desktop and mobile devices
- **Data Validation**: Both client and server-side validation
- **Modern UI**: Clean, professional interface with smooth animations

## Future Enhancements

- User authentication and authorization
- Poll expiration dates
- Comment system for polls
- Social sharing features
- Advanced analytics and charts
- Poll categories and tags 