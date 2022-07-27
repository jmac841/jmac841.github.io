const plotGraph = (selector, data, xFieldName, lineGraph, labeloptions = {}, scaleOptions = {}, legendOptions = {}, toolTipOptions = {}, lineOptions = {}) => {
  let minYval = scaleOptions.minY ?? 0
  let maxYval = scaleOptions.maxY ?? 20000
  let minDate = scaleOptions.minDate ?? '2020-01-01'
  let maxDate = scaleOptions.maxDate ?? '2021-05-01'
  let earliestIdx = scaleOptions.earliestIdx ?? 0
  let furtherestIdx = scaleOptions.furtherestIdx ?? 1

  var legend = d3.select('#legend')
  legend.selectAll('*').remove();

  var svg = d3.select(selector),
    margin = 200,
    width = svg.attr("width") - margin,
    height = svg.attr("height") - margin

  svg.selectAll('*').remove();

  let minMinus = new Date(minDate)
  minMinus.setDate(minMinus.getDate() - 1)

  let maxPlus = new Date(maxDate)
  maxPlus.setDate(maxPlus.getDate() + 1)

  let activeDates
  if (data.length === 1) {
    activeDates = data[earliestIdx].data.filter(d => {
      return d.date >= minMinus && d.date <= maxPlus
    })

  } else {
    activeDates = [...data[earliestIdx].data, ...data[furtherestIdx].data].filter(d => {
      return d.date >= minMinus && d.date <= maxPlus
    })
  }

  const x = d3.scaleTime()
    .domain(d3.extent(activeDates, d => d.date))
    .range([0, width]);

  const y = d3.scaleLinear().domain([minYval, maxYval]).range([height, 0]);

  var g = svg.append("g")
    .attr("transform", "translate(" + 100 + "," + 100 + ")");

  svg.append('text')
    .attr('x', width / 2 + 100)
    .attr('y', 100)
    .attr('text-anchor', 'middle')
    .text(labeloptions.title);

  svg.append('text')
    .attr('x', width / 2 + 100)
    .attr('y', height - 15 + 150)
    .attr('text-anchor', 'middle')
    .text(labeloptions.xLabel);

  svg.append('text')
    .attr('x', 0)
    .attr('y', height - 300)
    .text(labeloptions.yLabel);

  const xAxis = d3.axisBottom(x)
    .ticks(d3.timeMonth, parseTime);

  g.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  g.append("g")
    .call(d3.axisLeft(y));

  if (!lineGraph) {
    let tooltip = d3.select("body")
      .append("div")
      .style("position", "absolute")
      .style("z-index", "10")
      .style("visibility", "hidden")
      .style("background", "#e8e8e8")
      .text("a simple tooltip");

    let mouseOver = () => { }
    let mouseRemove = () => { }
    let mouseLeave = () => { }
    if (toolTipOptions.showToolTip) {
      mouseOver = (event, d) => {
        tooltip.html(`
                    Location: ${d.location}<br/>
                    ${toolTipOptions.valueLabel}: ${Math.round(d[xFieldName])} <br/> 
                    Date: ${new Date(d.date).toISOString().split('T')[0]}`);
        return tooltip.style("visibility", "visible");
      }
      mouseRemove = (event, d) => {
        return tooltip.style("top", (event.pageY - 10) + "px").style("left", (event.pageX + 10) + "px");
      }
      mouseLeave = (event, d) => {
        return tooltip.style("visibility", "hidden")
      }
    }

    Object.keys(data).forEach(key => {
      aggData = data[key]

      svg.append('g')
        .selectAll()
        .data(aggData.data.filter(d => {
          return (d[xFieldName] >= minYval && d[xFieldName] <= maxYval) && (d.date >= new Date(minDate) && d.date <= new Date(maxDate))
        }))
        .enter()
        .append("circle")
        .attr("cx", d => x(d.date))
        .attr("cy", d => y(d[xFieldName]))
        .attr("r", 3)
        .attr("transform", "translate(" + 100 + "," + 100 + ")")
        .style("fill", aggData.color)
        .on("mouseover", mouseOver)
        .on("mousemove", mouseRemove)
        .on("mouseleave", mouseLeave)
    })

    if (lineOptions.show && lineOptions.response) {
      plotLines(svg, selectedCountry, lineOptions.response, x)

      const plot = [
        { color: '#048a1a', label: `${lineOptions.response} Increased` },
        { color: '#9e2500', label: `${lineOptions.response} Decreased` }

      ]

      legend.selectAll()
        .data(plot)
        .enter()
        .append("line")
        .attr("x1", 15)
        .attr("x2", 25)
        .attr("y1", (d, i) => 50 + (i + 3) * 25 )
        .attr("y2", (d, i) => 50 + (i + 3) * 25 )
        .style("fill", "none")
        .style("stroke", d => d.color)
        .style("stroke-width", "2")
        .style("stroke-dasharray", ("3, 3"))

      legend.selectAll()
        .data(plot)
        .enter()
        .append("text")
        .attr("x", 40)
        .attr("y", (d, i) => 50 + (i + 3) * 25 )
        .style("fill", d => d.color)
        .text(d => d.label)
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")
        .style("background-color", "white")
    }
  } else {
    var line = d3.line()
      .x(d => x(d.date))
      .y(d => y(d[xFieldName]))
      .curve(d3.curveMonotoneX)

    svg.append("path")
      .datum(data[0].data)
      .attr("class", "line")
      .attr("transform", "translate(" + 100 + "," + 100 + ")")
      .attr("d", line)
      .style("fill", "none")
      .style("stroke", "black")
      .style("stroke-width", "2");
  }

  legend.selectAll()
    .data(Object.keys(legendOptions))
    .enter()
    .append("circle")
    .attr("cx", 20)
    .attr("cy", (d, i) => 50 + i * 25 )
    .attr("r", 7)
    .style("fill", d => legendOptions[d])

  legend.selectAll()
    .data(Object.keys(legendOptions))
    .enter()
    .append("text")
    .attr("x", 40)
    .attr("y", (d, i) => 50 + i * 25 )
    .style("fill", d => legendOptions[d])
    .text(d => d)
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle")
}
