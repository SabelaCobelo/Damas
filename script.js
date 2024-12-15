const board = document.getElementById('board');
const SIZE = 8;
const PIECE_CLASSES = {
    white: 'white-piece',
    black: 'black-piece',
    king: 'king'
};
let currentPlayer = 'black';
let selectedPiece = null;
let validMoves = [];

// Función que crea el tablero
const createBoard = () => {
    for (let row = 0; row < SIZE; row++) {
        for (let col = 0; col < SIZE; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = row;
            cell.dataset.col = col;
            board.appendChild(cell);

            // Solo colocar piezas en celdas oscuras
            if ((row + col) % 2 === 1) {
                if (row < 3) {
                    const piece = document.createElement('div');
                    piece.classList.add(PIECE_CLASSES.black);
                    piece.classList.add('piece');
                    piece.dataset.row = row;
                    piece.dataset.col = col;
                    cell.appendChild(piece);
                } else if (row > 4) {
                    const piece = document.createElement('div');
                    piece.classList.add(PIECE_CLASSES.white);
                    piece.classList.add('piece');
                    piece.dataset.row = row;
                    piece.dataset.col = col;
                    cell.appendChild(piece);
                }
            }

            // Agregar el manejador de clics
            cell.addEventListener('click', () => onCellClick(cell));
        }
    }
};

// Maneja el clic en una celda
const onCellClick = (cell) => {
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);

    if (selectedPiece) {
        if (validMoves.some(move => move.row === row && move.col === col)) {
            movePiece(row, col);
        } else {
            clearSelection();
        }
    } else {
        selectPiece(row, col);
    }
};

// Selecciona una pieza y destaca los movimientos válidos
const selectPiece = (row, col) => {
    const piece = getPiece(row, col);
    if (piece && piece.classList.contains(currentPlayer + '-piece')) {
        selectedPiece = piece;
        highlightValidMoves(piece);
    }
};

// Resalta los movimientos válidos de la pieza seleccionada
const highlightValidMoves = (piece) => {
    validMoves = [];
    const row = parseInt(piece.dataset.row);
    const col = parseInt(piece.dataset.col);

    // Para piezas negras (mueven hacia abajo) o blancas (mueven hacia arriba)
    const directions = currentPlayer === 'black' ? [1] : [-1];

    directions.forEach(direction => {
        [-1, 1].forEach(offset => {
            const targetRow = row + direction;
            const targetCol = col + offset;
            if (isValidMove(targetRow, targetCol)) {
                validMoves.push({ row: targetRow, col: targetCol });
                document.querySelector(`[data-row="${targetRow}"][data-col="${targetCol}"]`).classList.add('valid-move');
            }

            // Captura de piezas (saltos)
            const captureRow = row + direction * 2;
            const captureCol = col + offset * 2;
            if (isValidCapture(row, col, captureRow, captureCol)) {
                validMoves.push({ row: captureRow, col: captureCol, capture: { row: row + direction, col: col + offset } });
                document.querySelector(`[data-row="${captureRow}"][data-col="${captureCol}"]`).classList.add('valid-move');
            }
        });
    });
};

// Verifica si una celda está vacía y es válida para un movimiento
const isValidMove = (row, col) => {
    if (row < 0 || row >= SIZE || col < 0 || col >= SIZE) return false;
    const targetCell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    return !targetCell.querySelector('.piece');
};

// Verifica si un salto (captura) es válido
const isValidCapture = (startRow, startCol, targetRow, targetCol) => {
    if (targetRow < 0 || targetRow >= SIZE || targetCol < 0 || targetCol >= SIZE) return false;
    const targetCell = document.querySelector(`[data-row="${targetRow}"][data-col="${targetCol}"]`);
    const midRow = (startRow + targetRow) / 2;
    const midCol = (startCol + targetCol) / 2;
    const middlePiece = getPiece(midRow, midCol);
    if (!middlePiece || middlePiece.classList.contains(currentPlayer + '-piece')) return false;
    return !targetCell.querySelector('.piece');
};

// Obtiene la pieza en una posición específica
const getPiece = (row, col) => {
    return document.querySelector(`[data-row="${row}"][data-col="${col}"] .piece`);
};

// Mueve una pieza a la celda seleccionada
const movePiece = (row, col) => {
    const targetCell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    targetCell.appendChild(selectedPiece);
    selectedPiece.dataset.row = row;
    selectedPiece.dataset.col = col;

    // Lógica de captura de pieza
    if (validMoves[0].capture) {
        const capturedRow = validMoves[0].capture.row;
        const capturedCol = validMoves[0].capture.col;
        const capturedPiece = getPiece(capturedRow, capturedCol);
        if (capturedPiece) {
            capturedPiece.remove();
        }
    }

    // Promoción a Dama
    if (row === 0 && currentPlayer === 'white') {
        selectedPiece.classList.add(PIECE_CLASSES.king);
    } else if (row === SIZE - 1 && currentPlayer === 'black') {
        selectedPiece.classList.add(PIECE_CLASSES.king);
    }

    // Cambia de turno
    currentPlayer = currentPlayer === 'black' ? 'white' : 'black';
    clearSelection();
};

// Limpia la selección actual
const clearSelection = () => {
    selectedPiece = null;
    validMoves.forEach(move => {
        document.querySelector(`[data-row="${move.row}"][data-col="${move.col}"]`).classList.remove('valid-move');
    });
    validMoves = [];
};

// Inicializa el tablero de damas
createBoard();
