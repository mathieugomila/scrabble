function checkAlignment(squares) {
    const modifiedSquares = document.querySelectorAll('.square.modified');
    let rows = new Set();
    let cols = new Set();

    for (let i = 0; i < modifiedSquares.length; i++) {
        const index = Array.from(squares).indexOf(modifiedSquares[i]);
        const row = Math.floor(index / 15);
        const col = index % 15;

        rows.add(row);
        cols.add(col);
    }

    if (rows.size === 1 && cols.size >= 1) {
        return { "is_aligned": true, type: "row" };
    }
    if (cols.size === 1 && rows.size >= 1) {
        return { "is_aligned": true, type: "col" };
    }
    return { "is_aligned": false, type: "" };
}

function checkNoEmptyBetween(squares) {
    const modifiedSquares = document.querySelectorAll('.square.modified');
    let minRow = 15, maxRow = -1, minCol = 15, maxCol = -1;

    for (let i = 0; i < modifiedSquares.length; i++) {
        const index = Array.from(squares).indexOf(modifiedSquares[i]);
        const row = Math.floor(index / 15);
        const col = index % 15;

        minRow = Math.min(minRow, row);
        maxRow = Math.max(maxRow, row);
        minCol = Math.min(minCol, col);
        maxCol = Math.max(maxCol, col);
    }

    if (maxRow - minRow > 0 && maxCol - minCol > 0) {
        return false; // Diagonal, invalide
    }

    for (let row = minRow; row <= maxRow; row++) {
        for (let col = minCol; col <= maxCol; col++) {
            const index = row * 15 + col;
            const square = squares[index];
            if (!square.classList.contains('modified') || !square.classList.contains('non-editable')) {
                return false; // Case vide trouvée
            }
        }
    }

    return true;
}

function checkWorldNextToOther(squares) {
    // We must search that at least one letter is next to one that is non modified
    const modifiedSquares = document.querySelectorAll('.square.modified');
    let rows = new Set();
    let cols = new Set();

    for (let i = 0; i < modifiedSquares.length; i++) {
        const index = Array.from(squares).indexOf(modifiedSquares[i]);
        const row = Math.floor(index / 15);
        const col = index % 15;

        rows.add(row);
        cols.add(col);
    }

    const allSquares = document.querySelectorAll('.square');
    if (rows.size === 1 && cols.size >= 1) {
        let min_index = Math.min(...cols);
        let max_index = Math.max(...cols);
        if (min_index > 0 && allSquares[Array.from(rows)[0] * 15 + min_index - 1].classList.contains('non-editable')) {
            return true;
        }
        if (max_index < 14 && allSquares[Array.from(rows)[0] * 15 + max_index + 1].classList.contains('non-editable')) {
            return true;
        }
        for (let i = min_index; i <= max_index; i++) {
            if (allSquares[Array.from(rows)[0] * 15 + i].classList.contains('non-editable')) {
                return true;
            }

            if (Array.from(rows)[0] > 0 && allSquares[(Array.from(rows)[0] - 1) * 15 + i].classList.contains('non-editable')) {
                return true;
            }

            if (Array.from(rows)[0] < 14 && allSquares[(Array.from(rows)[0] + 1) * 15 + i].classList.contains('non-editable')) {
                return true;
            }
        }
    }
    else if (cols.size === 1 && rows.size >= 1) {
        let min_index = Math.min(...rows);
        let max_index = Math.max(...rows);
        if (min_index > 0 && allSquares[(min_index - 1) * 15 + Array.from(cols)[0]].classList.contains('non-editable')) {
            return true;
        }
        if (max_index < 14 && allSquares[(max_index + 1) * 15 + Array.from(cols)[0]].classList.contains('non-editable')) {
            return true;
        }
        for (let i = min_index; i <= max_index; i++) {
            if (allSquares[i * 15 + Array.from(cols)[0]].classList.contains('non-editable')) {
                return true;
            }

            if (Array.from(cols)[0] > 0 && allSquares[i * 15 + (Array.from(cols)[0] - 1)].classList.contains('non-editable')) {
                return true;
            }

            if (Array.from(cols)[0] < 14 && allSquares[i * 15 + (Array.from(cols)[0] + 1)].classList.contains('non-editable')) {
                return true;
            }
        }
    }
    return false;
}
