"use client";

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
        if (selectedCandyIndex === null) {
            setSelectedCandyIndex(index);
        } else if (selectedCandyIndex === index) {
            setSelectedCandyIndex(null);
        } else {
            const validMoves = [
                selectedCandyIndex - 1,
                selectedCandyIndex + 1,
                selectedCandyIndex - 8,
                selectedCandyIndex + 8
            ];

            // Allow swap attempts even if invalid logic might reject (handled by game logic hook ideally, but here simplicity)
            // But strict masking for adjacent:
            if (validMoves.includes(index)) {
                // Perform local swap logic - triggering state update
                const newBoard = [...board];
                const temp = newBoard[index];
                newBoard[index] = newBoard[selectedCandyIndex];
                newBoard[selectedCandyIndex] = temp;
                setBoard(newBoard);
                setSelectedCandyIndex(null);
            } else {
                setSelectedCandyIndex(index);
            }
        }
    };

    if (!isClient) return <div className={styles.loading}>Loading...</div>;

    return (
        <div className={styles.boardContainer}>
            <div className={styles.uiPanel}>
                <h2 className={styles.scoreTitle}>Score: {score}</h2>
                <div className={styles.instructions}>
                    <p><strong>How to Play:</strong></p>
                    <p>1. Tap a candy to select it.</p>
                    <p>2. Tap an adjacent candy to swap.</p>
                    <p>3. Match 3 or more colors!</p>
                </div>
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
