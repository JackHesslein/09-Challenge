import { Router, type Request, type Response } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req: Request, res: Response) => {
  // TODO: GET weather data from city name
  const {city} = req.body;
  
  if (!city) {
    return res.status(400).json({error: 'city name is required'});
  }
  try {
    const weatherData = await WeatherService.getWeatherForCity(city);
  //console.log(weatherData);
  
    // TODO: save city to search history
    await HistoryService.addCity(city);

    return res.status(200).json(weatherData)
  } catch (error) {
    console.error('Error retrieving weather data:', error);
    return res.status(500).json({error: 'Failed to retrieve weather data'});
  }
});

// TODO: GET search history
// @ts-ignore
router.get('/history', async (req: Request, res: Response) => {
  try {
    const history = await HistoryService.getCities();
    res.status(200).json(history);
  } catch (error) {
    console.error('Error retrieving weather data:', error);
    res.status(500).json({error: 'Failed to retrieve weather data'});
  }
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {
  const {id} = req.params;

  try {
    await HistoryService.removeCity(id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting city from search history:', error);
    res.status(500).json({ error: 'Failed to delete city from search history' });
}
});

export default router;
