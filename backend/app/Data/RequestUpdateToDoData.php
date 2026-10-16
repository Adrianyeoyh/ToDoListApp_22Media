<?php

namespace App\Data;

use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;

/**
 * Input shape for updating a todo: only the description and done state can change; fields left out stay unchanged.
 */
class RequestUpdateToDoData extends Data
{
    public function __construct(
        #[Max(255)]
        public string|Optional $description,
        public bool|Optional $is_done,
    ) {}
}
