const LOG_3 = Math.log(3)

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

// http://pub.ist.ac.at/~edels/Papers/2002-J-01-FastBoxIntersection.pdf
function solveCompleteCase(A) {
  hybrid(A, A, -Number.MAX_VALUE, Number.MAX_VALUE, 2)
}

function solveBipartileCase(A, B) {
  hybrid(A, B, -Number.MAX_VALUE, Number.MAX_VALUE, 2)
  hybrid(B, A, -Number.MAX_VALUE, Number.MAX_VALUE, 2)
}

function hybrid(I, P, lo, hi, d) {
  if (I.length < 1 || P.length < 1 || hi <= lo) {
    return
  }

  if (d === 0) {
    oneWayScan(I, P, 0)
  }

  // c が未定義。
  if (I.length < c || P.length < c) {
    modifiedTwoWayScan(I, P, d)
  }

  var Im = []
  var In = [] // In = I - Im
  for (var i = 0; i < I.length; ++i) {
    (I[i] >= lo) && (I[i] < hi) ? Im.push(I[i]) : In.push(I[i])
  }
  hybrid(Im, P, -Number.MAX_VALUE, Number.MAX_VALUE, d - 1)
  hybrid(P, Im, -Number.MAX_VALUE, Number.MAX_VALUE, d - 1)

  var mi = approxMedian(P, level(P.length))

  var Pl = []
  var Pr = []
  for (var i = 0; i < P.length; ++i) {
    (P[i] < mi) ? Pl.push(P[i]) : Pr.push(P[i])
  }
  var Il = []
  var Ir = []
  for (var i = 0; i < In.length; ++i) {
    if ((In[i] >= lo) && (In[i] < mi)) Il.push(In[i])
    if ((In[i] >= mi) && (In[i] < hi)) Ir.push(In[i])
  }
  hybrid(Il, Pl, lo, mi, d)
  hybrid(Ir, Pr, mi, hi, d)
}

function oneWayScan(I, P, d) {

}

function modifiedTwoWayScan(I, P, d) {

}

function approxMedian(P, h) {
  if (h === 0) {
    return P[Math.floor(P.length * Math.random())]
  }
  return medianOf3(
    approxMedian(P, h - 1),
    approxMedian(P, h - 1),
    approxMedian(P, h - 1)
  )
}

function medianOf3(a, b, c) {
  return (a + b + c) / 3
}

// 論文の実装では経験的に決めた値を使ったらしい。
function level(n) {
  return n < 3 ? 0 : Math.floor(Math.log(n) / LOG_3)
}
