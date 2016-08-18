class Box {
  constructor(point, width, height, index) {
    this.p1 = point
    this.p2 = new Vec2(point.x + width, point.y + height)
    this.width = width
    this.height = height

    this.index = index
    this.fill = "#444444"
    this.stroke = U.randomColorCode()
  }

  draw(canvas) {
    canvas.context.strokeStyle = this.stroke
    canvas.context.strokeRect(this.p1.x, this.p1.y, this.width, this.height)

    canvas.context.fillStyle = this.fill
    canvas.context.fillText(this.index, this.p1.x, this.p1.y)
  }
}

var canvas = new Canvas(512, 512)
var boxes = makeBoxes()

findIntersectionBruteForce(boxes)

animate()

function animate() {
  draw()
  // requestAnimationFrame(animate)
}

function draw() {
  for (var i = 0; i < boxes.length; ++i) {
    boxes[i].draw(canvas)
  }
}

function makeBoxes() {
  var numBoxes = 16
  var maxWidth = 64
  var maxHeight = 64

  var boxes = new Array(numBoxes)
  for (var i = 0; i < boxes.length; ++i) {
    boxes[i] = new Box(
      new Vec2(Math.random() * canvas.width, Math.random() * canvas.height),
      Math.random() * maxWidth,
      Math.random() * maxHeight,
      i
    )
  }
  return boxes
}

function findIntersectionBruteForce(boxes) {
  var pair = []
  for (i = 0; i < boxes.length; ++i) {
    for (j = i + 1; j < boxes.length; ++j) {
      if (isIntersectBoxBox(boxes[i], boxes[j])) {
        pair.push([i, j])
      }
    }
  }
  console.log(pair)
  return pair
}

function isIntersectBoxBox(a, b) {
  if (isOverlap(a.p1.x, a.p2.x, b.p1.x, b.p2.x) !== null
    && isOverlap(a.p1.y, a.p2.y, b.p1.y, b.p2.y) !== null) {
    return true
  }
  return false
}

// 同じ直線の上にある線分abと線分cdの重なりを計算。
function isOverlap(a, b, c, d) {
  if ((b - c) >= 0 && (d - a) >= 0) {
    return Math.abs(Math.min(b, d) - Math.max(a, c))
  }
  return null
}
