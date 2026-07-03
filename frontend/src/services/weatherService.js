//
// Napisao Dusan Veljkovic 2023/0417
//
import apiFetch from './api';

// Dohvati vremensku prognozu
export const getWeatherForecast = async (lat, lon, days = 5) => {
  return await apiFetch(`/weather/forecast/?lat=${lat}&lon=${lon}&days=${days}`);
};

// Dohvati trenutno vreme za koordinate
export const getWeatherByCoords = async (lat, lon) => {
  return await apiFetch(`/weather/?lat=${lat}&lon=${lon}`);
};
