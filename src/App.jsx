import React, { useState } from "react";
import axios from "axios";

const App = () => {
    // State for game board and turn
    const [board, setBoard] = useState(Array(9).fill(null));
    const [isXNext, setIsXNext] = useState(true);
    const [winner, setWinner] = useState(null);

    // Handle click event
    const handleClick = async (index) => {
        if (board[index] || winner) return;

        const newBoard = [...board];
        newBoard[index] = isXNext ? "X" : "O";
        setBoard(newBoard);
        setIsXNext(!isXNext);

        console.log("Sending board to backend:", newBoard); // Debug statement

        try {
            const response = await axios.post("http://localhost:5000/check-winner", {
                board: newBoard,
            });

            console.log("Backend response:", response.data); // Debug response

            if (response.data.winner) {
                setWinner(response.data.winner);
            } else if (!newBoard.includes(null)) {
                setWinner("Draw");
            }
        } catch (error) {
            console.error("Error checking winner:", error);
        }
    };

    // Restart game
    const restartGame = () => {
        setBoard(Array(9).fill(null));
        setIsXNext(true);
        setWinner(null);
    };

    // Render square
    const renderSquare = (index) => (
        <button
            className="square"
            onClick={() => handleClick(index)}
            style={{
                width: "100px",
                height: "100px",
                fontSize: "24px",
                fontWeight: "bold",
            }}
        >
            {board[index]}
        </button>
    );

    return (
        <div style={{ textAlign: "center", margin: "50px auto" }}>
            <h1>Tic Tac Toe</h1>
            <div style={{ margin: "20px" }}>
                {winner ? (
                    <h2>Winner: {winner}</h2>
                ) : (
                    <h2>Next Turn: {isXNext ? "X" : "O"}</h2>
                )}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(3, 100px)",
                        gap: "5px",
                        margin: "20px auto",
                    }}
                >
                    {board.map((_, index) => renderSquare(index))}
                </div>
                <button onClick={restartGame} style={{ padding: "10px 20px" }}>
                    Restart
                </button>
            </div>
        </div>
    );
};

export default App;