<?php

namespace App\Data;

use Spatie\LaravelData\Data;

class ToDoData extends Data
{
    public function __construct(
        public string $description,
        public bool $is_done,
    ) {}
}