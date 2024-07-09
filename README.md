# Memory Game

## Description

This Memory Game is an engaging web-based application that challenges players to match pairs of cards while managing their moves. Set in a sleek, modern UI, the game progressively increases in difficulty across multiple levels, providing an entertaining experience for users of all ages.

Key features include:
- Responsive design for both desktop and mobile play
- Progressive difficulty levels
- Move counter to add challenge
- Persistent game state across page reloads
- Attractive animations and a futuristic theme

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Game Rules](#game-rules)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)

## Installation

To run this project on your local machine, follow these steps:

1. Ensure you have [Node.js](https://nodejs.org/) installed on your computer.
2. Open your terminal or command prompt.
3. Clone this repository to your local machine:
4. Navigate to the project directory:
5. Initialise a new Node.js project:
6. Install the required dependencies: (`npm init`)
7. Create a new file named `server.js` in the project root directory:
8. Open `server.js` in your preferred text editor and paste the provided server code.
9. Create a `public` folder in your project directory:
10. Move your HTML, CSS, and client-side JavaScript files into the `public` folder:
 ```
 mv index.html general.css work4.js public/
 ```
 (On Windows, use `move` instead of `mv`)

11. Your file structure should now look like this:
 ```
 futuristic-memory-game/
 ├── node_modules/
 ├── public/
 │   ├── index.html
 │   ├── general.css
 │   └── work4.js
 ├── server.js
 └── package.json
 ```

12. Start the server:
 ```
 node server.js
 ```

13. Open a web browser and navigate to `http://localhost:42111` to play the game.

## Usage

To start the game server:

1. In the project directory, run: (type node server.js in the terminal)
2. Open a web browser and go to `http://localhost:42111` (or the port specified in your console output).
3. The game should now be running in your browser. Enjoy playing!

## Game Rules

1. Click on cards to reveal their hidden images.
2. You cannot click on the same card twice in a row.
3. Try to find matching pairs of images.
4. You have a limited number of moves for each level.
5. Successfully match all pairs to advance to the next level.
6. The game gets progressively harder with more cards and fewer moves allowed.

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES6+)
- Node.js
- Express.js
- express-session for game state persistence

## Contributing

Contributions to improve the game are welcome. Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
