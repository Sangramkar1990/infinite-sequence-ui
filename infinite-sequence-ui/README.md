# Infinite Sequence UI

A React application for creating and connecting cards in a flow-based interface using React Flow.

## Features

- User authentication (login/registration)
- Interactive flow editor for creating and connecting cards
- Responsive design using Bootstrap
- React Flow for node-based UI

## Technologies Used

- React
- React Router for navigation
- React Flow for interactive node-based UI
- Bootstrap for styling

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/infinite-sequence-ui.git
   cd infinite-sequence-ui
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start the development server
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
src/
├── assets/        # Static assets
├── components/    # Reusable components
├── context/       # React context for state management
├── pages/         # Page components
├── utils/         # Utility functions
├── App.jsx        # Main application component
├── main.jsx       # Entry point
```

## Building for Production

```bash
npm run build
```

This will create a `dist` folder with the production build of the application.

## License

MIT

