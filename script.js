class Snake {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.gridSize = 20;
        this.snake = [{x: 5, y: 5}];
        this.food = this.generateFood();
        this.direction = 'right';
        this.score = 0;
        this.gameOver = false;
        this.headImage = null;
        this.bodyImage = null;
        this.speed = 150;
        
        // Initialisation des contrôles
        this.setupControls();
    }

    setupControls() {
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowUp':
                    if (this.direction !== 'down') this.direction = 'up';
                    break;
                case 'ArrowDown':
                    if (this.direction !== 'up') this.direction = 'down';
                    break;
                case 'ArrowLeft':
                    if (this.direction !== 'right') this.direction = 'left';
                    break;
                case 'ArrowRight':
                    if (this.direction !== 'left') this.direction = 'right';
                    break;
            }
        });
    }

    generateFood() {
        const maxX = this.canvas.width / this.gridSize - 1;
        const maxY = this.canvas.height / this.gridSize - 1;
        return {
            x: Math.floor(Math.random() * maxX),
            y: Math.floor(Math.random() * maxY)
        };
    }

    update() {
        if (this.gameOver) return;

        // Création de la nouvelle tête
        const head = {...this.snake[0]};
        switch(this.direction) {
            case 'up': head.y--; break;
            case 'down': head.y++; break;
            case 'left': head.x--; break;
            case 'right': head.x++; break;
        }

        // Vérification des collisions
        if (this.checkCollision(head)) {
            this.gameOver = true;
            return;
        }

        // Ajout de la nouvelle tête
        this.snake.unshift(head);

        // Vérification si le serpent mange la nourriture
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            document.getElementById('scoreValue').textContent = this.score;
            this.food = this.generateFood();
            // Augmentation de la vitesse
            this.speed = Math.max(50, this.speed - 2);
        } else {
            this.snake.pop();
        }
    }

    checkCollision(head) {
        // Collision avec les murs
        if (head.x < 0 || head.x >= this.canvas.width / this.gridSize ||
            head.y < 0 || head.y >= this.canvas.height / this.gridSize) {
            return true;
        }

        // Collision avec le serpent lui-même
        return this.snake.some(segment => segment.x === head.x && segment.y === head.y);
    }

    draw() {
        // Nettoyage du canvas
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Dessin de la nourriture
        this.ctx.fillStyle = 'red';
        this.ctx.fillRect(
            this.food.x * this.gridSize,
            this.food.y * this.gridSize,
            this.gridSize - 2,
            this.gridSize - 2
        );

        // Dessin du serpent
        this.snake.forEach((segment, index) => {
            if (index === 0 && this.headImage) {
                // Dessin de la tête avec l'image
                this.ctx.drawImage(
                    this.headImage,
                    segment.x * this.gridSize,
                    segment.y * this.gridSize,
                    this.gridSize,
                    this.gridSize
                );
            } else if (this.bodyImage) {
                // Dessin du corps avec l'image
                this.ctx.drawImage(
                    this.bodyImage,
                    segment.x * this.gridSize,
                    segment.y * this.gridSize,
                    this.gridSize,
                    this.gridSize
                );
            } else {
                // Dessin par défaut si pas d'image
                this.ctx.fillStyle = index === 0 ? '#00ff00' : '#008000';
                this.ctx.fillRect(
                    segment.x * this.gridSize,
                    segment.y * this.gridSize,
                    this.gridSize - 2,
                    this.gridSize - 2
                );
            }
        });

        // Affichage du game over
        if (this.gameOver) {
            this.ctx.fillStyle = 'white';
            this.ctx.font = '48px Arial';
            this.ctx.fillText('Game Over!', 
                this.canvas.width / 2 - 100,
                this.canvas.height / 2
            );
        }
    }
}

// Initialisation du jeu
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    canvas.width = 600;
    canvas.height = 400;
    
    const game = new Snake(canvas);
    let gameLoop;

    // Gestion des images uploadées
    document.getElementById('headImage').addEventListener('change', (e) => {
        const file = e.target.files[0];
        const img = new Image();
        img.onload = () => game.headImage = img;
        img.src = URL.createObjectURL(file);
    });

    document.getElementById('bodyImage').addEventListener('change', (e) => {
        const file = e.target.files[0];
        const img = new Image();
        img.onload = () => game.bodyImage = img;
        img.src = URL.createObjectURL(file);
    });

    // Démarrage du jeu
    document.getElementById('startGame').addEventListener('click', () => {
        if (gameLoop) {
            clearInterval(gameLoop);
        }
        game.snake = [{x: 5, y: 5}];
        game.direction = 'right';
        game.score = 0;
        game.gameOver = false;
        game.speed = 150;
        document.getElementById('scoreValue').textContent = '0';
        
        gameLoop = setInterval(() => {
            game.update();
            game.draw();
        }, game.speed);
    });
});
