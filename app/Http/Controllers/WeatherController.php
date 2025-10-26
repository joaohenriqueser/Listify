<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class WeatherController extends Controller
{
    public function getWeather(Request $request)
    {
        $validated = $request->validate(['city' => 'required|string|max:100']);
        $apiKey = env('OPENWEATHER_API_KEY'); 
        if (!$apiKey) {
            // Retorno de erro obrigatório se a chave faltar
            return response()->json(['error' => 'Chave da API de clima não configurada.'], 500); 
        }

        try {
            $response = Http::get('https://api.openweathermap.org/data/2.5/weather', [
                'q' => $validated['city'],
                'appid' => $apiKey,
                'units' => 'metric', 
                'lang' => 'pt',
            ]);

            if ($response->failed()) {
                return response()->json(['error' => 'Cidade não encontrada ou erro na API.'], $response->status());
            }
            return response()->json($response->json());
        } catch (\Exception $e) {
            return response()->json(['error' => 'Erro interno de conexão.'], 500);
        }
    }
}