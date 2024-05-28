import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import SelectInput from "@/Components/SelectInput";
import TextAreaInput from "@/Components/TextAreaInput";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";

export default function Create({ auth, departments }) {
  const { data, setData, post, errors, reset } = useForm({
    images: '',
    title: '',
    description: '',
    department_id: '',
  });

  const onSubmit = (e) => {
    e.preventDefault();
    post(route('proposal.store'));
  }

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            Create New Proposal
          </h2>
        </div>
      }
    >
      <Head title="Proposals" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
            <form
              onSubmit={onSubmit}
              className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg"
            >
              <div>
                <InputLabel
                  htmlFor="proposal_image_path"
                  value="Proposal Images"
                />
                <TextInput
                  id="proposal_image_path"
                  type="file"
                  name="images"
                  multiple
                  accept="image/jpeg,image/png"
                  className="mt-1 block w-full"
                  onChange={(e) => setData('images', Array.from(e.target.files))}
                />
                <InputError message={errors.images} className="mt-2" />
              </div>
              <div className="mt-4">
                <InputLabel
                  htmlFor="proposal_title"
                  value="Proposal Title"
                />
                <TextInput
                  id="proposal_title"
                  type="text"
                  name="title"
                  value={data.title}
                  className="mt-1 block w-full"
                  isFocused={true}
                  onChange={(e) => setData('title', e.target.value)}
                />
                <InputError message={errors.title} className="mt-2" />
              </div>
              <div className="mt-4">
                <InputLabel
                  htmlFor="proposal_description"
                  value="Proposal Description"
                />
                <TextAreaInput
                  id="proposal_description"
                  name="description"
                  value={data.description}
                  className="mt-1 block w-full"
                  isFocused={true}
                  onChange={(e) => setData('description', e.target.value)}
                />
                <InputError message={errors.description} className="mt-2" />
              </div>
              <div className="mt-4">
                <InputLabel
                  htmlFor="proposal_department_id"
                  value="Proposal Department"
                />
                <SelectInput
                  name="department_id"
                  id="proposal_department_id"
                  className="mt-1 block w-full"
                  onChange={(e) => setData('department_id', e.target.value)}
                  defaultValue="DEFAULT"
                >
                  <option value="DEFAULT" disabled>Select Department</option>
                  {departments.map((department) => (
                    <option key={department.id} value={department.id}>
                      {department.name}
                    </option>
                  ))}
                </SelectInput>
                <InputError message={errors.department_id} className="mt-2" />
              </div>
              <div className="mt-4 text-right">
                <Link
                  href={route('proposal.index')}
                  className="bg-gray-500 py-1 px-3 text-gray-800 rounded shadow transition-all hover:bg-gray-200 mr-2"
                >
                  Cancel
                </Link>
                <button
                  className="bg-emerald-500 py-1 px-3 text-white rounded shadow transition-all hover:bg-emerald-600 mr-2"
                >
                  Submit
                </button>

              </div>
            </form>
          </div>
        </div>
      </div>

    </AuthenticatedLayout>
  )
}
