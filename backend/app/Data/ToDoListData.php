<?php

namespace App\Data;

use Spatie\LaravelData\Data;
use Spatie\LaravelData\Attributes\DataCollectionOf;


class ToDoListData extends Data
{
    public function __construct(
        public int $id,
        public string $name,
        public string $created_at,
        public string $updated_at,

        #[DataCollectionOf(TodoData::class)]
        public array $todos,
    ) {}
}
