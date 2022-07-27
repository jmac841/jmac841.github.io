let maxAverage = 0
let worldData = {}
let regionData = {}
let selectedDataParsed
var selectedRegionParsed
let worldDataParsed
let selectedCountry
let selectedResponse
let maxY = 20000
let minY = 0

const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());
console.log(params)


const responseSelect = document.getElementById('responseSelect')
Object.keys(responseToData).forEach(key => {
  let option = document.createElement('option')
  option.value = key
  option.text = key
  responseSelect.appendChild(option)
})

fetch('../finalData/countryList.json')
  .then(response => response.json())
  .then(data => {
    const select = document.getElementById('countrySelect')
    for (const country of data) {
      if (!regionList.has(country)) {
        let option = document.createElement('option')
        option.value = country
        option.text = country
        select.appendChild(option)
      }
    }
  })
const handleResponse = (event) => {
  selectedResponse = event.target.value
  if (selectedCountry) {
    display()
  }
}
const handleCountry = (event) => {
  selectedCountry = event.target.value
  selectedRegion = getCountryRegion(selectedCountry)

  fetch('../finalData/fullData.json')
    .then(response => response.json())
    .then(data => {
      selectedDataParsed = parseData(data[selectedCountry])
      selectedRegionParsed = parseData(data[getCountryRegion(selectedCountry)], data.meta)
      worldDataParsed = parseData(data.World, data.meta)

      maxY = Math.max(selectedDataParsed.maxAveDailyNewCases, selectedRegionParsed.maxAveDailyNewCases, worldDataParsed.maxAveDailyNewCases)
      display()
    })
}
const display = (minDate, maxDate) => {
  let label = 'Deaths'
  let field = 'dailyDeaths'
  if(params.measure === 'aveDailyNewCases') {
    label = 'Cases'
    field = 'aveDailyNewCases'
  }
  plotGraph(
    '.chart',
    [
      {
        data: Object.values(worldDataParsed.newList),
        color: '#030303'
      },
      {
        data: Object.values(selectedRegionParsed.newList),
        color: continentColors[selectedRegionParsed.newList[0].location] ?? '#f203ff'
      },
      {
        data: Object.values(selectedDataParsed.newList),
        color: '#ff7d03'
      }
    ],
    field,
    false,
    {
      title: `Total Daily New ${label} By Country`,
      xLabel: 'Date',
      yLabel: `Average ${label}`

    },
    {
      minY: minY ?? 0,
      maxY: maxY ?? 0,
      minDate,
      maxDate
    },
    {
      'World': '#030303',
      [selectedRegionParsed.newList[0].location]: continentColors[selectedRegion] ?? '#f203ff',
      [selectedDataParsed.newList[0].location]: '#ff7d03'
    },
    {
      showToolTip: true,
      valueLabel: `Average ${label}`
    },
    {
      show: selectedResponse,
      response: selectedResponse
    }
  )
}

const updateRange = () => {
  if (!selectedCountry) {
    alert('Please Select Country')
  } else {
    minY = document.getElementById('min').value
    maxY = document.getElementById('max').value
    const minDate = document.getElementById('start').value
    const maxDate = document.getElementById('end').value

    display(minDate, maxDate)
  }
}
const reset = () => {
  if(selectedCountry) {
    minY = 0
    maxY = 20000
    document.getElementById('min').value = 0
    document.getElementById('max').value = 20000
    document.getElementById('start').value = '2020-01-22'
    document.getElementById('end').value = '2021-05-01'
    display()
  }
}
