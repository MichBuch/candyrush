import styles from './Candy.module.css';

const Candy = ({ color, candyIndex, dragStart, dragDrop, dragEnd }) => {
    return (
        <div
            className={`${styles.candy} ${styles[color]}`}
            draggable={true}
            onDragStart={dragStart}
            onDragOver={(e) => e.preventDefault()}
            onDragEnter={(e) => e.preventDefault()}
            onDragLeave={(e) => e.preventDefault()}
            onDrop={dragDrop}
            onDragEnd={dragEnd}
            data-id={candyIndex}
            onTouchStart={(e) => dragStart(e, candyIndex)} // Basic touch support start
        // Touch move/end is more complex for grid swaps, will iterate
        />
    )
}

export default Candy;
