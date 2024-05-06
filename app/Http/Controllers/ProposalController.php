<?php

namespace App\Http\Controllers;

use App\Models\Proposal;
use App\Http\Requests\StoreProposalRequest;
use App\Http\Requests\UpdateProposalRequest;
use App\Http\Resources\ProposalResource;
use App\Http\Resources\ReplyResource;
use App\Models\Department;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProposalController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        if (Gate::allows('view-all-proposals')) {
            $query = Proposal::query();
        } else {
            $query = Proposal::query()
                ->where('created_by', Auth::id())
                ->orWhere('processed_by', Auth::id());
        }

        $sortField = request("sort_field", 'created_at');
        $sortDirection = request("sort_direction", "asc");

        if (request('title')) {
            $query->where('title', 'like', '%' . request('title') . '%');
        }

        if (request('status')) {
            $query->where('status', request('status'));
        }

        $proposals = $query->orderBy($sortField, $sortDirection)->paginate(10);

        return inertia('Proposal/Index', [
            'proposals' => ProposalResource::collection($proposals),
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return inertia('Proposal/Create', [
            'departments' => Department::all(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProposalRequest $request)
    {
        $data = $request->validated();
        $image = $data['image'] ?? null;
        $data['status'] = 'pending';
        $data['created_by'] = Auth::id();
        $data['processed_by'] = null;

        // dd($data);

        if ($image) {
            $data['image_path'] = $image->store('proposal/' . Str::random(), 'public');
        }
        Proposal::create($data);


        if (Gate::allows('is-admin')) {
            return redirect()->route('proposal.index')
                ->with('success', 'Proposal created successfully!');
        } else {
            return to_route('proposal.myProposals')
                ->with('success', 'Proposal created successfully!');
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Proposal $proposal)
    {
        if (!Gate::allows('access-proposal', $proposal)) {
            abort(403);
        }

        $query = $proposal->replies();

        $replies = $query
            ->orderBy('created_at', 'asc')
            ->paginate(10)
            ->onEachSide(1);
        return inertia('Proposal/Show', [
            'proposal' => new ProposalResource($proposal),
            'replies' => ReplyResource::collection($replies),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Proposal $proposal)
    {
        if (!Gate::allows('access-proposal', $proposal)) {
            abort(403);
        }
        return inertia('Proposal/Edit', [
            'proposal' => new ProposalResource($proposal),
            'departments' => Department::all(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProposalRequest $request, Proposal $proposal)
    {
        $data = $request->validated();

        $image = $data['image'] ?? null;
        $data['updated_at'] = now();
        // $data['processed_by'] = Auth::id();
        // dd($data);

        if ($image) {
            if ($proposal->image_path) {
                Storage::disk('public')->deleteDirectory(dirname($proposal->image_path));
            }
            $data['image_path'] = $image->store('proposal/' . Str::random(), 'public');
        }

        $proposal->update($data);

        if (Gate::allows('is-admin')) {
            return to_route('proposal.index')
                ->with('success', "Proposal {$proposal->title} updated successfully!");
        } else {
            return to_route('proposal.myProposals')
                ->with('success', "Proposal {$proposal->title} updated successfully!");
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Proposal $proposal)
    {
        $proposal->delete($proposal->id);
        $proposal->replies()->delete();
        if ($proposal->image_path) {
            Storage::disk('public')->deleteDirectory(dirname($proposal->image_path));
        }
        return to_route('proposal.index')
            ->with('success', "Proposal {$proposal->title} deleted successfully!");
    }

    public function myProposals()
    {
        $query = Proposal::query()
            ->where('created_by', Auth::id())
            ->orWhere('processed_by', Auth::id());

        $sortField = request("sort_field", 'created_at');
        $sortDirection = request("sort_direction", "desc");

        if (request('title')) {
            $query->where('title', 'like', '%' . request('title') . '%');
        }

        if (request('status')) {
            $query->where('status', request('status'));
        }

        $proposals = $query
            ->orderBy($sortField, $sortDirection)
            ->paginate(10);

        return inertia('Proposal/Index', [
            'proposals' => ProposalResource::collection($proposals),
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
        ]);
    }
}
