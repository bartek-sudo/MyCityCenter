import Pagination from "@/Components/Pagination";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import TableHeading from "@/Components/TableHeading";

export default function Index({ auth, replies, queryParams = null }) {

  queryParams = queryParams || {};

  const searchFieldChanged = (name, value) => {
    if (value) {
      queryParams[name] = value;
    } else {
      delete queryParams[name];
    }
    router.get(route('reply.index', queryParams));
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
    router.get(route('reply.index', queryParams));
  }

  const deleteReply = (reply) => {
    if (!window.confirm('Are you sure you want to delete this reply?')) {
      return;
    }
    router.delete(route('reply.destroy', reply.id), {
      preserveScroll: true,
    });
  }

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Replies</h2>}
    >
      <Head title="Replies" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
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
                        name="proposal_id"
                        sort_field={queryParams.sort_field}
                        sort_direction={queryParams.sort_direction}
                        sortChanged={sortChanged}
                      >Proposal Name</TableHeading>
                      <TableHeading
                        name="content"
                        sort_field={queryParams.sort_field}
                        sort_direction={queryParams.sort_direction}
                        sortChanged={sortChanged}
                      >Content</TableHeading>
                      <TableHeading
                        name="user_id"
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
                      <th className="px-3 py-3 text-right ">Actions</th>
                    </tr>
                  </thead>
                  <thead className="text:xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                    <tr>
                      <th className="px-3 py-3"></th>
                      <th className="px-3 py-3">
                        <TextInput
                          className="w-full"
                          defaultValue={queryParams.proposal_name}
                          placeholder="Search by proposal name"
                          onBlur={(e) => searchFieldChanged('proposal_name', e.target.value)}
                          onKeyPress={(e) => onKeyPress('proposal_name', e)}
                        />
                      </th>
                      <th className="px-3 py-3">
                        <TextInput
                          className="w-full"
                          defaultValue={queryParams.content}
                          placeholder="Search by content"
                          onBlur={(e) => searchFieldChanged('content', e.target.value)}
                          onKeyPress={(e) => onKeyPress('content', e)}
                        />
                      </th>
                      <th className="px-3 py-3"></th>
                      <th className="px-3 py-3"></th>
                      <th className="px-3 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {replies.data.map((reply) => (
                      <tr key={reply.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-3 py-2">{reply.id}</td>
                        <td className="px-3 py-2">{reply.getProposal.title}</td>
                        <td className="px-3 py-2">{reply.content}</td>
                        <td className="px-3 py-2">{reply.createdBy.name}</td>
                        <td className="px-3 py-2 text-nowrap">{reply.created_at}</td>
                        <td className="px-3 py-2">
                          <Link href={route('reply.edit', reply.id)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline mx-1">
                            Edit
                          </Link>
                          <button
                            onClick={(e) => deleteReply(reply)}
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
              <Pagination links={replies.meta.links} />
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
