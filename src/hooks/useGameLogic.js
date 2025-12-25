import { useState, useEffect, useCallback } from 'react';

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

    // Initialize on client only to prevent hydration mismatch
    useEffect(() => {
        setIsClient(true);
        setBoard(createBoard());
    }, []);

    const checkForMatches = useCallback(() => {
        let matches = [];
        const notValid = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 62, 63];

        // Horizontal matches
        for (let i = 0; i < 64; i++) {
            const rowOfThree = [i, i + 1, i + 2];
            const rowOfFour = [i, i + 1, i + 2, i + 3];

            // Check 4
            if (notValid.indexOf(i) === -1 && (i + 3) % WIDTH >= 3 && board[i]) {
                if (rowOfFour.every(square => board[square] === board[i])) {
                    // matches.push(...rowOfFour); // Simplification, sticking to 3s logic for robustness first
                }
            }

            // Check 3
            if (i % WIDTH < WIDTH - 2) {
                if (board[i] && board[i] === board[i + 1] && board[i] === board[i + 2]) {
                    matches.push(i, i + 1, i + 2);
                }
            }
        }

        // Vertical matches
        for (let i = 0; i <= 47; i++) {
            if (board[i] && board[i] === board[i + WIDTH] && board[i] === board[i + WIDTH * 2]) {
                matches.push(i, i + WIDTH, i + WIDTH * 2);
            }
        }

        const uniqueMatches = [...new Set(matches)];

        if (uniqueMatches.length > 0) {
            const newBoard = [...board];
            uniqueMatches.forEach(index => newBoard[index] = '');
            setBoard(newBoard);
            setScore(prev => prev + uniqueMatches.length * 10);
            return true;
        }
        return false;
    }, [board]);

    const moveCandiesDown = useCallback(() => {
        // Only run if no matches were just handled (to allow clear animation theoretically, but here instant)
        // Actually, we should check for moves regardless.

        const newBoard = [...board];
        let moved = false;

        for (let i = 0; i <= 55; i++) {
            const firstRow = [0, 1, 2, 3, 4, 5, 6, 7];
            const isFirstRow = firstRow.includes(i);

            if (isFirstRow && newBoard[i] === '') {
                newBoard[i] = CANDY_colors[Math.floor(Math.random() * CANDY_colors.length)];
                moved = true;
            }

            if (newBoard[i + WIDTH] === '') {
                newBoard[i + WIDTH] = newBoard[i];
                newBoard[i] = '';
                moved = true;
            }
        }

        // Fill top row specifically if empty and not caught above (redundant but safe)
        for (let i = 0; i < WIDTH; i++) {
            if (newBoard[i] === '') {
                newBoard[i] = CANDY_colors[Math.floor(Math.random() * CANDY_colors.length)];
                moved = true;
            }
        }

        if (moved) setBoard(newBoard);
        return moved;

    }, [board]);

    // Reactive Game Loop
    useEffect(() => {
        if (!isClient) return;

        const timer = setTimeout(() => {
            const matchesFound = checkForMatches();
            if (!matchesFound) {
                moveCandiesDown();
            }
        }, 100); // 100ms delay to pace the game

        return () => clearTimeout(timer);
    }, [board, checkForMatches, moveCandiesDown, isClient]);

    return { board, score, setBoard };
};

