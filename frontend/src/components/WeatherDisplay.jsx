//
// Napisao Dusan Veljkovic 2023/0417
//
import { useState, useEffect } from 'react';
import { getWeatherByCity, getWeatherByCoords } from '../services/weatherService';

const WEATHER_ICONS = {
  '01d': '☀️', '01n': '🌙',
  '02d': '⛅', '02n': '☁️',
  '03d': '☁️', '03n': '☁️',
  '04d': '☁️', '04n': '☁️',
  '09d': '🌧️', '09n': '🌧️',
  '10d': '🌧️', '10n': '🌧️',
  '11d': '⛈️', '11n': '⛈️',
  '13d': '❄️', '13n': '❄️',
  '50d': '🌫️', '50n': '🌫️',
};

function WeatherDisplay({ location, onRecommendations }) {
  const [weather, setWeather] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (location) {
      loadWeather(location);
    } else {
      getUserLocation();
    }
  }, [location]);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          await loadWeather({ lat: latitude, lon: longitude });
        },
        () => {
          // Fallback to default city
          loadWeather({ city: 'Beograd' });
        }
      );
    } else {
      loadWeather({ city: 'Beograd' });
    }
  };

  const loadWeather = async (params) => {
    setLoading(true);
    setError('');
    try {
      let data;
      if (params.city) {
        data = await getWeatherByCity(params.city);
      } else if (params.lat && params.lon) {
        data = await getWeatherByCoords(params.lat, params.lon);
      } else {
        throw new Error('Invalid location parameters');
      }

      setWeather(data.weather);
      setRecommendations(data.recommendations);

      if (onRecommendations) onRecommendations(data.recommendations)
    } catch (err) {
      console.error('Weather load error:', err);
      setError('Neuspešno učitavanje vremenske prognoze');
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (iconCode) => {
    return WEATHER_ICONS[iconCode] || '🌤️';
  };

  if (loading) {
    return (
      <div style={{
        background: 'white',
        borderRadius: 14,
        padding: '24px',
        border: '0.5px solid rgba(0,0,0,0.1)',
        textAlign: 'center',
      }}>
        <p style={{ color: '#9ca3a0', margin: 0 }}>Učitavanje vremenske prognoze...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        background: '#FCEBEB',
        borderRadius: 14,
        padding: '16px',
        border: '1px solid #F09595',
      }}>
        <p style={{ color: '#A32D2D', margin: 0, fontSize: 13 }}>{error}</p>
        <button
          onClick={() => loadWeather({ city: 'Beograd' })}
          style={{
            marginTop: 8,
            padding: '6px 14px',
            borderRadius: 6,
            border: 'none',
            background: '#534AB7',
            color: 'white',
            cursor: 'pointer',
            fontSize: 12,
          }}
        >
          Pokušaj ponovo
        </button>
      </div>
    );
  }

  if (!weather) return null;

  return (
    <div style={{
      background: 'white',
      borderRadius: 14,
      padding: '20px',
      border: '0.5px solid rgba(0,0,0,0.1)',
      boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
    }}>
      {/* Weather Info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
        <div style={{ fontSize: 48 }}>
          {getWeatherIcon(weather.weather_icon)}
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{ fontSize: 28, fontWeight: 500, color: '#1a1a18' }}>
              {Math.round(weather.temperature)}°
            </span>
            <span style={{ fontSize: 14, color: '#9ca3a0' }}>
              oseća se kao {Math.round(weather.feels_like)}°
            </span>
          </div>
          <p style={{ fontSize: 14, color: '#6b6b67', margin: 0 }}>
            {weather.weather_description}
          </p>
        </div>
      </div>

      {/* Weather Details */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))',
        gap: 8,
        padding: '12px 0',
        borderTop: '0.5px solid rgba(0,0,0,0.06)',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: '#9ca3a0' }}>Vlaga</div>
          <div style={{ fontSize: 13, fontWeight: 500, color: '#1a1a18' }}>
            {weather.humidity}%
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: '#9ca3a0' }}>Vetar</div>
          <div style={{ fontSize: 13, fontWeight: 500, color: '#1a1a18' }}>
            {Math.round(weather.wind_speed * 3.6)} km/h
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: '#9ca3a0' }}>Pritisak</div>
          <div style={{ fontSize: 13, fontWeight: 500, color: '#1a1a18' }}>
            {weather.pressure} hPa
          </div>
        </div>
      </div>
    </div>
  );
}

export default WeatherDisplay;
