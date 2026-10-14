<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TodoResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            "id" => (int) $this->id,
            "description" => (string) $this->description,
            "is_done" => (bool) $this->is_done,
            "todo_list_id" => (int) $this->todo_list_id,
            "created_at" => (string) $this->created_at,
            "updated_at" => (string) $this->updated_at
        ];
    }
}
