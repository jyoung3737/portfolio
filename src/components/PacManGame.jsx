import { useEffect, useRef, useState } from "react";

const TILE = 24;
const COLS = 15;
const ROWS = 15;
const WIDTH = TILE * COLS;
const HEIGHT = TILE * ROWS;
const DIRECTIONS = {
  ArrowUp: { dx: 0, dy: -1, angle: -Math.PI / 2, label: "Up" },
  ArrowDown: { dx: 0, dy: 1, angle: Math.PI / 2, label: "Down" },
  ArrowLeft: { dx: -1, dy: 0, angle: Math.PI, label: "Left" },
  ArrowRight: { dx: 1, dy: 0, angle: 0, label: "Right" },
};
const VECTORS = {
  Up: { dx: 0, dy: -1 },
  Down: { dx: 0, dy: 1 },
  Left: { dx: -1, dy: 0 },
  Right: { dx: 1, dy: 0 },
};
const REVERSE = { Up: "Down", Down: "Up", Left: "Right", Right: "Left" };

const INITIAL_MAP = [
  "111111111111111",
  "122222222222221",
  "121111211121121",
  "123222222222321",
  "121111211121121",
  "122222211222221",
  "111112011211111",
  "122222000222221",
  "121111211121121",
  "123222222222321",
  "121111211121121",
  "122222222222221",
  "121111111111121",
  "122222222222221",
  "111111111111111",
];

const createBoard = () => INITIAL_MAP.map((row) => row.split("").map(Number));
const countDots = (board) => board.flat().filter((value) => value === 2 || value === 3).length;
const canMove = (board, x, y, direction) => {
  const vector = VECTORS[direction];
  if (!vector) return false;
  const nx = x + vector.dx;
  const ny = y + vector.dy;
  return ny >= 0 && ny < ROWS && nx >= 0 && nx < COLS && board[ny][nx] !== 1;
};

