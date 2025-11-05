const mockPatients = [
  { id: 1, name: "Alice", age: 30, condition: "Flu" },
  { id: 2, name: "Bob", age: 45, condition: "Diabetes" },
];

function DoctorPage() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Doctor Page</h1>
      <table border="1" cellPadding="5" cellSpacing="0">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Age</th>
            <th>Condition</th>
          </tr>
        </thead>
        <tbody>
          {mockPatients.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.name}</td>
              <td>{p.age}</td>
              <td>{p.condition}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DoctorPage;
