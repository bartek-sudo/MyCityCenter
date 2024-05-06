import Pagination from "@/Components/Pagination";
import SelectInput from "@/Components/SelectInput";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { PROPOSAL_STATUS_CLASS_MAP, PROPOSAL_STATUS_TEXT_MAP } from "@/constants";
import { Head, Link, router } from "@inertiajs/react";
import TableHeading from "@/Components/TableHeading";

export default function Index({ auth, proposals, queryParams = null, success }) {

  queryParams = queryParams || {};

  const searchFieldChanged = (name, value) => {
    if (value) {
      queryParams[name] = value;
    } else {
      delete queryParams[name];
    }
    router.get(route('proposal.index', queryParams));
  }

  const onKeyPress = (name, e) => {
    if (e.key === 'Enter') {
      searchFieldChanged(name, e.target.value);
    }
  }

  const sortChanged = (name) => {
    if (queryParams.sort_field === name) {
      queryParams.sort_direction = queryParams.sort_direction === "asc" ? "desc" : "asc";
    } else {
      queryParams.sort_field = name;
      queryParams.sort_direction = "asc";
    }
    router.get(route('proposal.index', queryParams));
  }

  const deleteProposal = (proposal) => {
    if (!window.confirm('Are you sure you want to delete this proposal?')) {
      return;
    }
    router.delete(route('proposal.destroy', proposal.id));
  }

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            Proposals
          </h2>
          <Link
            className="bg-emerald-500 py-1 px-3 text-white rounded shadow transition-all hover:bg-emerald-600"
            href={route('proposal.create')}
          >
            Create New Proposal
          </Link>
        </div>
      }
    >
      <Head title="Proposals" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {success && (
            <div className="bg-emerald-500 py-2 px-4 text-white rounded mb-4">
              {success}
            </div>
          )}
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900 dark:text-gray-100">
              <div className="overflow-auto">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  <thead className="text:xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                    <tr>
                      <TableHeading
                        name="id"
                        sort_field={queryParams.sort_field}
                        sort_direction={queryParams.sort_direction}
                        sortChanged={sortChanged}
                      >ID</TableHeading>
                      <TableHeading
                        name="title"
                        sort_field={queryParams.sort_field}
                        sort_direction={queryParams.sort_direction}
                        sortChanged={sortChanged}
                      >Title</TableHeading>
                      <TableHeading
                        name="status"
                        sort_field={queryParams.sort_field}
                        sort_direction={queryParams.sort_direction}
                        sortChanged={sortChanged}
                      >Status</TableHeading>
                      <TableHeading
                        name="created_by"
                        sort_field={queryParams.sort_field}
                        sort_direction={queryParams.sort_direction}
                        sortChanged={sortChanged}
                      >Created by</TableHeading>
                      <TableHeading
                        name="created_at"
                        sort_field={queryParams.sort_field}
                        sort_direction={queryParams.sort_direction}
                        sortChanged={sortChanged}
                      >Created At</TableHeading>
                      <TableHeading
                        name="processed_by"
                        sort_field={queryParams.sort_field}
                        sort_direction={queryParams.sort_direction}
                        sortChanged={sortChanged}
                      >Processed By</TableHeading>
                      <TableHeading
                        name="updated_at"
                        sort_field={queryParams.sort_field}
                        sort_direction={queryParams.sort_direction}
                        sortChanged={sortChanged}
                      >Updated At</TableHeading>
                      <TableHeading
                        name="department_id"
                        sort_field={queryParams.sort_field}
                        sort_direction={queryParams.sort_direction}
                        sortChanged={sortChanged}
                      >Department</TableHeading>

                      <th className="px-3 py-3 text-right ">Actions</th>
                    </tr>
                  </thead>
                  <thead className="text:xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                    <tr>
                      <th className="px-3 py-3"></th>
                      <th className="px-3 py-3">
                        <TextInput
                          className="w-full"
                          defaultValue={queryParams.title}
                          placeholder="Search by title"
                          onBlur={(e) => searchFieldChanged('title', e.target.value)}
                          onKeyPress={(e) => onKeyPress('title', e)}
                        />
                      </th>
                      <th className="px-3 py-3">
                        <SelectInput className="w-full "
                          defaultValue={queryParams.status}
                          onChange={(e) => searchFieldChanged('status', e.target.value)}
                        >
                          <option value="">Select Status</option>
                          <option value="pending">Pending</option>
                          <option value="in_progress">In Progress</option>
                          <option value="approved">Completed</option>
                          <option value="rejected">Rejected</option>
                        </SelectInput>
                      </th>
                      <th className="px-3 py-3"></th>
                      <th className="px-3 py-3"></th>
                      <th className="px-3 py-3"></th>
                      <th className="px-3 py-3"></th>
                      <th className="px-3 py-3"></th>
                      <th className="px-3 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {proposals.data.map((proposal) => (
                      <tr key={proposal.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-3 py-2">{proposal.id}</td>
                        <th className="px-3 py-2 text-gray-100 text-nowrap hover:underline">
                          <Link href={route('proposal.show', proposal.id)} >
                            {proposal.title}
                          </Link>
                        </th>
                        <td className="px-3 py-2 text-nowrap">
                          <span
                            className={
                              "px-2 py-1 rounded text-white " +
                              PROPOSAL_STATUS_CLASS_MAP[proposal.status]
                            }
                          >
                            {PROPOSAL_STATUS_TEXT_MAP[proposal.status]}
                          </span>
                        </td>
                        <td className="px-3 py-2">{proposal.createdBy.name}</td>
                        <td className="px-3 py-2 text-nowrap">{proposal.created_at}</td>
                        <td className="px-3 py-2">{proposal.processedBy && proposal.processedBy.name}</td>
                        <td className="px-3 py-2 text-nowrap">{proposal.updated_at}</td>
                        <td className="px-3 py-2">{proposal.department}</td>
                        <td className="px-3 py-2 text-nowrap">
                          <Link href={route('proposal.edit', proposal.id)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline mx-1">
                            Edit
                          </Link>
                          <button
                            onClick={(e) => deleteProposal(proposal)}
                            className="font-medium text-red-600 dark:text-red-500 hover:underline mx-1"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Pagination links={proposals.meta.links} />
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
