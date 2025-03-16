import ollama from 'ollama';
import {getCityWeather, getCityWeatherTool} from "./weather.js";
// import ollama from 'ollama/browser'

async function run(model: string) {
  // const messages = [{ role: 'user', content: 'What is the weather in Vilnius?' }];
  const messages = [{ role: 'user', content: 'What is the weather in Vilnius? Give me the output format: {CITY}-{COUNTRY}-{CONDITION}-{TEMPERATURE}' }];
  console.log('Prompt:', messages[0].content);

  const availableFunctions = {
    getCityWeather: getCityWeather,
  };

  const response = await ollama.chat({
    model: model,
    messages: messages,
    tools: [getCityWeatherTool]
  });

  let output: number;
  if (response.message.tool_calls) {
    // Process tool calls from the response
    for (const tool of response.message.tool_calls) {
      // @ts-ignore
      const functionToCall = availableFunctions[tool.function.name];
      if (functionToCall) {
        console.log('Calling function:', tool.function.name);
        console.log('Arguments:', tool.function.arguments);
        output = await functionToCall(tool.function.arguments);
        console.log('Function output:', output);

        // Add the function response to messages for the model to use
        messages.push(response.message);
        messages.push({
          role: 'tool',
          content: output.toString(),
        });
      } else {
        console.log('Function', tool.function.name, 'not found');
      }
    }

    // Get final response from model with function outputs
    const finalResponse = await ollama.chat({
      model: model,
      messages: messages
    });
    console.log('Final response:', finalResponse.message.content);
  } else {
    console.log('No tool calls returned from model');
  }
}

// const model = 'phi4-mini';
const model = 'mistral-nemo';
run(model).catch(error => console.error("An error occurred:", error));