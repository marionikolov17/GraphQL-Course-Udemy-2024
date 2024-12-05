import { useState } from 'react';
import JobList from '../components/JobList';
import { useJobs } from '../lib/graphql/hooks';
import PaginationBar from '../components/PaginationBar';

const JOBS_PER_PAGE = 5;

function HomePage() {
  const [currentPage, setCurrentPage] = useState(1);

  const { jobs, loading, error } = useJobs(JOBS_PER_PAGE, (currentPage - 1) * JOBS_PER_PAGE);

  if (loading) return <div>Loading...</div>

  if (error) return <div>Data unavailable</div>

  return (
    <div>
      <h1 className="title">
        Job Board
      </h1>
      <PaginationBar 
        currentPage={currentPage}
        totalPages={Math.ceil(jobs.totalCount / JOBS_PER_PAGE)}
        onPageChange={setCurrentPage}
      />
      <JobList jobs={jobs.items} />
    </div>
  );
}

export default HomePage;
