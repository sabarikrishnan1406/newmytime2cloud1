<?php

namespace App\Http\Controllers;

use App\Models\AIFeeds;
use Illuminate\Http\Request;

class AIFeedsController extends Controller
{
    public function index(Request $request)
    {
        $request->validate([
            'company_id' => 'required|integer',
            'type' => 'nullable|string|in:late,early,absent',
            'from_date' => 'nullable|date',
            'to_date' => 'nullable|date',
            'per_page' => 'nullable|integer|min:1|max:100',
        ]);

        $query = AIFeeds::with('employee')
            ->where('company_id', $request->company_id)
            ->orderBy('created_at', 'desc');

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        if ($request->filled('from_date')) {
            $query->whereDate('created_at', '>=', $request->from_date);
        }

        if ($request->filled('to_date')) {
            $query->whereDate('created_at', '<=', $request->to_date);
        }

        $perPage = $request->input('per_page', 20);
        $feeds = $query->paginate($perPage);

        return response()->json($feeds);
    }


    public function aiFeedsByEmployeeId(Request $request, $id)
    {
        $request->validate([
            'type' => 'nullable|string|in:late,early,absent',
            'from_date' => 'nullable|date',
            'to_date' => 'nullable|date',
            'per_page' => 'nullable|integer|min:1|max:100',
        ]);

        $query = AIFeeds::where('employee_id', $id)->orderBy('created_at', 'desc');

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        if ($request->filled('from_date')) {
            $query->whereDate('created_at', '>=', $request->from_date);
        }

        if ($request->filled('to_date')) {
            $query->whereDate('created_at', '<=', $request->to_date);
        }

        $perPage = $request->input('per_page', 20);
        $feeds = $query->paginate($perPage);

        return response()->json($feeds);
    }
}
