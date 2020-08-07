import { StormGlass } from '@src/clients/stormGlass'
import axios from 'axios'
import stormGlassWeather3HoursFixture from '../../../tests/fixture/stormglass_weather_3_hours.json'
import stormGlassNormalized3HoursFixture from '../../../tests/fixture/stormglass_normalized_response_3_hours.json'

jest.mock('axios')

describe('StormGlass Client', () => {
  const mockedAxios = axios as jest.Mocked<typeof axios>

  it('Should return the normalized forecast from the StormGlass Service', async() => {
    const lat = -33.792726
    const lng = 151.289824

    mockedAxios.get.mockResolvedValue({ data: stormGlassWeather3HoursFixture })

    const stormGlass = new StormGlass(mockedAxios)
    const response = await stormGlass.FetchPoints(lat, lng)

    expect(response).toEqual(stormGlassNormalized3HoursFixture)
  })
})
