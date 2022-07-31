const csv = require('csvtojson')
const fs = require('fs')

const readData = (input) => {
  const results = {}
  const currentIdx = {}
  csv()
    .fromFile(input.csvFilePath)
    .then(result => {
      result.forEach(data => {
        const country = data.Entity
        const val = parseInt(data[input.dataValue])
        if (!(country in currentIdx)) {
          currentIdx[country] = val
          results[country] = {
            up: [],
            down: []
          }
        }
        else if (val !== currentIdx[country]) {
          if (val > currentIdx[country]) {
            results[country].up.push(data.Day)
          } else {
            results[country].down.push(data.Day)
          }
          currentIdx[country] = val
        }
      })

      fs.writeFileSync(`../../finalData/responseData/${input.dataValue}.json`, JSON.stringify(results))
    })
}

const options = [
  {
    csvFilePath: '../../covidData/covid-contact-tracing.csv',
    dataValue: 'contact_tracing'
  },
  {
    csvFilePath: '../../covidData/covid-stringency-index.csv',
    dataValue: 'stringency_index'
  },
  {
    csvFilePath: '../../covidData/face-covering-policies-covid.csv',
    dataValue: 'facial_coverings'
  },
  {
    csvFilePath: '../../covidData/income-support-covid.csv',
    dataValue: 'income_support'
  },
  {
    csvFilePath: '../../covidData/internal-movement-covid.csv',
    dataValue: 'restrictions_internal_movements'
  },
  {
    csvFilePath: '../../covidData/international-travel-covid.csv',
    dataValue: 'international_travel_controls'
  },
  {
    csvFilePath: '../../covidData/public-gathering-rules-covid.csv',
    dataValue: 'restriction_gatherings'
  },
  {
    csvFilePath: '../../covidData/school-closures-covid.csv',
    dataValue: 'school_closures'
  },
  {
    csvFilePath: '../../covidData/workplace-closures-covid.csv',
    dataValue: 'workplace_closures'
  }
]


options.forEach(option => readData(option))
