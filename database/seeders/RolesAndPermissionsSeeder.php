<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
         // Create permissions for Issue model
         Permission::create(['name' => 'create issue']);
         Permission::create(['name' => 'update issue']);
         Permission::create(['name' => 'view issue']);
         Permission::create(['name' => 'delete issue']);
 
         // Create roles
         $adminRole = Role::create(['name' => 'admin']);
         $userRole = Role::create(['name' => 'user']);
 
         // Assign permissions to roles
         $adminRole->givePermissionTo('create issue');
         $adminRole->givePermissionTo('update issue');
         $adminRole->givePermissionTo('view issue');
         $adminRole->givePermissionTo('delete issue');
 
         $userRole->givePermissionTo('view issue');
    }
}
