export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    const { text, targetLanguage } = await request.json();

    if (!text || !targetLanguage) {
      return Response.json(
        { error: 'Text and target language are required' },
        { status: 400 }
      );
    }

    const url = "https://text.pollinations.ai/openai";
    const headers = {
      "Content-Type": "application/json",
      "Authorization": "Bearer D5iEptuNtJWrRFjC"
    };

    const prompt = `Please translate the following game description to ${targetLanguage}. Only return the translated text without any additional explanation:

${text}`;

    const data = {
      model: "gpt-5-nano",
      messages: [{ role: "user", content: prompt }],
      stream: true
    };

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`Translation API error: ${response.status}`);
    }

    // Process streaming response
    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No response body');
    }

    let fullContent = '';
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n');

      for (const line of lines) {
        const trimmedLine = line.trim();
        if (!trimmedLine || trimmedLine === 'data: [DONE]') continue;
        if (!trimmedLine.startsWith('data: ')) continue;

        const jsonStr = trimmedLine.slice(6);
        try {
          const parsedChunk = JSON.parse(jsonStr);
          if (parsedChunk.choices?.[0]?.delta?.content) {
            fullContent += parsedChunk.choices[0].delta.content;
          }
          if (parsedChunk.choices?.[0]?.finish_reason === 'stop') {
            break;
          }
        } catch (e) {
          // Skip invalid JSON
          continue;
        }
      }
    }

    return Response.json({ translatedText: fullContent.trim() });

  } catch (error) {
    console.error('Translation error:', error);
    return Response.json(
      { error: 'Translation failed' },
      { status: 500 }
    );
  }
}
