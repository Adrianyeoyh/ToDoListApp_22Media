<?php

namespace App\Data;

use Spatie\LaravelData\Data;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Illuminate\Support\Carbon;


class ToDoListData extends Data
{
    public function __construct(
        public int $id,
        public string $name,
        public Carbon $created_at,
        public Carbon $updated_at,

        #[DataCollectionOf(TodoData::class)]
        public array $todos,
    ) {}
}
