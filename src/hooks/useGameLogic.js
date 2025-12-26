import { useState, useEffect, useCallback, useRef } from 'react';

const WIDTH = 8;
const CANDY_colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];

const createBoard = () => {
    const randomBoard = [];
    for (let i = 0; i < WIDTH * WIDTH; i++) {
        const randomColor = CANDY_colors[Math.floor(Math.random() * CANDY_colors.length)];
        randomBoard.push(randomColor);
    }
    return randomBoard;
};

export const useGameLogic = () => {
    const [board, setBoard] = useState([]);
    const [score, setScore] = useState(0);
    const [isClient, setIsClient] = useState(false);

    // Prevent infinite loops with manual processing flag? 
    // Effect chain is safer.

    useEffect(() => {
        setIsClient(true);
        setBoard(createBoard());
    }, []);

    const checkForMatches = useCallback(() => {
        let matches = [];
        // Horizontal
        for (let i = 0; i < 64; i++) {
            if (i % WIDTH < WIDTH - 2) {
                if (board[i] && board[i] === board[i + 1] && board[i] === board[i + 2]) {
                    matches.push(i, i + 1, i + 2);
                }
            }
        }
        // Vertical
        for (let i = 0; i <= 47; i++) {
            if (board[i] && board[i] === board[i + WIDTH] && board[i] === board[i + WIDTH * 2]) {
                matches.push(i, i + WIDTH, i + WIDTH * 2);
            }
        }

        const uniqueMatches = [...new Set(matches)];

        if (uniqueMatches.length > 0) {
            console.log("Matches found:", uniqueMatches);
            const newBoard = [...board];
            uniqueMatches.forEach(index => newBoard[index] = '');
            setBoard(newBoard);
            setScore(prev => prev + uniqueMatches.length * 10);
            return true;
        }
        return false;
    }, [board]);

    const moveCandiesDown = useCallback(() => {
        const newBoard = [...board];
        let moved = false;

        // Gravity Logic
        for (let i = 0; i < 64 - WIDTH; i++) { // Check up to second to last row
            // We generally iterate columns bottom up or just brute force repeatedly
            // Let's do a simple full pass. 
            // If a square is empty, pull from above
        }

        // Better Gravity: Loop columns
        for (let col = 0; col < WIDTH; col++) {
            for (let row = WIDTH - 1; row >= 0; row--) {
                const index = col + row * WIDTH;

                if (newBoard[index] === '') {
                    // Empty spot, find nearest candy above
                    if (row === 0) {
                        // Top row, fill random
                        newBoard[index] = CANDY_colors[Math.floor(Math.random() * CANDY_colors.length)];
                        moved = true;
                    } else {
                        // Pull from above
                        if (newBoard[index - WIDTH] !== '') {
                            newBoard[index] = newBoard[index - WIDTH];
                            newBoard[index - WIDTH] = ''; // clear source
                            moved = true;
                        } else if (row === 0) {
                            // Should be caught above but logic check
                        }
                    }
                }
            }
        }

        // Ensure top row fills if empty
        for (let i = 0; i < WIDTH; i++) {
            if (newBoard[i] === '') {
                newBoard[i] = CANDY_colors[Math.floor(Math.random() * CANDY_colors.length)];
                moved = true;
            }
        }

        if (moved) {
            setBoard(newBoard);
            return true;
        }
        return false;
    }, [board]);

    // Game Loop
    useEffect(() => {
        if (!isClient) return;

        // Using a short timeout to decouple state updates
        const timeout = setTimeout(() => {
            const matchesFound = checkForMatches();
            if (!matchesFound) {
                moveCandiesDown();
            }
        }, 150);

        return () => clearTimeout(timeout);
    }, [board, checkForMatches, moveCandiesDown, isClient]);

    return { board, score, setBoard };
};
