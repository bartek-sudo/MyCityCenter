<?php

namespace App\Http\Controllers;

use App\Models\Reply;
use App\Http\Requests\StoreReplyRequest;
use App\Http\Requests\UpdateReplyRequest;
use App\Http\Resources\ReplyResource;

class ReplyController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $query = Reply::query();

        $sortField = request("sort_field", 'created_at');
        $sortDirection = request("sort_direction", "desc");

        if (request('content')) {
            $query->where('content', 'like', '%'.request('content').'%');
        }

        if (request('proposal_name')) {
            $query->whereHas('getProposal', function ($query) {
                $query->where('title', 'like', '%'.request('proposal_name').'%');
            });
        }

        $replies = $query->orderBy($sortField, $sortDirection)->paginate(10);

        return inertia('Reply/Index', [
            'replies' => ReplyResource::collection($replies),
            'queryParams' => request()->query() ?: null,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreReplyRequest $request)
    {
        $data = $request->validated();
        $data['created_by'] = auth()->id();

        Reply::create($data);
        return redirect()->back();

    }

    /**
     * Display the specified resource.
     */
    public function show(Reply $reply)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Reply $reply)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateReplyRequest $request, Reply $reply)
    {
        $data = $request->validated();
        $data['updated_at'] = now();
        $reply->update($data);
        return redirect()->back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Reply $reply)
    {
        $reply->delete($reply->id);
        return redirect()->back();
    }
}
