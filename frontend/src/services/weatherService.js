//
// Napisao Dusan Veljkovic 2023/0417
//
import apiFetch from './api';

// Dohvati trenutno vreme za koordinate ili grad
export const getWeather = async (params) => {
  const queryParams = new URLSearchParams(params);
  return await apiFetch(`/weather/?${queryParams.toString()}`);
};

// Dohvati vremensku prognozu
export const getWeatherForecast = async (lat, lon, days = 5) => {
  return await apiFetch(`/weather/forecast/?lat=${lat}&lon=${lon}&days=${days}`);
};

// Dohvati trenutno vreme za grad
export const getWeatherByCity = async (city) => {
  return await apiFetch(`/weather/?city=${encodeURIComponent(city)}`);
};

// Dohvati trenutno vreme za koordinate
export const getWeatherByCoords = async (lat, lon) => {
  return await apiFetch(`/weather/?lat=${lat}&lon=${lon}`);
};
