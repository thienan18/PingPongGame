const INITIAL_VELOCITY = 0.025 //vận tốc của ball
const VELOCITY_INCREASE = 0.00001 //mức tăng vận tốc theo thời gian

export default class Ball {
  //Hàm tạo
  constructor(ballElem) {
    this.ballElem = ballElem
    this.reset()
  }

  get x() {
    return parseFloat(getComputedStyle(this.ballElem).getPropertyValue("--x"))
    //lấy giá trị từ file css là 50
  }

  set x(value) {
    this.ballElem.style.setProperty("--x", value)
  }

  get y() {
    return parseFloat(getComputedStyle(this.ballElem).getPropertyValue("--y"))
  }

  set y(value) {
    this.ballElem.style.setProperty("--y", value)
  }

  rect() {
    return this.ballElem.getBoundingClientRect()
  }

  reset() {
    this.x = 50
    this.y = 50
    this.direction = { x: 0 } //giá trị mặc định x=0
    while (
      Math.abs(this.direction.x) <= 0.2 || //x<0.2:ball hầu hết di chuyển lên xuống không di chuyển trái-phải
      Math.abs(this.direction.x) >= 0.9   //x>0.9:ball hầu hết di chuyển sang ngang mà không có nhiều lên xuống
    ) {
      const heading = randomNumberBetween(0, 2 * Math.PI) //tạo một giá trị ngẫu nhiên từ 0-2pi
      this.direction = { x: Math.cos(heading), y: Math.sin(heading) }
    }
    this.velocity = INITIAL_VELOCITY //xác định vận tốc
  }

  update(delta, paddleRects) {
    this.x += this.direction.x * this.velocity * delta
    this.y += this.direction.y * this.velocity * delta
    this.velocity += VELOCITY_INCREASE * delta
    const rect = this.rect()
    //Kiểm tra xem quả bóng có chạm vào cạnh dưới hoặc cạnh trên của màn hình hay không
    if (rect.bottom >= window.innerHeight || rect.top <= 0) {
      this.direction.y *= -1
    }
    //Kiểm tra xem quả bóng có chạm vào một trong hai vợt đánh bóng hay không
    if (paddleRects.some(r => isCollision(r, rect))) {
      this.direction.x *= -1
    }
  }
}

//trả về một số thực ngẫu nhiên trong khoảng từ min đến max
function randomNumberBetween(min, max) {
  return Math.random() * (max - min) + min
}

//kiểm tra xem hai đối tượng về kích thước và vị trí trên màn hình có giao nhau hay không
function isCollision(rect1, rect2) {
  return (
    rect1.left <= rect2.right &&
    rect1.right >= rect2.left &&
    rect1.top <= rect2.bottom &&
    rect1.bottom >= rect2.top
  )
}
