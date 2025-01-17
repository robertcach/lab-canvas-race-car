const OBSTACLE_FRAMES =  120

class Game {
    constructor(ctx) {
        this.ctx = ctx;
  
        
        this.car = new Car(ctx, 225, 550);
        this.background = new Background(ctx);
        this.obstacles = []

        this.intervalId = undefined
        this.fps = 1000 / 60

        this.obstacleFramesCount = 0

        this.score = 0
    }

    start() {
      if (!this.intervalId) {
        this.intervalId = setInterval(() => {

          if (this.obstacleFramesCount % OBSTACLE_FRAMES === 0) {
            this.addObstacle()

            this.obstacleFramesCount = 0
          }

          this.clear()

          this.move()

          this.draw()

          this.checkCollissions()
          this.obstacleFramesCount++
      
          }, this.fps)
        }
    }

    clear() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)

        const previousObstaclesLength = this.obstacles.length

        this.obstacles = this.obstacles.filter(obstacle => obstacle.y - obstacle.height < 700)

        if (this.obstacles.length < previousObstaclesLength) {
          this.score++
        }
      }
    
      draw() {
        this.background.draw();
        this.obstacles.forEach(obstacle => obstacle.draw())
        this.car.draw()

        this.drawScore()
      }

      drawScore() {
        this.ctx.save()
    
        this.ctx.fillStyle = 'white'
        this.ctx.font = ' bold 24px sans-serif'
    
        this.ctx.fillText(`Score: ${this.score} ptos`, 75, 40)
    
        this.ctx.restore()
      }

      move() {
        this.obstacles.forEach(obstacle => obstacle.move()) 
        this.car.move()
        this.background.move()   
      }

      addObstacle() {
        const max = this.ctx.canvas.width - 150
        const x = Math.floor(Math.random() * max)

        this.obstacles.push(new Obstacle(this.ctx, x, 0))
      }

      setupListeners(event) {
        this.car.setupListeners(event)
      }

      checkCollissions() {
        const condition = this.obstacles.some(obstacle => this.car.collidesWith(obstacle))
    
        if (condition) {
          this.gameOver()
        }
      }

      gameOver() {
        clearInterval(this.intervalId)
    
        this.ctx.save()
        
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
    
        this.ctx.fillStyle = 'white'
        this.ctx.textAlign = 'center'
        this.ctx.font = 'bold 25px sans-serif'
        this.ctx.fillText(`Game Over! Your final score: ${this.score}`, this.ctx.canvas.width / 2, this.ctx.canvas.height / 2)
    
        this.ctx.restore()
      }
}