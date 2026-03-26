<?php

use App\Http\Controllers\CompanyBranchController;
use Illuminate\Support\Facades\Route;

Route::apiResource('/branch', CompanyBranchController::class);
Route::post('/branch/{id}', [CompanyBranchController::class, "update"]);
Route::get('/branches_list', [CompanyBranchController::class, "branchesList"]);
Route::get('/branch-list', [CompanyBranchController::class, "dropdownList"]);
Route::put('/branch-update-geofencing/{id}', [CompanyBranchController::class, "updateGeoFencing"]);
Route::get('/branch-list-for-geofencing/{id}', [CompanyBranchController::class, "branchListGeoFencing"]);
