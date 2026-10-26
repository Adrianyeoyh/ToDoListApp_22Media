<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Throwable;

class HealthController extends Controller
{
    /**
     * Tells the app whether the API and its database can serve requests, so it knows when to fall back to local data.
     */
    public function check(): JsonResponse
    {
        try {
            DB::select('select 1');
        } catch (Throwable) {
            return response()->json(['status' => 'unavailable'], 503);
        }

        return response()->json(['status' => 'ok']);
    }
}
