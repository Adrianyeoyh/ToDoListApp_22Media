<?php

namespace App\Data;

use Illuminate\Support\Carbon;
use Spatie\LaravelData\Data;

/**
 * Output shape of a todo returned by the API.
 */
class ToDoData extends Data
{
    public function __construct(
        public int $id,
        public string $description,
        public bool $is_done,
        public int $todo_list_id,
        public Carbon $created_at,
        public Carbon $updated_at,
    ) {}
}
