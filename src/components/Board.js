"use client"; // Updated for mobile controls

import { useState, useEffect } from 'react';
import styles from './Board.module.css';
import Candy from './Candy';
import { useGameLogic } from '../hooks/useGameLogic';

const Board = () => {
    const { board, score, setBoard } = useGameLogic();
    const [selectedCandyIndex, setSelectedCandyIndex] = useState(null);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const handleCandyClick = (index) => {
        // If nothing selected, select the first one
        if (selectedCandyIndex === null) {
            setSelectedCandyIndex(index);
            return;
        }

        // If clicking the same one, deselect
        if (selectedCandyIndex === index) {
            setSelectedCandyIndex(null);
            return;
        }

        // Check adjacency
        const validMoves = [
            selectedCandyIndex - 1,
            selectedCandyIndex + 1,
            selectedCandyIndex - 8,
            selectedCandyIndex + 8
        ];

        if (validMoves.includes(index)) {
            // Swap
            const newBoard = [...board];
            const temp = newBoard[index];
            newBoard[index] = newBoard[selectedCandyIndex];
            newBoard[selectedCandyIndex] = temp;
            setBoard(newBoard);
            setSelectedCandyIndex(null);
        } else {
            // If invalid move, just select the new one
            setSelectedCandyIndex(index);
        }
    };

    if (!isClient) return <div className={styles.loading}>Loading Game...</div>;

    return (
        <div className={styles.boardContainer}>
            <div className="score-board" style={{ marginBottom: '20px', color: 'white', textAlign: 'center' }}>
                <h2>Score: {score}</h2>
                <p style={{ fontSize: '14px', opacity: 0.8 }}>Tap two adjacent candies to swap!</p>
            </div>
            <div className={styles.grid}>
                {board.map((color, index) => (
                    <Candy
                        key={index}
                        candyIndex={index}
                        color={color}
                        isSelected={selectedCandyIndex === index}
                        onClick={handleCandyClick}
                    />
                ))}
            </div>
        </div>
    );
};

export default Board;
