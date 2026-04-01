<?php

namespace App\Http\Controllers;

use App\Models\Device;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;

class CameraStreamController extends Controller
{
    public function index(Request $request)
    {
        $model = Device::query();

        $model->with(['branch', 'status']);
        $model->whereNotNull('camera_rtsp_ip');
        $model->where('camera_rtsp_ip', '!=', '');
        $model->where('company_id', $request->company_id);

        $model->when($request->filled('branch_ids'), function ($q) use ($request) {
            $branchIds = is_array($request->branch_ids) ? $request->branch_ids : [$request->branch_ids];
            $q->whereIn('branch_id', $branchIds);
        });

        $model->when($request->filled('search'), function ($q) use ($request) {
            $q->where(function ($qq) use ($request) {
                $qq->where('name', 'like', "%{$request->search}%");
                $qq->orWhere('camera_rtsp_ip', 'like', "%{$request->search}%");
                $qq->orWhere('location', 'like', "%{$request->search}%");
            });
        });

        $model->orderBy('name', 'asc');

        return $model->paginate($request->per_page ?? 10);
    }

    public function status($deviceId)
    {
        $device = Device::where('id', $deviceId)
            ->whereNotNull('camera_rtsp_ip')
            ->first();

        if (!$device) {
            return response()->json(['status' => false, 'message' => 'Camera not found'], 404);
        }

        return response()->json([
            'status' => true,
            'data' => [
                'id' => $device->id,
                'name' => $device->name,
                'camera_rtsp_ip' => $device->camera_rtsp_ip,
                'camera_rtsp_port' => $device->camera_rtsp_port,
                'is_configured' => true,
            ]
        ]);
    }

    public function credentials($deviceId)
    {
        $device = Device::where('id', $deviceId)
            ->whereNotNull('camera_rtsp_ip')
            ->first();

        if (!$device) {
            return response()->json(['status' => false, 'message' => 'Camera not found'], 404);
        }

        $password = $device->camera_password;
        try {
            $password = Crypt::decryptString($device->camera_password);
        } catch (\Exception $e) {
            // Password may not be encrypted (legacy data), use as-is
        }

        return response()->json([
            'status' => true,
            'data' => [
                'rtsp_url' => null,
                'camera_rtsp_ip' => $device->camera_rtsp_ip,
                'camera_rtsp_port' => $device->camera_rtsp_port,
                'camera_username' => $device->camera_username,
                'camera_password' => $password,
                'device_name' => $device->name,
                'branch_id' => $device->branch_id,
                'company_id' => $device->company_id,
            ]
        ]);
    }
}
