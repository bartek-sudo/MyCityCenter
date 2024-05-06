import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import SelectInput from "@/Components/SelectInput";
import TextAreaInput from "@/Components/TextAreaInput";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";

export default function Edit({ auth, proposal, departments }) {
  const { data, setData, post, errors, reset } = useForm({
    image: '',
    title: proposal.title || '',
    description: proposal.description || '',
    department_id: proposal.department_id || '',
    status: proposal.status || '',
    processed_by: proposal.processed_by || '',
    _method: 'PUT',
  });

  const onSubmit = (e) => {
    e.preventDefault();
    post(route('proposal.update', proposal.id));
  }

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            Edit Proposal - "{proposal.title}"
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
                  value="Select Department"
                />
                <SelectInput
                  name="department_id"
                  id="proposal_department_id"
                  className="mt-1 block w-full"
                  value={data.department_id}
                  onChange={(e) => setData('department_id', e.target.value)}
                >
                  <option disabled >Select Department</option>
                  {departments.map((department) => (
                    <option key={department.id} value={department.id} >
                      {department.name}
                    </option>
                  ))}
                </SelectInput>
                <InputError message={errors.department_id} className="mt-2" />
              </div>
              <div className="mt-4">
                <InputLabel
                  htmlFor="proposal_image_path"
                  value="Proposal Image"
                />
                <TextInput
                  id="proposal_image_path"
                  type="file"
                  name="image"
                  className="mt-1 block w-full"
                  onChange={(e) => setData('image', e.target.files[0])}
                />
                <InputError message={errors.image} className="mt-2" />
              </div>
              {proposal.image_path && (
                <div className="mt-4">
                  <img
                    src={proposal.image_path}
                    alt={proposal.title}
                    className="w-32 h-32 object-cover"
                  />
                </div>
              )}
              {(auth.user.role_id === 2 || auth.user.role_id === 3) &&
                <div className="mt-4">
                  <InputLabel
                    htmlFor="proposal_status"
                    value="Change Status"
                  />
                  <SelectInput
                    name="status"
                    id="proposal_status"
                    className="mt-1 block w-full"
                    value={data.status}
                    onChange={(e) => setData('status', e.target.value)}
                  >
                    <option disabled >Select Status</option>
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </SelectInput>
                  <InputError message={errors.status} className="mt-2" />
                </div>
              }

              {(auth.user.role_id === 2) &&
                <div className="mt-4 flex">
                  <TextInput
                    id="proposal_processed_by"
                    type="checkbox"
                    name="processed_by"
                    className="mt-1 block "
                    onChange={(e) => setData('processed_by', e.target.checked ? auth.user.id : '')}
                  />
                  <InputLabel
                    htmlFor="proposal_processed_by"
                    value="Take the proceedings on yourself"
                  />
                  <InputError message={errors.processed_by} className="mt-2" />
                </div>
              }

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
