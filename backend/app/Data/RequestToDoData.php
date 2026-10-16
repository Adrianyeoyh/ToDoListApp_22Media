<?php

namespace App\Data;

use Spatie\LaravelData\Attributes\Validation\Exists;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Data;

/**
 * Input shape for creating or updating a todo: the client may only send the description and done state.
 */
class RequestToDoData extends Data
{
    public function __construct(
        #[Exists('to_do_lists', 'id')]
        public int $to_do_list_id,
        #[Max(255)]
        public string $description,
        public bool $is_done = false,
    ) {}
}
