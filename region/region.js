d3.json("../finalData/fullData.json").then(data => {
  let maxNewCases = 0
  let maxNewDeaths = 0
  let earliestDate = new Date('9999-12-31')
  let latestDate = new Date('0000-01-01')
  let earliestIdx
  let furtherestIdx

  let input = []
  Object.keys(data).forEach(locationName => {
    if (regionList.has(locationName)) {
      input.push({
        data: data[locationName].map(element => {
          const elementDate = new Date(element.date)
          if (elementDate < earliestDate) {
            earliestDate = elementDate
            earliestIdx = input.length
          }
          if (elementDate > latestDate) {
            latestDate = elementDate
            furtherestIdx = input.length
          }
          if (parseInt(element.dailyNewCases) > maxNewCases) {
            maxNewCases = parseInt(element.dailyNewCases)
          }
          if (parseInt(element.dailyDeaths) > maxNewDeaths) {
            maxNewDeaths = parseInt(element.dailyDeaths)
          }

          return {
            date: d3.timeParse("%Y-%m-%d")(element.date),
            dailyNewCases: parseInt(element.dailyNewCases),
            dailyDeaths: parseInt(element.dailyDeaths)
          }
        }),
        color: continentColors[locationName]
      })

    }
  })

  plotGraph(
    '#cases',
    input,
    'dailyNewCases',
    false,
    {
      title: 'Total Daily New Cases (Region)',
      xLabel: 'Date',
      yLabel: 'Cases'

    },
    {
      maxY: maxNewCases,
      earliestIdx,
      furtherestIdx
    },
    continentColors
  )
  plotGraph(
    '#deaths',
    input,
    'dailyDeaths',
    false,
    {
      title: 'Total Daily New Deaths (Region)',
      xLabel: 'Date',
      yLabel: 'Deaths'

    },
    {
      maxY: maxNewDeaths,
      earliestIdx,
      furtherestIdx
    },
    continentColors
  )
})
