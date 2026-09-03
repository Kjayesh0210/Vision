import { Link } from "react-router-dom";

function TaskTable({ tasks }) {
  return (
    <>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: "20px",
        }}
      >
        <thead>
          <tr>
            <th>Task ID</th>
            <th>Department</th>
            <th>Asset</th>
            <th>Type</th>
            <th>Description</th>
            <th>Due Date</th>
            <th>Risk</th>
          </tr>
        </thead>

        <tbody>
          {tasks.map((task) => (
            <tr key={task.taskId}>
              <td>{task.taskId}</td>
              <td>{task.department}</td>
              <td>
                {task.assetId ? (
                  <Link to={`/assets/${task.assetId}`}>{task.assetId}</Link>
                ) : (
                  "-"
                )}
              </td>

              <td>
                <strong>{task.taskType}</strong>
              </td>

              <td>{task.description || "-"}</td>

              <td>
                {task.dueDate
                  ? new Date(task.dueDate).toLocaleDateString()
                  : "-"}
              </td>

              <td>
                {task.risk ? (
                  <div>
                    <strong>{task.risk.riskLevel}</strong>
                    <br />
                    {task.risk.riskScore.toFixed(2)}
                  </div>
                ) : (
                  "-"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {tasks.length === 0 && <p>No pending tasks found.</p>}
    </>
  );
}

export default TaskTable;
