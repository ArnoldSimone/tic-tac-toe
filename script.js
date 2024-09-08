let fields = [
    null, null, null,
    null, null, null,
    null, null, null
];

let currentPlayer = 'circle';
let gameActive = true;  // Variable, um das Spiel aktiv zu halten

function init() {
    render();
}

function render() {
    // HTML-Code für die Tabelle
    let html = '<table>';
    for (let i = 0; i < 3; i++) {
        html += '<tr>';
        for (let j = 0; j < 3; j++) {
            const index = i * 3 + j;
            const field = fields[index];
            let symbol = '';
            if (field === 'circle') {
                symbol = generateCircleSVG(); // Darstellung für den Kreis
            } else if (field === 'cross') {
                symbol = generateCrossSVG(); // Darstellung für das Kreuz
            }
            html += `<td id="cell-${index}" onclick="handleClick(${index})">${symbol}</td>`;
        }
        html += '</tr>';
    }
    html += '</table>';
    // Rendern der Tabelle in den Content-Div
    document.getElementById('content').innerHTML = html;
}

function handleClick(index) {
    // Wenn das Spiel aktiv ist und das Feld noch leer ist
    if (fields[index] === null && gameActive) {
        // Setze den aktuellen Spieler ins Feld
        fields[index] = currentPlayer;
        // Finde das <td>-Element mit der entsprechenden ID
        const cell = document.getElementById(`cell-${index}`);
        // Setze das passende SVG-Symbol in das <td>-Element
        if (currentPlayer === 'circle') {
            cell.innerHTML = generateCircleSVG();
        } else if (currentPlayer === 'cross') {
            cell.innerHTML = generateCrossSVG();
        }
        // Entferne den Klick-Handler von dem <td>-Element
        cell.onclick = null;
        // Prüfe, ob jemand gewonnen hat
        if (checkWin()) {
            gameActive = false;  // Beende das Spiel, wenn jemand gewonnen hat
        } else {
            // Wechsle den Spieler für den nächsten Zug
            currentPlayer = currentPlayer === 'circle' ? 'cross' : 'circle';
        }
    }
}

// Funktion zur Überprüfung, ob jemand gewonnen hat
function checkWin() {
    const winningCombinations = [
        [0, 1, 2],  // Zeile 1
        [3, 4, 5],  // Zeile 2
        [6, 7, 8],  // Zeile 3
        [0, 3, 6],  // Spalte 1
        [1, 4, 7],  // Spalte 2
        [2, 5, 8],  // Spalte 3
        [0, 4, 8],  // Diagonale von oben links nach unten rechts
        [2, 4, 6]   // Diagonale von oben rechts nach unten links
    ];

    for (let combo of winningCombinations) {
        const [a, b, c] = combo;
        if (fields[a] && fields[a] === fields[b] && fields[a] === fields[c]) {
            drawWinningLine(a, b, c);  // Zeichne die Linie für die Gewinnkombination
            return true;  // Jemand hat gewonnen
        }
    }
    return false;  // Niemand hat gewonnen
}

// Funktion zum Zeichnen der Linie für die Gewinnkombination
function drawWinningLine(a, b, c) {
    // Berechnung der Positionen der Zellen
    const cellA = document.getElementById(`cell-${a}`);
    const cellB = document.getElementById(`cell-${b}`);
    const cellC = document.getElementById(`cell-${c}`);

    // Position der Zellen ermitteln
    const posA = cellA.getBoundingClientRect();
    const posB = cellB.getBoundingClientRect();
    const posC = cellC.getBoundingClientRect();

    // Mittelpunkte der Zellen berechnen
    const centerX1 = (posA.left + posA.right) / 2;
    const centerY1 = (posA.top + posA.bottom) / 2;

    const centerX2 = (posC.left + posC.right) / 2;
    const centerY2 = (posC.top + posC.bottom) / 2;

    // SVG-Linie erstellen und in den Content einfügen
    const svgLine = `
        <svg style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none;">
            <line x1="${centerX1}" y1="${centerY1}" x2="${centerX2}" y2="${centerY2}" stroke="white" stroke-width="5" />
        </svg>
    `;
    document.body.insertAdjacentHTML('beforeend', svgLine);
}

function generateCircleSVG() {
    return `
        <svg width="70" height="70" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="45" fill="none" stroke="#00B0EF" stroke-width="8" stroke-dasharray="283" stroke-dashoffset="283">
                <animate 
                    attributeName="stroke-dashoffset"
                    from="283"
                    to="0"
                    dur="250ms"
                    fill="freeze"
                />
            </circle>
        </svg>
    `;
}

function generateCrossSVG() {
    return `
        <svg width="70" height="70" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <line x1="20" y1="20" x2="80" y2="80" stroke="#FFC000" stroke-width="10" stroke-linecap="round" 
                stroke-dasharray="84" stroke-dashoffset="84">
                <animate attributeName="stroke-dashoffset" from="84" to="0" dur="250ms" fill="freeze" />
            </line>
            <line x1="80" y1="20" x2="20" y2="80" stroke="#FFC000" stroke-width="10" stroke-linecap="round" 
                stroke-dasharray="84" stroke-dashoffset="84">
                <animate attributeName="stroke-dashoffset" from="84" to="0" dur="250ms" fill="freeze" />
            </line>
        </svg>
    `;
}

// Initialisiere das Spielfeld
init();


function restartGame() {
    fields = [
        null, null, null,
        null, null, null,
        null, null, null
    ];
    gameActive = true;
    const svgs = document.querySelectorAll('svg');
    svgs.forEach(svg => svg.remove());
    render();
}