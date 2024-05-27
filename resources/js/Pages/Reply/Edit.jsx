import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextAreaInput from "@/Components/TextAreaInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";

export default function Edit({ auth, reply }) {
  const { data, setData, post, errors, reset } = useForm({
    content: reply.content || '',
    proposal_id: reply.getProposal.id,
    _method: 'PUT',
  });

  const onSubmit = (e) => {
    e.preventDefault();
    post(route('reply.update', reply.id));
  }

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            Edit Reply
          </h2>
        </div>
      }
    >
      <Head title="Replies" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
            <form
              onSubmit={onSubmit}
              className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg"
            >
              <div className="mt-4">
                <InputLabel
                  htmlFor="reply_content"
                  value="Reply Content"
                />
                <TextAreaInput
                  id="reply_content"
                  name="content"
                  value={data.content}
                  className="mt-1 block w-full"
                  isFocused={true}
                  onChange={(e) => setData('content', e.target.value)}
                />
                <InputError message={errors.content} className="mt-2" />
              </div>
              <div className="mt-4 text-right">
                <Link
                  href={route('reply.index')}
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
