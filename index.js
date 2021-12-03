// @ts-check
/**
 * Shuffle an array - randomize order of containing elements
 * @param {any[]} array
 */
function shuffleArray(array) {
  for (var i = array.length; i-- > 1; ) {
    var j = Math.floor(Math.random() * i)
    ;[array[i], array[j]] = [array[j], array[i]]
  }
}

/**
 * Min, max inclusive
 * @param {number} length number of items
 */
function randomData(length) {
  const min = 1
  const max = 10
  let data = []
  for (let i = 0; i < length; i++) {
    data.push({
      id: i,
      // Random number between min and max
      value: Math.floor(Math.random() * (max - min)) + min,
    })
  }
  shuffleArray(data)
  return data
}

const svg = d3
  .select("#viz")
  .attr("viewBox", "0 0 100 100")
  .attr("width", 200)
  .attr("height", 200)
  .attr("fill", "currentColor")

let bars = parseInt(d3.select("#bars").attr("value"), 10)
d3.select("#bars_val").text(bars)
let speed = parseInt(d3.select("#speed").attr("value"), 10)
d3.select("#speed_val").text(speed)

let bar_height = 100 / bars
const gap = () => bar_height * 0.1
bar_height = 100 / bars - gap()
let selectedIndex = null

/**
 * @param {Iterable<any> | d3.ValueFn<d3.BaseType, any, any[] | Iterable<any>>} data
 */
const update = (data) => {
  console.log("updating")
  svg
    .selectAll(".bar")
    .data(data, ({ id }) => id)
    .join(
      (enter) =>
        enter
          .append("rect")
          .attr("class", "bar")
          .attr("x", 0)
          .attr("y", (d, i) => i * (bar_height + gap()))
          .attr("height", bar_height)
          .transition()
          .duration(2000)
          .attr("width", ({ value }) => (value / 10) * 100),
      (update) =>
        update
          .transition()
          .duration(speed)
          .attr("height", bar_height)
          // https://tailwindcss.com/docs/customizing-colors#color-palette-reference colors.orange 500
          .style("color", (d, i) => (i == selectedIndex ? "#F97316" : null))
          .attr("width", ({ value }) => (value / 10) * 100)
          .attr("y", (d, i) => i * (bar_height + gap()))
    )
}

let data = randomData(bars)

/**
 * Swap two elements in array
 * @param {Number} from
 * @param {Number} to
 */
const swap = (from, to) => ([data[from], data[to]] = [data[to], data[from]])
/**
 * Use with await to sleep for selected ms
 * @param {Number} ms
 */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

update(data)

d3.select("#bars").on("input change", (event) => {
  bars = event.target.value
  d3.select("#bars_val").text(bars)
  bar_height = 100 / bars - gap()
  data = randomData(bars)
  update(data)
})

d3.select("#speed").on("input change", (event) => {
  speed = event.target.value
  d3.select("#speed_val").text(speed)
})

d3.selectAll(".menubtn").on("click.all", () => {
  d3.select("#summary").text("")
})

/** Randomize again */
d3.select("#randomize").on("click", async function () {
  d3.selectAll(".menubtn").attr("disabled", true)
  data = randomData(bars)
  update(data)
  await sleep(speed)
  d3.selectAll(".menubtn").attr("disabled", null)
})

d3.select("#stop").on("click", () => location.reload())

/** Insertion sort */
d3.select("#insertion").on("click", async function () {
  d3.selectAll(".menubtn").attr("disabled", true)
  let elapsedTime = 0
  let steps = 0

  let length = data.length
  for (let i = 1; i < length; i++) {
    let j = i
    while (j > 0 && data[j].value > data[j - 1].value) {
      selectedIndex = j
      update(data)
      await sleep(speed)

      swap(j, j - 1)
      j -= 1

      selectedIndex = j
      update(data)
      await sleep(speed)
      elapsedTime += speed
      steps += 1
    }
    selectedIndex = null
    update(data)
  }

  d3.select("#summary").text(
    `Sorting took ${steps} steps (${Math.round(elapsedTime)} seconds)`
  )
  d3.selectAll("#randomize, #bars, #speed").attr("disabled", null)
})

/** Pancake sort */
d3.select("#pancake").on("click", async () => {
  d3.selectAll(".menubtn").attr("disabled", true)
  let elapsedTime = 0
  let steps = 0

  const flip = (k) => {
    let left = 0
    while (left < k) {
      swap(left, k)
      k--
      left++
    }
  }

  const max_index = (k) =>
    data.indexOf(data.slice(0, k).reduce((a, b) => (a.value > b.value ? a : b)))

  let n = data.length
  while (n > 1) {
    let maxIdx = max_index(n)
    if (maxIdx != n) {
      flip(maxIdx)
      update(data)
      await sleep(speed)
      elapsedTime += speed
      steps += 1

      flip(n - 1)
      update(data)
      await sleep(speed)
      elapsedTime += speed
      steps += 1
    }
    n--
  }

  d3.select("#summary").text(
    `Sorting took ${steps} steps (${Math.round(elapsedTime)} seconds)`
  )
  d3.selectAll("#randomize, #bars, #speed").attr("disabled", null)
})
