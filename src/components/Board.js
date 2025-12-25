"use client"; // Client component

import { useState, useEffect } from 'react';
import styles from './Board.module.css';
import Candy from './Candy';
import { useGameLogic } from '../hooks/useGameLogic';

const Board = () => {
    const { board, score, setBoard } = useGameLogic();
    const [draggedCandy, setDraggedCandy] = useState(null);
    const [replacedCandy, setReplacedCandy] = useState(null);

    const dragStart = (e) => {
        setDraggedCandy(e.target);
    };

    const dragDrop = (e) => {
        setReplacedCandy(e.target);
    };

    const dragEnd = () => {
        if (!draggedCandy || !replacedCandy) return;

        const draggedId = parseInt(draggedCandy.getAttribute('data-id'));
        const replacedId = parseInt(replacedCandy.getAttribute('data-id'));

        const validMoves = [
            draggedId - 1,
            draggedId + 1,
            draggedId - 8,
            draggedId + 8
        ];

        const validMove = validMoves.includes(replacedId);

        if (validMove) {
            const newBoard = [...board];
            newBoard[replacedId] = board[draggedId];
            newBoard[draggedId] = board[replacedId];
            setBoard(newBoard);
            // TODO: Check if swap resulted in match, if not revert? 
            // Currently simplified to allow swaps.
        }

        setDraggedCandy(null);
        setReplacedCandy(null);
    };


    return (
        <div className={styles.boardContainer}>
            <div className="score-board">
                <h2>Score: {score}</h2>
            </div>
            <div className={styles.grid}>
                {board.map((color, index) => (
                    <Candy
                        key={index}
                        candyIndex={index}
                        color={color}
                        dragStart={dragStart}
                        dragDrop={dragDrop}
                        dragEnd={dragEnd}
                    />
                ))}
            </div>
        </div>
    );
};

export default Board;
