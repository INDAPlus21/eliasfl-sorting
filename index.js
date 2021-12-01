// @ts-check

// const data = [
//   { index: 0, value: 4 },
//   { index: 1, value: 10 },
//   { index: 2, value: 3 },
//   { index: 3, value: 1 },
//   { index: 4, value: 9 },
//   { index: 5, value: 5 },
// ]

let data = []
for (let i = 0; i < 10; i++) {
  data.push({
    index: i,
    // Random number between 1 and 10
    value: Math.floor(Math.random() * 9) + 1,
  })
}

const svg = d3
  .select(".viz")
  .append("svg")
  .attr("viewBox", "0 0 100 100")
  .attr("width", window.innerWidth)
  .attr("height", window.innerHeight)
  .attr("style", "width: 100%;")
  .attr("fill", "currentColor")

const bar_height = 8
const margin = 4

const render = (
  /** @type {Iterable<any> | d3.ValueFn<SVGSVGElement, any, any[] | Iterable<any>>} */
  input_data
) => {
  const bars = svg.selectAll(".group").data(input_data, ({ index }) => index)
  bars
    .enter()
    .append("rect")
    .attr("class", "group")
    .attr("x", 0)
    .attr("y", ({ index }) => index * (bar_height + margin))
    .attr("height", bar_height)
    .transition()
    .duration(2000)
    .attr("width", ({ value }) => (value / 10) * 100)
}
render(data)

document.getElementsByClassName("viz")[0].addEventListener("click", () => {
  console.log("Rerendering")
  let data = []
  for (let i = 0; i < 10; i++) {
    data.push({
      index: i,
      // Random number between 1 and 10
      value: Math.floor(Math.random() * 9) + 1,
    })
  }
  render(data)
})
