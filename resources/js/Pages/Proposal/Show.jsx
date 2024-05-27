import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import Pagination from "@/Components/Pagination";
import TextAreaInput from "@/Components/TextAreaInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { PROPOSAL_STATUS_CLASS_MAP, PROPOSAL_STATUS_TEXT_MAP } from "@/constants";
import { Head, router, useForm } from "@inertiajs/react";
import { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid'

export default function Show({ auth, proposal, replies, }) {
  const { data: data1, setData: setData1, post: post1, errors: errors1, reset: reset1 } = useForm({
    content: '',
    proposal_id: proposal.id,
  });

  const onSubmit = (e) => {
    e.preventDefault();
    post1(route('reply.store'), {
      preserveScroll: true,
    });
  }

  const { data: data2, setData: setData2, post: post2, errors: errors2, reset: reset2 } = useForm({
    content: '',
    proposal_id: proposal.id,
    _method: 'PUT',
  });

  const onEditSubmit = (e) => {
    e.preventDefault();
    post2(route('reply.update', editingReply.id), {
      preserveScroll: true,
    });
  }

  const deleteReply = (reply) => {
    if (!window.confirm('Are you sure you want to delete this reply?')) {
      return;
    }
    router.delete(route('reply.destroy', reply.id), {
      preserveScroll: true,
    });
  }

  const [editingReply, setEditingReply] = useState(null);

  const showEditModal = (reply) => {
    if (editingReply === reply) {
      setEditingReply(null);
      return;
    }
    setData2('content', reply.content);
    setEditingReply(reply);
  };

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleNextImage = () => {
    setCurrentImageIndex((currentImageIndex + 1) % proposal.image_paths.length);
  };

  const handlePreviousImage = () => {
    setCurrentImageIndex((currentImageIndex - 1 + proposal.image_paths.length) % proposal.image_paths.length);
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">{`Proposal "${proposal.title}"`}</h2>}
    >
      <Head title={`Proposal "${proposal.title}"`} />
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900 dark:text-gray-100">
              <div className="p-6 text-gray-900 dark:text-gray-100">
                <div className="grid gap-1 grid-cols-2 mt-2">
                  <div>
                    <div>
                      <label className="font-bold text-lg">Proposal ID</label>
                      <p className="mt-1">{proposal.id}</p>
                    </div>
                    <div className="mt-4">
                      <label className="font-bold text-lg">Proposal Title</label>
                      <p className="mt-1">{proposal.title}</p>
                    </div>

                    <div className="mt-4">
                      <label className="font-bold text-lg">Proposal Status</label>
                      <p className="mt-1">
                        <span
                          className={
                            "px-2 py-1 rounded text-white " +
                            PROPOSAL_STATUS_CLASS_MAP[proposal.status]
                          }
                        >
                          {PROPOSAL_STATUS_TEXT_MAP[proposal.status]}
                        </span>
                      </p>
                    </div>
                    <div className="mt-4">
                      <label className="font-bold text-lg">Created By</label>
                      <p className="mt-1">{proposal.createdBy.name}</p>
                    </div>
                  </div>
                  <div>
                    <div>
                      <label className="font-bold text-lg">Create Date</label>
                      <p className="mt-1">{proposal.created_at}</p>
                    </div>
                    <div className="mt-4">
                      <label className="font-bold text-lg">Last Update</label>
                      <p className="mt-1">{proposal.updated_at}</p>
                    </div>
                    <div className="mt-4">
                      <label className="font-bold text-lg">Processed By</label>
                      <p className="mt-1">{proposal.processedBy && proposal.processedBy.name}</p>
                    </div>
                    <div className="mt-4">
                      <label className="font-bold text-lg">Department</label>
                      <p className="mt-1">{proposal.department}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="font-bold text-lg">Proposal Description</label>
                  <p className="mt-1">{proposal.description}</p>
                </div>
                <div className="mt-4 ">
                  <label className="font-bold text-lg">Images</label>
                  {proposal.image_paths.length === 0 ? (
                    <p className="mt-1">No images available</p>
                  ) : (
                    <div className="mt-4 flex justify-center">
                      <button onClick={handlePreviousImage}>
                        <ChevronLeftIcon className="w-6 h-6" />
                      </button>
                      <img src={proposal.image_paths[currentImageIndex]} alt="" className=" max-h-120 object-cover" />
                      <button onClick={handleNextImage}>
                        <ChevronRightIcon className="w-6 h-6" />
                      </button>
                    </div>
                  )}

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pb-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900 dark:text-gray-100">
              <div className="flex justify-between items-center">
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Replies</h2>
              </div>
              <div className="overflow-auto">
                {replies.data.map((reply) => (
                  <div key={reply.id} className=" border-b border-gray-200 dark:border-gray-700 py-2">
                    <div className="flex justify-between items-center">
                      <p className="text-lg font-semibold">{reply.createdBy.name}</p>
                      {reply.createdBy.id === auth.user.id && (
                        <div>
                          <button
                            onClick={(e) => showEditModal(reply)}
                            className="font-medium text-blue-600 dark:text-blue-500 hover:underline mx-1">
                            Edit
                          </button>
                          <button
                            onClick={(e) => deleteReply(reply)}
                            className="font-medium text-red-600 dark:text-red-500 hover:underline mx-1"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                    {editingReply === reply ? (
                      <form onSubmit={onEditSubmit}>
                        <InputLabel
                          htmlFor="reply_content"
                          value="Edit Reply"
                        />
                        <TextAreaInput
                          id="reply_content"
                          name="content"
                          value={data2.content}
                          className="mt-1 block w-full"
                          isFocused={true}
                          onChange={(e) => setData2('content', e.target.value)}
                        />
                        <InputError message={errors2.description} className="mt-2" />
                        <div className="mt-2 text-right">
                          <button
                            className="bg-emerald-500 py-2 px-3 text-white rounded shadow transition-all hover:bg-emerald-600"
                          >
                            Save
                          </button>
                        </div>
                      </form>
                    ) : (
                      <p className="text-gray-700 dark:text-gray-400">{reply.content}</p>
                    )}
                    <div >
                      <p className="text-sm text-gray-500 dark:text-gray-400">Created At: {reply.created_at}</p>
                      {reply.updated_at && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">Updated At: {reply.updated_at}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Pagination links={replies.meta.links} />

            <form
              onSubmit={onSubmit}
              className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg"
            >
              <div className="mt-2">
                <InputLabel
                  className="text-xl text-center"
                  htmlFor="reply_content"
                  value="New Reply"
                />
                <TextAreaInput
                  id="reply_content"
                  name="content"
                  value={data1.content}
                  className="mt-2 block w-full"
                  isFocused={true}
                  onChange={(e) => setData1('content', e.target.value)}
                />
                <InputError message={errors1.content} className="mt-2" />
              </div>
              <div className="mt-4 text-right">
                <button
                  className="bg-emerald-500 py-3 px-3 text-white rounded shadow transition-all hover:bg-emerald-600"
                >
                  Add New Reply
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
