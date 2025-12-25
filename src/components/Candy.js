import styles from './Candy.module.css';

const Candy = ({ color, candyIndex, isSelected, onClick }) => {
    return (
        <div
            className={`${styles.candy} ${styles[color]} ${isSelected ? styles.selected : ''}`}
            onClick={() => onClick(candyIndex)}
            style={{ touchAction: 'manipulation' }} // Improves touch response
        />
    )
}

export default Candy;
