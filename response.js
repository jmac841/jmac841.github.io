const plotLines = (svg, selectedCountry, response, x) => {
  if (response) {
    fetch(responseToData[response])
      .then(response => response.json())
      .then(data => {
        if (data[selectedCountry]) {
          const up = data[selectedCountry].up.map(data => ({ date: d3.timeParse("%Y-%m-%d")(data) }))
          const down = data[selectedCountry].down.map(data => ({ date: d3.timeParse("%Y-%m-%d")(data) }))

          svg.append('g')
            .selectAll()
            .data(up)
            .enter()
            .append("line")
            .attr("x1", (d) => x(d.date))
            .attr("y1", 750)
            .attr("x2", (d) => x(d.date))
            .attr("y2", 0)
            .style("fill", "none")
            .style("stroke", "#048a1a")
            .style("stroke-width", "2")
            .style("stroke-dasharray", ("3, 3"))
            .attr("transform", "translate(" + 100 + "," + 150 + ")")

          svg.append('g')
            .selectAll()
            .data(down)
            .enter()
            .append("line")
            .attr("x1", (d) => x(d.date))
            .attr("y1", 750)
            .attr("x2", (d) => x(d.date))
            .attr("y2", 0)
            .style("fill", "none")
            .style("stroke", "#9e2500")
            .style("stroke-width", "2")
            .style("stroke-dasharray", ("3, 3"))
            .attr("transform", "translate(" + 100 + "," + 150 + ")")
        }

      })
  }

}
