import { useEffect, useState } from "react";
import TaskTable from "../components/tasks/TaskTable";

const API_URL = "http://localhost:5000/api/tasks";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [pagination, setPagination] = useState(null);

  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [minScore, setMinScore] = useState("");
  const [maxScore, setMaxScore] = useState("");
  const [dueAfter, setDueAfter] = useState("");
  const [dueBefore, setDueBefore] = useState("");

  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [taskType, setTaskType] = useState("");

  const fetchTasks = async (targetPage = page) => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams({
        page: targetPage,
        limit: 50,
      });

      if (search) params.set("search", search);
      if (department) params.set("department", department);
      if (taskType) params.set("taskType", taskType);
      if (minScore) params.set("minScore", minScore);
      if (maxScore) params.set("maxScore", maxScore);
      if (dueAfter) params.set("dueAfter", dueAfter);
      if (dueBefore) params.set("dueBefore", dueBefore);

      const response = await fetch(`${API_URL}?${params.toString()}`);

      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }

      const result = await response.json();

      setTasks(result.data || []);
      setPagination(result.pagination || null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks(page);
  }, [page]);

  const applyFilters = () => {
    setPage(1);
    fetchTasks(1);
  };

  const clearFilters = () => {
    setSearch("");
    setDepartment("");
    setMinScore("");
    setMaxScore("");
    setDueAfter("");
    setDueBefore("");
    setPage(1);
    setTaskType("");

    setTimeout(() => {
      fetchTasks(1);
    }, 0);
  };

  return (
    <div style={{ padding: "24px", fontFamily: "Arial, sans-serif" }}>
      <h1>Railway AI — Work List</h1>

      <p>Unified list of pending defects and overdue maintenance jobs.</p>

      <div
        style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
          marginBottom: "20px",
        }}
      >
        <input
          type="text"
          placeholder="Search task, asset, description..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <select
          value={department}
          onChange={(event) => setDepartment(event.target.value)}
        >
          <option value="">All Departments</option>
          <option value="Track">Track</option>
          <option value="OHE">OHE</option>
          <option value="Signalling">Signalling</option>
        </select>

        <select
          value={taskType}
          onChange={(event) => setTaskType(event.target.value)}
        >
          <option value="">All Task Types</option>
          <option value="Defect">Defect</option>
          <option value="Maintenance">Maintenance</option>
        </select>

        <input
          type="number"
          placeholder="Min score"
          value={minScore}
          onChange={(event) => setMinScore(event.target.value)}
        />

        <input
          type="number"
          placeholder="Max score"
          value={maxScore}
          onChange={(event) => setMaxScore(event.target.value)}
        />

        <input
          type="date"
          value={dueAfter}
          onChange={(event) => setDueAfter(event.target.value)}
        />

        <input
          type="date"
          value={dueBefore}
          onChange={(event) => setDueBefore(event.target.value)}
        />

        <button onClick={applyFilters}>Apply</button>

        <button onClick={clearFilters}>Clear</button>
      </div>

      {loading && <p>Loading tasks...</p>}

      {error && <p>{error}</p>}

      {!loading && !error && (
        <>
          <p>
            Showing {tasks.length} tasks
            {pagination && ` of ${pagination.total}`}
          </p>

          <TaskTable tasks={tasks} />

          {tasks.length === 0 && <p>No pending tasks found.</p>}

          {pagination && pagination.totalPages > 1 && (
            <div style={{ marginTop: "20px" }}>
              <button disabled={page === 1} onClick={() => setPage(page - 1)}>
                Previous
              </button>

              <span style={{ margin: "0 15px" }}>
                Page {page} of {pagination.totalPages}
              </span>

              <button
                disabled={page === pagination.totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Tasks;
