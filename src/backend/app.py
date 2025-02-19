from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS to allow requests from React frontend


@app.route("/check-winner", methods=["POST"])
def check_winner():
    data = request.get_json()

    # Ensure data contains the board
    if "board" not in data or not data["board"]:
        return jsonify({"error": "Invalid board received"}), 400

    board = data["board"]  # The board, should be like ['X', 'O', null, ...]

    # Check if the board size is correct
    if len(board) != 9:
        return jsonify({"error": "Invalid board size"}), 400

    # Winning combinations
    winning_combinations = [
        [0, 1, 2],  # Top row
        [3, 4, 5],  # Middle row
        [6, 7, 8],  # Bottom row
        [0, 3, 6],  # Left column
        [1, 4, 7],  # Center column
        [2, 5, 8],  # Right column
        [0, 4, 8],  # Diagonal from top-left
        [2, 4, 6],  # Diagonal from top-right
    ]

    def check_line(a, b, c):
        """Helper function to check if a line contains the same symbol."""
        return board[a] == board[b] == board[c] and board[a] is not None

    # Check all winning combinations
    for combination in winning_combinations:
        if check_line(*combination):
            return jsonify({"winner": board[combination[0]]})  # Return the winner (X or O)

    # If no winner and board is full, declare a draw
    if all(cell is not None for cell in board):
        return jsonify({"winner": "Draw"})

    # No winner yet
    return jsonify({"winner": None})


if __name__ == "__main__":
    app.run(debug=True)
