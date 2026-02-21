const boardElement = document.getElementById('board');
const statusText = document.getElementById('status');
let board = [];
let selected = null;
let turn = 1; // 1: Oq (Siz), 2: Qizil (AI)

// 1. O'yinni boshlash
function init() {
    for (let r = 0; r < 8; r++) {
        board[r] = [];
        for (let c = 0; c < 8; c++) {
            if ((r + c) % 2 !== 0) {
                if (r < 3) board[r][c] = { p: 2, k: false };
                else if (r > 4) board[r][c] = { p: 1, k: false };
                else board[r][c] = null;
            } else board[r][c] = null;
        }
    }
    render();
}

// 2. Taxtani chizish va bosishni eshitish
function render() {
    boardElement.innerHTML = '';
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const cell = document.createElement('div');
            cell.className = `cell ${(r + c) % 2 === 0 ? 'white' : 'black'}`;
            cell.onclick = () => handleCellClick(r, c);
            
            if (board[r][c]) {
                const p = document.createElement('div');
                p.className = `piece p${board[r][c].p} ${board[r][c].k ? 'king' : ''}`;
                if (selected && selected.r === r && selected.c === c) p.classList.add('selected');
                cell.appendChild(p);
            }
            boardElement.appendChild(cell);
        }
    }
}

// 3. Bosish mantig'i
function handleCellClick(r, c) {
    if (turn !== 1) return; // AI navbati bo'lsa bosib bo'lmaydi

    if (board[r][c] && board[r][c].p === 1) {
        selected = { r, c };
    } else if (selected) {
        movePiece(selected.r, selected.c, r, c);
    }
    render();
}

function movePiece(fr, fc, tr, tc) {
    // Eng sodda yurish mantig'i: 1 qadam diagonal
    if (Math.abs(fr - tr) === 1 && Math.abs(fc - tc) === 1 && !board[tr][tc]) {
        board[tr][tc] = board[fr][fc];
        board[fr][fc] = null;
        
        // Damka bo'lish
        if (tr === 0) board[tr][tc].k = true;
        
        selected = null;
        turn = 2;
        statusText.innerText = "AI o'ylamoqda...";
        setTimeout(aiMove, 1000);
    }
    // Urish mantig'i (2 qadam sakrash)
    else if (Math.abs(fr - tr) === 2 && Math.abs(fc - tc) === 2 && !board[tr][tc]) {
        let mr = (fr + tr) / 2;
        let mc = (fc + tc) / 2;
        if (board[mr][mc] && board[mr][mc].p === 2) {
            board[tr][tc] = board[fr][fc];
            board[fr][fc] = null;
            board[mr][mc] = null; // Raqib toshini olib tashlash
            
            if (tr === 0) board[tr][tc].k = true;
            
            selected = null;
            turn = 2;
            statusText.innerText = "AI o'ylamoqda...";
            setTimeout(aiMove, 1000);
        }
    }
}

// 4. Sodda AI
function aiMove() {
    let moved = false;
    for (let r = 0; r < 8 && !moved; r++) {
        for (let c = 0; c < 8 && !moved; c++) {
            if (board[r][c] && board[r][c].p === 2) {
                // AI diagonal pastga yurishga harakat qiladi
                let moves = [[1, 1], [1, -1]];
                for (let [dr, dc] of moves) {
                    let nr = r + dr, nc = c + dc;
                    if (nr < 8 && nc >= 0 && nc < 8 && !board[nr][nc]) {
                        board[nr][nc] = board[r][c];
                        board[r][c] = null;
                        moved = true;
                        break;
                    }
                }
            }
        }
    }
    turn = 1;
    statusText.innerText = "Sizning navbatingiz (Oqlar)";
    render();
}

init();
