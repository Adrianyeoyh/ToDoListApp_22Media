<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TodoList extends Model
{
    protected $fillable = ['name'];
    
    public function todos()
    {
        return $this->hasMany(Todo::class);
    }
}
