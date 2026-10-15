<?php

namespace App\Data;

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
        public int $to_do_list_id,
        public string $created_at,
        public string $updated_at,
    ) {}
}
