// https://www.weatherapi.com/api-explorer.aspx
const WEATHER_API_KEY= process.env.WEATHER_API_KEY;
export async function getCityWeather(args: { city: string }): Promise<string> {
  try {
    const url = `http://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${encodeURIComponent(args.city)}&aqi=no`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch weather data: ${response.statusText}`);
    }

    const data = await response.json();

    // const responseText = `The current weather in ${data.location.name}, ${data.location.country} is ${data.current.condition.text} with a temperature of ${data.current.temp_c}°C (${data.current.temp_f}°F).`;
    const responseText = `The current weather in ${data.location.name}, ${data.location.country} is ${data.current.condition.text} with a temperature of ${data.current.temp_c}°C.`;

    return responseText;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return "Unable to retrieve weather information. Please try again later.";
  }
}

export const getCityWeatherTool = {
  type: 'function',
  function: {
    name: 'getCityWeather',
    description: 'What is the weather in the city',
    parameters: {
      type: 'object',
      required: ['city'],
      properties: {
        city: { type: 'string', description: 'City' },
      }
    }
  }
};