export default function PacManGame() {
  const canvasRef = useRef(null);
  const gameRef = useRef(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [status, setStatus] = useState("Playing");
  const [hint, setHint] = useState("Use arrow keys to move Pac-Man.");

  const resetGameState = () => {
    const board = createBoard();
    return {
      board,
      dotsRemaining: countDots(board),
      pacman: { x: 7, y: 11, dir: "Left", nextDir: "Left" },
      ghosts: [
        { x: 7, y: 7, dir: "Left", color: "#ff4c4c" },
        { x: 6, y: 7, dir: "Right", color: "#32d6ff" },
        { x: 8, y: 7, dir: "Up", color: "#ffb347" },
      ],
      score: 0,
      lives: 3,
      status: "Playing",
    };
  };

  const updateStatus = (newStatus) => {
    if (!gameRef.current) return;
    gameRef.current.status = newStatus;
    setStatus(newStatus);
  };

  const updateLives = (value) => {
    if (!gameRef.current) return;
    gameRef.current.lives = value;
    setLives(value);
  };

  const updateScore = (value) => {
    if (!gameRef.current) return;
    gameRef.current.score = value;
    setScore(value);
  };

  const restartGame = () => {
    const initial = resetGameState();
    gameRef.current = initial;
    setScore(initial.score);
    setLives(initial.lives);
    setStatus(initial.status);
    setHint("Use arrow keys to move Pac-Man.");
  };

  useEffect(() => {
    gameRef.current = resetGameState();
    setScore(gameRef.current.score);
    setLives(gameRef.current.lives);
    setStatus(gameRef.current.status);

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return undefined;

    const drawBoard = () => {
      ctx.fillStyle = "#050505";
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      gameRef.current.board.forEach((row, y) => {
        row.forEach((value, x) => {
          const centerX = x * TILE + TILE / 2;
          const centerY = y * TILE + TILE / 2;
          if (value === 1) {
            ctx.fillStyle = "#0033aa";
            ctx.fillRect(x * TILE + 2, y * TILE + 2, TILE - 4, TILE - 4);
          } else if (value === 2) {
            ctx.fillStyle = "#ffe75f";
            ctx.beginPath();
            ctx.arc(centerX, centerY, 3, 0, Math.PI * 2);
            ctx.fill();
          } else if (value === 3) {
            ctx.fillStyle = "#ffe75f";
            ctx.beginPath();
            ctx.arc(centerX, centerY, 6, 0, Math.PI * 2);
            ctx.fill();
          }
        });
      });
    };

    const drawPacman = () => {
      const { pacman } = gameRef.current;
      const centerX = pacman.x * TILE + TILE / 2;
      const centerY = pacman.y * TILE + TILE / 2;
      const direction = DIRECTIONS[`Arrow${pacman.dir}`] || DIRECTIONS.ArrowRight;
      const mouthAngle = Math.PI / 5;

      ctx.fillStyle = "#ffe75f";
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(
        centerX,
        centerY,
        TILE / 2 - 2,
        direction.angle + mouthAngle,
        direction.angle - mouthAngle,
        false
      );
      ctx.closePath();
      ctx.fill();
    };

    const drawGhosts = () => {
      gameRef.current.ghosts.forEach((ghost) => {
        const centerX = ghost.x * TILE + TILE / 2;
        const centerY = ghost.y * TILE + TILE / 2;
        ctx.fillStyle = ghost.color;
        ctx.beginPath();
        ctx.arc(centerX, centerY, TILE / 2 - 2, Math.PI, 0);
        ctx.lineTo(centerX + TILE / 2 - 2, centerY + TILE / 2);
        ctx.lineTo(centerX - TILE / 2 + 2, centerY + TILE / 2);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(centerX - 6, centerY - 4, 4, 0, Math.PI * 2);
        ctx.arc(centerX + 6, centerY - 4, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#000000";
        ctx.beginPath();
        ctx.arc(centerX - 6, centerY - 4, 2, 0, Math.PI * 2);
        ctx.arc(centerX + 6, centerY - 4, 2, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    const drawUi = () => {
      ctx.fillStyle = "#ffffff";
      ctx.font = "14px system-ui, sans-serif";
      ctx.fillText(`Score: ${gameRef.current.score}`, 10, 18);
      ctx.fillText(`Lives: ${gameRef.current.lives}`, WIDTH - 80, 18);
      if (gameRef.current.status !== "Playing") {
        ctx.fillStyle = "rgba(0, 0, 0, 0.72)";
        ctx.fillRect(0, HEIGHT / 2 - 30, WIDTH, 60);
        ctx.fillStyle = "#ffffff";
        ctx.font = "20px system-ui, sans-serif";
        ctx.fillText(gameRef.current.status, WIDTH / 2 - 50, HEIGHT / 2 + 8);
      }
    };

    const draw = () => {
      drawBoard();
      drawPacman();
      drawGhosts();
      drawUi();
    };

    const eatDot = () => {
      const { pacman, board } = gameRef.current;
      const current = board[pacman.y][pacman.x];
      if (current === 2 || current === 3) {
        board[pacman.y][pacman.x] = 0;
        gameRef.current.dotsRemaining -= 1;
        updateScore(gameRef.current.score + (current === 3 ? 50 : 10));
        if (gameRef.current.dotsRemaining === 0) {
          updateStatus("You Win!");
          setHint("Nice work! Restart to play again.");
        }
      }
    };

    const collideGhost = () => {
      const { pacman, ghosts } = gameRef.current;
      return ghosts.some((ghost) => ghost.x === pacman.x && ghost.y === pacman.y);
    };

    const resetPositions = () => {
      const state = gameRef.current;
      state.pacman = { x: 7, y: 11, dir: "Left", nextDir: "Left" };
      state.ghosts = [
        { x: 7, y: 7, dir: "Left", color: "#ff4c4c" },
        { x: 6, y: 7, dir: "Right", color: "#32d6ff" },
        { x: 8, y: 7, dir: "Up", color: "#ffb347" },
      ];
    };

    const loseLife = () => {
      const nextLives = gameRef.current.lives - 1;
      updateLives(nextLives);
      if (nextLives <= 0) {
        updateStatus("Game Over");
        setHint("Press restart to play again.");
      } else {
        setHint("Watch out! You lost a life.");
        resetPositions();
      }
    };

    const chooseGhostDirection = (ghost) => {
      const valid = Object.keys(VECTORS).filter(
        (dir) => canMove(gameRef.current.board, ghost.x, ghost.y, dir) && dir !== REVERSE[ghost.dir]
      );
      if (valid.length === 0) {
        return REVERSE[ghost.dir];
      }
      const use = valid[Math.floor(Math.random() * valid.length)];
      return use;
    };

    const moveEntities = () => {
      const state = gameRef.current;
      const pacman = state.pacman;
      if (canMove(state.board, pacman.x, pacman.y, pacman.nextDir)) {
        pacman.dir = pacman.nextDir;
      }
      if (canMove(state.board, pacman.x, pacman.y, pacman.dir)) {
        const vector = VECTORS[pacman.dir];
        pacman.x += vector.dx;
        pacman.y += vector.dy;
      }
      eatDot();

      state.ghosts.forEach((ghost) => {
        if (!canMove(state.board, ghost.x, ghost.y, ghost.dir) || Math.random() < 0.3) {
          ghost.dir = chooseGhostDirection(ghost);
        }
        if (canMove(state.board, ghost.x, ghost.y, ghost.dir)) {
          const vector = VECTORS[ghost.dir];
          ghost.x += vector.dx;
          ghost.y += vector.dy;
        }
      });
    };

    const step = (time) => {
      const state = gameRef.current;
      if (!state) return;
      if (state.status === "Playing") {
        if (!state.lastTick) {
          state.lastTick = time;
        }
        if (time - state.lastTick > 120) {
          moveEntities();
          if (collideGhost()) {
            loseLife();
          }
          state.lastTick = time;
        }
      }
      draw();
      state.animationId = requestAnimationFrame(step);
    };

    const handleKeydown = (event) => {
      if (gameRef.current.status !== "Playing") return;
      const direction = DIRECTIONS[event.key];
      if (direction) {
        gameRef.current.pacman.nextDir = direction.label;
        setHint(`Moving ${direction.label}.`);
        event.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKeydown);
    gameRef.current.animationId = requestAnimationFrame(step);

    return () => {
      window.removeEventListener("keydown", handleKeydown);
      if (gameRef.current?.animationId) {
        cancelAnimationFrame(gameRef.current.animationId);
      }
    };
  }, []);

  return (
    <div className="rounded-3xl bg-slate-900 border border-slate-700 p-6 shadow-2xl max-w-[740px] mx-auto" style={{ backgroundColor: "#06131f" }}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-5">
        <div>
          <h2 className="text-2xl font-bold text-white">Pac-Man Arcade</h2>
          <p className="text-slate-300 text-sm sm:text-base">Arrow keys to move, collect all the dots, and avoid the ghosts.</p>
        </div>
        <button
          type="button"
          onClick={restartGame}
          className="rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-400 transition"
          style={{ border: "none" }}
        >
          Restart
        </button>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-700" style={{ width: WIDTH, height: HEIGHT, margin: "0 auto" }}>
        <canvas ref={canvasRef} width={WIDTH} height={HEIGHT} style={{ display: "block", background: "#050505" }} />
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-slate-300 text-sm">
        <span>{hint}</span>
        <span>{status === "Playing" ? "Game in progress" : status}</span>
      </div>
    </div>
  );
}
