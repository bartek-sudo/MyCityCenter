<?php

namespace App\Http\Controllers;

use App\Http\Resources\ProposalResource;
use App\Models\Proposal;


class DashboardController extends Controller
{
    public function index()
    {
        $totalProposals = Proposal::query()
            ->where(function ($query) {
                $query->where('created_by', auth()->id())
                    ->orWhere('processed_by', auth()->id());
            })
            ->count();
        $myPendingProposals = Proposal::query()
            ->where('status', 'pending')
            ->where(function ($query) {
                $query->where('created_by', auth()->id())
                    ->orWhere('processed_by', auth()->id());
            })
            ->count();

        $myInProgressProposals = Proposal::query()
            ->where('status', 'in_progress')
            ->where(function ($query) {
                $query->where('created_by', auth()->id())
                    ->orWhere('processed_by', auth()->id());
            })
            ->count();

        $myApprovedProposals = Proposal::query()
            ->where('status', 'approved')
            ->where(function ($query) {
                $query->where('created_by', auth()->id())
                    ->orWhere('processed_by', auth()->id());
            })
            ->count();

        $myRejectedProposals = Proposal::query()
            ->where('status', 'rejected')
            ->where(function ($query) {
                $query->where('created_by', auth()->id())
                    ->orWhere('processed_by', auth()->id());
            })
            ->count();

        $activeProposals = Proposal::query()
            ->whereIn('status', ['in_progress', 'pending'])
            ->where(function ($query) {
                $query->where('created_by', auth()->id())
                    ->orWhere('processed_by', auth()->id());
            })
            ->limit(10)
            ->get();

        $activeProposals = ProposalResource::collection($activeProposals);

        return inertia('Dashboard', compact(
            'totalProposals',
            'myPendingProposals',
            'myInProgressProposals',
            'myApprovedProposals',
            'myRejectedProposals',
            'activeProposals'
        ));
    }
}
