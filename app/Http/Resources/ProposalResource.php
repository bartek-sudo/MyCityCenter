<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class ProposalResource extends JsonResource
{
    public static $wrap = null;
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'department' => $this->department_id ? $this->department->name : '',
            'department_id' => $this->department_id,
            'status' => $this->status,
            'image_paths' => $this->image_paths ? array_map(fn ($path) => Storage::url($path), json_decode($this->image_paths, true)) : [],
            'createdBy' => new UserResource($this->createdBy),
            'processedBy' => $this->processedBy ? new UserResource($this->processedBy) : null,
            'processed_by' => $this->processed_by,
            'created_at' => (new Carbon($this->created_at))->format('Y-m-d'),
            'updated_at' => $this->updated_at ? (new Carbon($this->updated_at))->format('Y-m-d') : null,
        ];
    }
}
