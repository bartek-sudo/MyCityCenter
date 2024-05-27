<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Http\Requests\StoreDepartmentRequest;
use App\Http\Requests\UpdateDepartmentRequest;
use App\Http\Resources\DepartmentResource;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class DepartmentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Department/Index', [
            'departments' => DepartmentResource::collection(Department::all()),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        if (Gate::allows('is-admin')) {
            return Inertia::render('Department/Create');
        }
        return redirect()->back();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreDepartmentRequest $request)
    {
        $data = $request->validated();
        Department::create($data);
        return redirect()->route('department.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(Department $department)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Department $department)
    {
        if (Gate::allows('is-admin')) {
            return Inertia::render('Department/Edit', [
                'department' => new DepartmentResource($department),
            ]);
        }
        return redirect()->back();
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateDepartmentRequest $request, Department $department)
    {
        if (Gate::allows('is-admin')) {
            $data = $request->validated();
            $department->update($data);
            return redirect()->route('department.index');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Department $department)
    {
        if (Gate::allows('is-admin')) {
            foreach ($department->proposals as $proposal) {
                $proposal->department()->dissociate();
                $proposal->save();
            }
            $department->delete();
            return redirect()->route('department.index');
        }
    }
}
