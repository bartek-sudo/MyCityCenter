import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";

export default function Index({ auth, departments, success }) {

  const deleteDepartment = (department) => {
    if (!window.confirm('Are you sure you want to delete this department?')) {
      return;
    }
    router.delete(route('department.destroy', department.id));
  }

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            Departments
          </h2>
          {auth.user && auth.user.role_id === 3 &&
            <Link
              className="bg-emerald-500 py-1 px-3 text-white rounded shadow transition-all hover:bg-emerald-600"
              href={route('department.create')}
            >
              Add New Department
            </Link>
          }

        </div>
      }
    >
      <Head title="Departments" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {success && (
            <div className="bg-emerald-500 py-2 px-4 text-white rounded mb-4">
              {success}
            </div>
          )}

          {/* <pre className="text-white">{JSON.stringify(departments, null, 3)}</pre> */}
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900 dark:text-gray-100">
              <div className="flex flex-wrap justify-center py-10">

                {departments.data.map((department) => (
                  <div key={department.id} className="w-64 h-64 max-w-sm rounded overflow-hidden shadow-lg border-2 mr-4 mb-4">
                    <div className="px-6 py-4 h-full">
                      <div className="font-bold text-xl mb-2">{department.name}</div>
                      <p className="text-gray-500">
                        {department.description}
                      </p>
                      {auth.user && auth.user.role_id === 3 &&
                      <div className="flex justify-center items-center h-20">
                        <Link href={route('department.edit', department.id)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline mx-1">
                          Edit
                        </Link>
                        <button
                          onClick={(e) => deleteDepartment(department)}
                          className="font-medium text-red-600 dark:text-red-500 hover:underline mx-1"
                        >
                          Delete
                        </button>
                      </div>
                      }
                    </div>
                  </div>
                ))}


              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}


