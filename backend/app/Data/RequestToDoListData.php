<?php

namespace App\Data;

use Spatie\LaravelData\Data;
use Spatie\LaravelData\Attributes\DataCollectionOf;


class ToDoListData extends Data
{
    public function __construct(
        public string $name,
    ) {}
}
