const csv = require('csvtojson')
const fs = require('fs')

const csvFilePath = '../../covidData/owid-covid-data (1).csv'

const results = {}
const countryToRegion = {}
const regionSet = new Set()
const countrySet = new Set()

csv()
  .fromFile(csvFilePath)
  .then(result => {
    result.forEach(data => {
      if (data.continent) {
        countrySet.add(data.location)
        regionSet.add(data.continent)
        countryToRegion[data.location] = data.continent
      }
      if (!results[data.location]) {
        results[data.location] = []
      }
      results[data.location].push({
        date: data.date,
        location: data.location,
        dailyNewCases: data.new_cases,
        dailyDeaths: data.new_deaths,
        population: data.population,
        populationDensity: data.population_density,
        lifeExpectancy: data.life_expectancy
      })
    })

    const countryList = Array.from(countrySet)
    const regionCounts = {}
    Object.values(countryToRegion).forEach(region => {
      if (!regionCounts[region]) {
        regionCounts[region] = 1
      } else {
        regionCounts[region] = regionCounts[region] + 1
      }
    })
    regionCounts.World = countryList.length

    results.meta = {
      countriesPerRegion: regionCounts
    }

    fs.writeFileSync('../../finalData/fullData.json', JSON.stringify(results))
    fs.writeFileSync('../../finalData/countryToRegion.json', JSON.stringify(countryToRegion))
    fs.writeFileSync('../../finalData/countryList.json', JSON.stringify(Array.from(countrySet)))
    fs.writeFileSync('../../finalData/regionList.json', JSON.stringify(Array.from(regionSet)))
  })
