<?php

namespace App\Data;

use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Data;

/**
 * Input shape for creating or updating a todo list: the client may only send the name.
 */
class RequestToDoListData extends Data
{
    public function __construct(
        #[Max(255)]
        public string $name,
    ) {}
}
