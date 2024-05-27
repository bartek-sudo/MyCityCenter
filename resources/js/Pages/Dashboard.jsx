import NavLink from '@/Components/NavLink';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PROPOSAL_STATUS_CLASS_MAP, PROPOSAL_STATUS_TEXT_MAP } from '@/constants';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard({ auth,
  myPendingProposals, totalProposals,
  myInProgressProposals,
  myApprovedProposals,
  myRejectedProposals,
  activeProposals }) {
  return (
    <AuthenticatedLayout
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Dashboard</h2>}
    >
      <Head title="Dashboard" />
      {auth.user ? (
        <div className="py-12">
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-center gap-2">
            <div className="flex-1 bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
              <div className="p-6 text-gray-900 dark:text-gray-100">
                <h3 className='text-amber-500 text-2xl font-semibold'>Pending Tasks</h3>
                <p className='text-xl mt-4'>
                  <span className='mr-2'>{myPendingProposals}</span>
                  /
                  <span className='ml-2'>{totalProposals}</span>
                </p>
              </div>
            </div>
            <div className="flex-1 bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
              <div className="p-6 text-gray-900 dark:text-gray-100">
                <h3 className='text-blue-500 text-2xl font-semibold'>In Progress Tasks</h3>
                <p className='text-xl mt-4'>
                  <span className='mr-2'>{myInProgressProposals}</span>
                  /
                  <span className='ml-2'>{totalProposals}</span>
                </p>
              </div>
            </div>
            <div className="flex-1 bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
              <div className="p-6 text-gray-900 dark:text-gray-100">
                <h3 className='text-green-500 text-2xl font-semibold'>Approved Tasks</h3>
                <p className='text-xl mt-4'>
                  <span className='mr-2'>{myApprovedProposals}</span>
                  /
                  <span className='ml-2'>{totalProposals}</span>
                </p>
              </div>
            </div>
            <div className="flex-1 bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
              <div className="p-6 text-gray-900 dark:text-gray-100">
                <h3 className='text-red-500 text-2xl font-semibold'>Rejected Tasks</h3>
                <p className='text-xl mt-4'>
                  <span className='mr-2'>{myRejectedProposals}</span>
                  /
                  <span className='ml-2'>{totalProposals}</span>
                </p>
              </div>
            </div>
          </div>
          <div className="mt-12 max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
              <div className="p-6 text-gray-900 dark:text-gray-100">
                <h3 className='text-gray-200 text-xl font-semibold'>
                  My Active Proposals
                </h3>
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  <thead className=" text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                    <tr>
                      <th className="px-3 py-3">ID</th>
                      <th className="px-3 py-3">Title</th>
                      <th className="px-3 py-3">Status</th>
                      <th className="px-3 py-3">Created At</th>
                    </tr>
                  </thead>
                  <tbody >
                    {activeProposals.data.map((proposal) => (
                      <tr key={proposal.id}>
                        <td className="px-3 py-3">{proposal.id}</td>
                        <td className="px-3 py-3 text-white font-bold hover:underline">
                          <Link href={route('proposal.show', proposal.id)} >
                            {proposal.title}
                          </Link>
                        </td>
                        <td className="px-3 py-3">
                          <span
                            className={
                              "px-2 py-1 rounded text-white " +
                              PROPOSAL_STATUS_CLASS_MAP[proposal.status]
                            }
                          >
                            {PROPOSAL_STATUS_TEXT_MAP[proposal.status]}
                          </span>
                        </td>
                        <td className="px-3 py-3">{proposal.created_at}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gray-800 min-h-screen">
          <div className="relative isolate px-6 lg:px-8">
            <div
              className="absolute inset-x-0 -z-10 transform-gpu overflow-hidden blur-3xl "
              aria-hidden="true"
            >
              <div
                className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
                style={{
                  clipPath:
                    'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                }}
              />
            </div>
            <div className="mx-auto max-w-2xl py-16 sm:py-20 lg:py-20">
              <div className="text-center">
                <h1 className="text-4xl font-bold tracking-tight text-gray-300 sm:text-6xl">
                  Make City Life Easier. Submit a Request in a Few Clicks!
                </h1>
                <p className="mt-6 text-lg leading-8 text-gray-400">
                  Manage City Requests Without Leaving Home. Everything You Need at Your Fingertips!
                </p>
                <div className="mt-10 flex items-center justify-center gap-x-6">

                  <NavLink href={route('register')}
                    className="bg-indigo-600 py-1 px-3 z-10 text-white leading-8 rounded shadow-sm transition-all hover:bg-indigo-500"
                    style={{ color: 'white' }}
                  >
                    Get started
                  </NavLink>
                  <NavLink href={route('department.index')} active={route().current('department.index')}
                    className="text-sm font-semibold leading-6 text-gray-500"
                  >
                    Learn more <span aria-hidden="true">→</span>
                  </NavLink>
                </div>
              </div>
            </div>
            <div
              className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
              aria-hidden="true"
            >
              <div
                className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
                style={{
                  clipPath:
                    'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                }}
              />
            </div>
          </div>
        </div>
      )}


    </AuthenticatedLayout>
  );
}
