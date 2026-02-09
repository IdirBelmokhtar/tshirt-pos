<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\Category;
use App\Models\Brand;
use App\Models\Unit;
use Faker\Factory as Faker;
use Illuminate\Support\Facades\DB;

class ProductSeeder extends Seeder
{
    public function run()
    {
        $faker = Faker::create();

        // Create random categories
        for ($i = 0; $i < 10; $i++) {
            Category::create([
                'name' => $faker->word(),
            ]);
        }

        // Create random brands
        for ($i = 0; $i < 10; $i++) {
            Brand::create([
                'name' => $faker->company(),
            ]);
        }

        // Create random products
        for ($i = 0; $i < 50; $i++) {
            $maxSku = Product::where('sku', 'like', 'N%')
                ->select(DB::raw('MAX(CAST(SUBSTRING(sku, 2) AS UNSIGNED)) as max_number'))
                ->first();

            $number = $maxSku->max_number ? $maxSku->max_number + 1 : 1;
            $sku = 'N' . str_pad($number, 5, '0', STR_PAD_LEFT);

            Product::create([
                'image' => '',
                'name' => $faker->name(),
                'slug' => $faker->slug(),
                'sku' => $sku,
                'description' => $faker->paragraph(),
                'category_id' => Category::inRandomOrder()->first()->id,
                'price' => $faker->numberBetween(101, 1000),
                'purchase_price' => $faker->numberBetween(1, 900),
                'quantity' => 10,
                'status' => 1,
            ]);
        }
    }
}
