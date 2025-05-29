<?php

use App\Http\Controllers\Api\ResumeController;
use App\Http\Controllers\Api\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Handle preflight requests globally
Route::options('{any}', function () {
    return response('', 200)
        ->header('Access-Control-Allow-Origin', '*')
        ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept')
        ->header('Access-Control-Max-Age', '86400');
})->where('any', '.*');

// Health check endpoint
Route::get('/health', function () {
    return response()->json([
        'status' => 'healthy',
        'timestamp' => now()->toISOString(),
        'service' => 'Multilingual Resume Generator API',
        'version' => '1.0.0',
        'features' => [
            'ai_generation' => true,
            'translation' => true,
            'pdf_export' => true,
            'authentication' => true,
            'analytics' => true
        ]
    ])->header('Access-Control-Allow-Origin', '*');
});

// Authentication routes
Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);
    
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('logout', [AuthController::class, 'logout']);
        Route::get('profile', [AuthController::class, 'profile']);
        Route::put('profile', [AuthController::class, 'updateProfile']);
        Route::post('change-password', [AuthController::class, 'changePassword']);
        Route::post('refresh', [AuthController::class, 'refresh']);
    });
});

// User info route
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Resume routes
Route::prefix('resumes')->group(function () {
    // Public routes (no authentication required for demo)
    Route::post('/generate', [ResumeController::class, 'generate']);
    Route::post('/cover-letter', [ResumeController::class, 'generateCoverLetter']);
    Route::post('/export-pdf', [ResumeController::class, 'exportPdf']);
    Route::post('/translate-text', [ResumeController::class, 'translateText']);
    Route::post('/translate-resume', [ResumeController::class, 'translateResume']);
    
    // Protected routes (require authentication)
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/', [ResumeController::class, 'index']);
        Route::get('/{resume}', [ResumeController::class, 'show']);
        Route::delete('/{resume}', [ResumeController::class, 'destroy']);
        Route::post('/{resume}/translate', [ResumeController::class, 'translate']);
    });
});

// Health check
Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now(),
        'service' => 'Resume Generator API'
    ]);
});
