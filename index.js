d3.json("./finalData/fullData.json").then(data => {
  const input = data.World
  console.log(input)
  let maxNewCases = 0
  let maxNewDeaths = 0
  console.log(input[0])
  input.forEach((day, i) => {
    input[i].date = parseTime(day.date)
    if (parseInt(day.dailyNewCases) > maxNewCases) {
      maxNewCases = parseInt(input[i].dailyNewCases)
    }
    if(parseInt(day.dailyDeaths) > maxNewDeaths) {
      maxNewDeaths = parseInt(input[i].dailyDeaths)
    }
  })

  plotGraph(
    '#cases',
    [{
      data: input,
      color: '#030303'
    }],
    'dailyNewCases',
    true,
    {
      title: 'Total Daily New Cases (World)',
      xLabel: 'Date',
      yLabel: 'Cases'

    },
    {
      maxY: maxNewCases
    }
  )

  plotGraph(
    '#deaths',
    [{
      data: input,
      color: '#030303'
    }],
    'dailyDeaths',
    true,
    {
      title: 'Total Daily New Deaths (World)',
      xLabel: 'Date',
      yLabel: 'Deaths'

    },
    {
      maxY: maxNewDeaths
    }
  )
})
