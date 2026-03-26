<?php

namespace App\Http\Controllers;

use App\Models\HostCompany;
use App\Models\Notification as NotificationModel;
use App\Models\UserLocation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log as FacadesLog;
use Illuminate\Support\Facades\Notification;

class NotificationsController extends Controller
{
    public static function toSend($model, $notificationClass, $object)
    {
        Notification::send($model, new $notificationClass($object));
    }

    public function test()
    {
        $host = HostCompany::where("id", request("host_company_id"))->with("employee:id,user_id,employee_id")->first();

        return NotificationModel::create([
            "data" => "Test",
            "action" => "Registration",
            "model" => "visitor",
            "user_id" => $host->employee->user_id ?? 0,
            "company_id" => 2,
        ]);

        // Notification::send($model, new $notificationClass($object));
    }



    public function index(Request $request)
    {
        return $this->getDefaultModelSetting($request)->where("read_at", null)->paginate($request->input("per_page", 100));
    }

    public function unread(Request $request)
    {
        return $this->getDefaultModelSetting($request)->where("read_at", null)->get();
    }

    public function read(Request $request)
    {
        return $this->getDefaultModelSetting($request)->whereNot("read_at", null)->get();
    }


    public function getDefaultModelSetting(Request $request)
    {

        $model = NotificationModel::query();

        $model->where("company_id", $request->input("company_id"));

        $model->when($request->filled("user_id"), fn($q) => $q->where("user_id", $request->user_id));

        $model->orderByDesc("id");

        return $model;
    }

    public function update($id)
    {
        try {
            $model = NotificationModel::where("id", $id)->update(["read_at" => date("d-M-y H:i:s")]);
            return $this->response('Visitor successfully created.', $model, true);
        } catch (\Throwable $th) {
            return $this->response($th, null, true);
        }
    }

    public function storeNotifications(Request $request)
    {
        // Log the incoming request to see what's happening
        FacadesLog::info("Incoming Payload:", $request->all());

        $userId = $request->input('data.user_id');
        $timestamp = $request->input('data.timestamp');

        $exists = UserLocation::where('user_id', $userId)
            ->where('recorded_at', $timestamp)
            ->exists();

        if (!$exists) {
            // FIX: Change 'type' to 'map'
            if (!$request->boolean('debug') && $request->type == 'map') {

                $created = UserLocation::create([
                    'company_id'  => $request->clientId,
                    'user_id'     => $request->input('data.user_id'),
                    'user_name'   => $request->input('data.name'),
                    'avatar'      => $request->input('data.avatar'),
                    'lat'         => $request->input('data.lat'),
                    'lon'         => $request->input('data.lon'),
                    'recorded_at' => $request->input('data.timestamp'),
                ]);

                FacadesLog::info("Location Saved Successfully", $created->toArray());

                return response()->json(['status' => 'success'], 201);
            }

            FacadesLog::warning("Request type mismatch: " . $request->type);
            return response()->json(['status' => 'ignored'], 200);
        }
    }
}
