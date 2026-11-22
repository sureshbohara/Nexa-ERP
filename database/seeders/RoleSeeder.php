<?php
namespace Database\Seeders;
use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $roles = [
            'Super Admin' => ['is_system' => true, 'modules' => ['*']],
            'Admin' => ['is_system' => true, 'modules' => ['*']],
            'Manager' => ['is_system' => false, 'modules' => ['dashboard', 'inventory', 'sales', 'purchase', 'hrm', 'reports']],
            'Employee' => ['is_system' => false, 'modules' => ['dashboard', 'inventory', 'hrm']],
        ];

        foreach ($roles as $roleName => $data) {
            $role = Role::updateOrCreate(['name' => $roleName, 'guard_name' => 'web'], ['is_system' => $data['is_system']]);

            if (in_array('*', $data['modules'])) {
                $permissionIds = Permission::where('guard_name', 'web')->pluck('id')->toArray();
            } else {
                $permissionIds = Permission::where('guard_name', 'web')->whereIn('module', $data['modules'])->pluck('id')->toArray();
            }
            $role->permissions()->sync($permissionIds);
        }
        $this->command->info('Roles and permissions assigned successfully!');
    }
}